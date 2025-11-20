import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, ETHEREUM_RPC_URL } from '../utils/constants';

// Contract ABI - will be updated after contract deployment
const CONTRACT_ABI = [
  'function issueCertificate(bytes32 certificateHash, string memory studentId, string memory ipfsHash) external',
  'function verifyCertificate(bytes32 certificateHash) external view returns (bool, address, string memory, uint256, string memory, bool)',
  'function revokeCertificate(bytes32 certificateHash) external',
  'event CertificateIssued(bytes32 indexed certificateHash, address indexed issuer, string studentId)',
  'event CertificateRevoked(bytes32 indexed certificateHash)',
];

export class BlockchainService {
  private provider: ethers.JsonRpcProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract | null = null;

  async connect() {
    if (typeof window.ethereum !== 'undefined') {
      // MetaMask is installed
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      this.provider = provider as any;
      this.signer = await provider.getSigner();
      
      if (CONTRACT_ADDRESS) {
        this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);
      }
      
      return true;
    } else {
      console.error('MetaMask not installed');
      return false;
    }
  }

  async getAccount(): Promise<string | null> {
    if (!this.signer) await this.connect();
    return this.signer ? await this.signer.getAddress() : null;
  }

  async issueCertificate(certificateHash: string, studentId: string, ipfsHash: string) {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const hashBytes = ethers.id(certificateHash); // Convert to bytes32
    const tx = await this.contract.issueCertificate(hashBytes, studentId, ipfsHash);
    const receipt = await tx.wait();
    return receipt;
  }

  async verifyCertificate(certificateHash: string) {
    if (!this.contract) {
      // Use read-only provider if no signer
      this.provider = new ethers.JsonRpcProvider(ETHEREUM_RPC_URL);
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.provider);
    }
    
    const hashBytes = ethers.id(certificateHash);
    const result = await this.contract.verifyCertificate(hashBytes);
    
    return {
      exists: result[0],
      issuer: result[1],
      studentId: result[2],
      issueDate: new Date(Number(result[3]) * 1000),
      ipfsHash: result[4],
      isRevoked: result[5],
    };
  }

  async revokeCertificate(certificateHash: string) {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const hashBytes = ethers.id(certificateHash);
    const tx = await this.contract.revokeCertificate(hashBytes);
    const receipt = await tx.wait();
    return receipt;
  }

  async getNetwork() {
    if (!this.provider) {
      this.provider = new ethers.JsonRpcProvider(ETHEREUM_RPC_URL);
    }
    return await this.provider.getNetwork();
  }
}

export const blockchainService = new BlockchainService();

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
