"""Quick test to verify blockchain service"""
import sys
sys.path.append('backend')

from app.services.blockchain_service import blockchain_service

print("Testing blockchain service...")
print(f"Connected: {blockchain_service.is_connected()}")
print(f"Contract loaded: {blockchain_service.contract is not None}")

if blockchain_service.contract:
    print(f"Contract address: {blockchain_service.contract.address}")
    
    # Test issue certificate
    print("\nTesting certificate issuance...")
    try:
        result = blockchain_service.issue_certificate(
            certificate_hash="test_hash_123",
            student_id="STU-TEST-001",
            ipfs_hash="Qm123456789"
        )
        print(f"✅ Certificate issued: {result['transaction_hash']}")
    except Exception as e:
        print(f"❌ Failed: {e}")
    
    # Test verify certificate
    print("\nTesting certificate verification...")
    try:
        result = blockchain_service.verify_certificate("test_hash_123")
        print(f"✅ Verification result: {result}")
    except Exception as e:
        print(f"❌ Failed: {e}")
else:
    print("❌ Contract not loaded")
