from web3 import Web3
from web3.middleware import geth_poa_middleware
import json
from pathlib import Path
from app.config import settings
from typing import Optional, Dict, Any
import logging
import os

# Load .env if running tests
if not os.getenv('CONTRACT_ADDRESS'):
    from dotenv import load_dotenv
    env_path = Path(__file__).parent.parent.parent / '.env'
    if env_path.exists():
        load_dotenv(env_path)

logger = logging.getLogger(__name__)


class BlockchainService:
    def __init__(self):
        self.w3: Optional[Web3] = None
        self.contract = None
        self.account = None
        self._initialize()
    
    def _initialize(self):
        """Initialize Web3 connection and contract"""
        try:
            # Connect to Ethereum node
            self.w3 = Web3(Web3.HTTPProvider(settings.ETHEREUM_RPC_URL))
            
            # Add PoA middleware for local development
            self.w3.middleware_onion.inject(geth_poa_middleware, layer=0)
            
            if not self.w3.is_connected():
                logger.error("Failed to connect to Ethereum node")
                return
            
            logger.info(f"✅ Connected to Ethereum node at {settings.ETHEREUM_RPC_URL}")
            
            # Load contract ABI
            if settings.CONTRACT_ADDRESS:
                self._load_contract()
            else:
                logger.warning("⚠️ CONTRACT_ADDRESS not set in .env")
            
            # Setup account if private key is provided
            if settings.PRIVATE_KEY:
                self.account = self.w3.eth.account.from_key(settings.PRIVATE_KEY)
                logger.info(f"✅ Account loaded: {self.account.address}")
            else:
                logger.warning("⚠️ PRIVATE_KEY not set - using default account")
                accounts = self.w3.eth.accounts
                if accounts:
                    self.account = accounts[0]
                    logger.info(f"✅ Using default account: {self.account}")
                    
        except Exception as e:
            logger.error(f"Failed to initialize blockchain service: {e}")
    
    def _load_contract(self):
        """Load the smart contract"""
        try:
            contract_path = Path(__file__).parent.parent / "contracts" / "CertificateRegistry.json"
            
            if not contract_path.exists():
                logger.error(f"Contract ABI not found at {contract_path}")
                logger.info("Run: python copy_abi.py to copy the contract ABI")
                return
            
            with open(contract_path, 'r') as f:
                contract_data = json.load(f)
            
            contract_abi = contract_data['abi']
            
            self.contract = self.w3.eth.contract(
                address=Web3.to_checksum_address(settings.CONTRACT_ADDRESS),
                abi=contract_abi
            )
            
            logger.info(f"✅ Contract loaded at {settings.CONTRACT_ADDRESS}")
            
        except Exception as e:
            logger.error(f"Failed to load contract: {e}")
    
    def is_connected(self) -> bool:
        """Check if connected to blockchain"""
        return self.w3 is not None and self.w3.is_connected()
    
    def issue_certificate(
        self,
        certificate_hash: str,
        student_id: str,
        ipfs_hash: str
    ) -> Dict[str, Any]:
        """
        Issue a certificate on the blockchain
        
        Args:
            certificate_hash: Hash of the certificate PDF
            student_id: Student identifier
            ipfs_hash: IPFS hash of the certificate
            
        Returns:
            Transaction receipt
        """
        if not self.contract:
            raise Exception("Contract not loaded")
        
        if not self.is_connected():
            raise Exception("Not connected to blockchain")
        
        try:
            # Convert hash to bytes32
            hash_bytes = Web3.keccak(text=certificate_hash)
            
            # Build transaction
            if self.account and hasattr(self.account, 'address'):
                # Using private key account
                tx = self.contract.functions.issueCertificate(
                    hash_bytes,
                    student_id,
                    ipfs_hash
                ).build_transaction({
                    'from': self.account.address,
                    'nonce': self.w3.eth.get_transaction_count(self.account.address),
                    'gas': 2000000,
                    'gasPrice': self.w3.eth.gas_price
                })
                
                # Sign and send transaction
                signed_tx = self.w3.eth.account.sign_transaction(tx, self.account.key)
                tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            else:
                # Using unlocked account (Hardhat local)
                tx_hash = self.contract.functions.issueCertificate(
                    hash_bytes,
                    student_id,
                    ipfs_hash
                ).transact({'from': self.account})
            
            # Wait for transaction receipt
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            logger.info(f"✅ Certificate issued: {tx_hash.hex()}")
            
            return {
                'transaction_hash': tx_hash.hex(),
                'block_number': receipt['blockNumber'],
                'gas_used': receipt['gasUsed'],
                'status': receipt['status']
            }
            
        except Exception as e:
            logger.error(f"Failed to issue certificate: {e}")
            raise
    
    def verify_certificate(self, certificate_hash: str) -> Dict[str, Any]:
        """
        Verify a certificate on the blockchain
        
        Args:
            certificate_hash: Hash of the certificate to verify
            
        Returns:
            Certificate details from blockchain
        """
        if not self.contract:
            logger.error("❌ Contract not loaded - cannot verify certificate")
            raise Exception("Contract not loaded")
        
        if not self.is_connected():
            logger.error("❌ Not connected to blockchain")
            raise Exception("Not connected to blockchain")
        
        try:
            logger.info(f"🔗 Converting hash to bytes32: {certificate_hash}")
            # Convert hash to bytes32
            hash_bytes = Web3.keccak(text=certificate_hash)
            logger.info(f"📦 Hash bytes: {hash_bytes.hex()}")
            
            logger.info(f"📞 Calling verifyCertificate on contract...")
            # Call contract function
            result = self.contract.functions.verifyCertificate(hash_bytes).call()
            
            exists, issuer, student_id, issue_date, ipfs_hash, is_revoked = result
            
            logger.info(f"📊 Contract returned - exists: {exists}, issuer: {issuer}, student_id: {student_id}, is_revoked: {is_revoked}")
            
            verification_result = {
                'exists': exists,
                'issuer': issuer,
                'student_id': student_id,
                'issue_date': issue_date,
                'ipfs_hash': ipfs_hash,
                'is_revoked': is_revoked,
                'is_valid': exists and not is_revoked
            }
            
            logger.info(f"✅ Verification result: {verification_result}")
            return verification_result
            
        except Exception as e:
            logger.error(f"❌ Failed to verify certificate: {e}")
            logger.exception("Full exception traceback:")
            raise
    
    def revoke_certificate(self, certificate_hash: str) -> Dict[str, Any]:
        """
        Revoke a certificate on the blockchain
        
        Args:
            certificate_hash: Hash of the certificate to revoke
            
        Returns:
            Transaction receipt
        """
        if not self.contract:
            raise Exception("Contract not loaded")
        
        if not self.is_connected():
            raise Exception("Not connected to blockchain")
        
        try:
            # Convert hash to bytes32
            hash_bytes = Web3.keccak(text=certificate_hash)
            
            # Build transaction
            if self.account and hasattr(self.account, 'address'):
                tx = self.contract.functions.revokeCertificate(hash_bytes).build_transaction({
                    'from': self.account.address,
                    'nonce': self.w3.eth.get_transaction_count(self.account.address),
                    'gas': 200000,
                    'gasPrice': self.w3.eth.gas_price
                })
                
                signed_tx = self.w3.eth.account.sign_transaction(tx, self.account.key)
                tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            else:
                tx_hash = self.contract.functions.revokeCertificate(hash_bytes).transact({'from': self.account})
            
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            logger.info(f"✅ Certificate revoked: {tx_hash.hex()}")
            
            return {
                'transaction_hash': tx_hash.hex(),
                'block_number': receipt['blockNumber'],
                'gas_used': receipt['gasUsed'],
                'status': receipt['status']
            }
            
        except Exception as e:
            logger.error(f"Failed to revoke certificate: {e}")
            raise


# Global blockchain service instance
blockchain_service = BlockchainService()
