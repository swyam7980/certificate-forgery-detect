import json
import os
from pathlib import Path

def copy_contract_abi():
    """Copy the contract ABI from blockchain artifacts to backend"""
    blockchain_path = Path(__file__).parent.parent / "blockchain"
    backend_path = Path(__file__).parent
    
    abi_source = blockchain_path / "artifacts" / "contracts" / "CertificateRegistry.sol" / "CertificateRegistry.json"
    abi_dest = backend_path / "app" / "contracts" / "CertificateRegistry.json"
    
    if abi_source.exists():
        os.makedirs(abi_dest.parent, exist_ok=True)
        with open(abi_source, 'r') as f:
            contract_data = json.load(f)
        
        with open(abi_dest, 'w') as f:
            json.dump(contract_data, f, indent=2)
        
        print(f"Contract ABI copied to {abi_dest}")
        return True
    else:
        print(f"Contract ABI not found at {abi_source}")
        print("Please deploy the smart contract first: cd blockchain && npx hardhat run scripts/deploy.js --network localhost")
        return False

if __name__ == "__main__":
    copy_contract_abi()
