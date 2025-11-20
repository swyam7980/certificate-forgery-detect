"""
Diagnostic script to debug blockchain verification issue
"""
import sys
sys.path.append('backend')

from app.services.blockchain_service import blockchain_service
from web3 import Web3

print("=== Blockchain Service Diagnostic ===\n")

print(f"1. Connection Status: {blockchain_service.is_connected()}")
print(f"2. Contract Loaded: {blockchain_service.contract is not None}")

if blockchain_service.contract:
    print(f"3. Contract Address: {blockchain_service.contract.address}")
    print(f"4. Account: {blockchain_service.account}")
    
    # Test with a known hash
    test_hash = "f27e7366767eb4aa58b2ded38d99855739d56888d328bb0ba309053d4874f5d2"
    print(f"\n5. Testing verification with hash: {test_hash[:16]}...")
    
    try:
        # Try direct verification
        hash_bytes = Web3.keccak(text=test_hash)
        print(f"   Hash bytes (first 16): {hash_bytes.hex()[:32]}...")
        
        # Call contract
        result = blockchain_service.contract.functions.verifyCertificate(hash_bytes).call()
        print(f"   Raw result: {result}")
        
        exists, issuer, student_id, issue_date, ipfs_hash, is_revoked = result
        print(f"\n   Parsed result:")
        print(f"   - Exists: {exists}")
        print(f"   - Issuer: {issuer}")
        print(f"   - Student ID: {student_id}")
        print(f"   - Issue Date: {issue_date}")
        print(f"   - IPFS Hash: {ipfs_hash}")
        print(f"   - Is Revoked: {is_revoked}")
        
    except Exception as e:
        print(f"   ERROR: {e}")
        import traceback
        traceback.print_exc()
    
    # Try using the service method
    print(f"\n6. Testing via blockchain_service.verify_certificate()...")
    try:
        result = blockchain_service.verify_certificate(test_hash)
        print(f"   Result: {result}")
    except Exception as e:
        print(f"   ERROR: {e}")
        import traceback
        traceback.print_exc()
else:
    print("❌ Contract not loaded - cannot test")
    print("\nChecking configuration:")
    from app.config import settings
    print(f"   ETHEREUM_RPC_URL: {settings.ETHEREUM_RPC_URL}")
    print(f"   CONTRACT_ADDRESS: {settings.CONTRACT_ADDRESS}")
