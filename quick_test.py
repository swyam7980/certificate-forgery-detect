"""Quick test to verify blockchain verification works"""
import requests
import json
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import hashlib
import os

def create_test_pdf():
    """Create a test certificate"""
    filename = "quick_test.pdf"
    c = canvas.Canvas(filename, pagesize=letter)
    c.drawString(100, 750, "CERTIFICATE OF COMPLETION")
    c.drawString(100, 700, "This certifies that John Doe")
    c.drawString(100, 650, "has completed Blockchain Development")
    c.save()
    return filename

def compute_hash(filename):
    """Compute SHA-256 hash"""
    with open(filename, 'rb') as f:
        return hashlib.sha256(f.read()).hexdigest()

print("\n" + "="*60)
print("  QUICK BLOCKCHAIN VERIFICATION TEST")
print("="*60)

# Step 1: Create PDF
print("\n[1/4] Creating test certificate...")
pdf_file = create_test_pdf()
cert_hash = compute_hash(pdf_file)
print(f"  Hash: {cert_hash[:16]}...")

# Step 2: Upload
print("\n[2/4] Uploading to blockchain...")
try:
    with open(pdf_file, 'rb') as f:
        response = requests.post(
            "http://localhost:8000/api/v1/institution/certificates",
            files={"pdfFile": f},
            data={
                "student_name": "John Doe",
                "student_id": "STU123",
                "course_name": "Blockchain Development",
                "issue_date": "2024-01-15"
            },
            timeout=30
        )
    
    if response.status_code == 200:
        result = response.json()
        print(f"  [OK] Upload successful")
        print(f"  Response keys: {list(result.keys())}")
        tx_hash = result.get('transactionHash') or result.get('transaction_hash') or 'unknown'
        print(f"  Transaction: {tx_hash[:16] if len(tx_hash) > 16 else tx_hash}...")
    else:
        print(f"  [FAIL] Upload failed: {response.status_code}")
        print(f"  Response: {response.text}")
        exit(1)
except Exception as e:
    print(f"  [FAIL] Upload error: {e}")
    import traceback
    traceback.print_exc()
    exit(1)

# Step 3: Verify
print("\n[3/4] Verifying on blockchain...")
try:
    verify_response = requests.post(
        "http://localhost:8000/api/v1/verifier/blockchain",
        json={"hash": cert_hash},
        timeout=30
    )
    
    if verify_response.status_code == 200:
        verify_result = verify_response.json()
        is_valid = verify_result.get("is_valid", False)
        blockchain_verified = verify_result.get("blockchain_verified", False)
        
        if is_valid and blockchain_verified:
            print(f"  [OK] Valid: {is_valid}")
            print(f"  [OK] Blockchain Verified: {blockchain_verified}")
            print(f"  [OK] Student: {verify_result.get('student_name', 'N/A')}")
            print(f"  [OK] Course: {verify_result.get('course_name', 'N/A')}")
        else:
            print(f"  [FAIL] is_valid={is_valid}, blockchain_verified={blockchain_verified}")
            print(f"  Response: {json.dumps(verify_result, indent=2)}")
            exit(1)
    else:
        print(f"  [FAIL] Verify failed: {verify_response.status_code}")
        print(f"  Response: {verify_response.text}")
        exit(1)
except Exception as e:
    print(f"  [FAIL] Verify error: {e}")
    exit(1)

# Step 4: Cleanup
print("\n[4/4] Cleaning up...")
os.remove(pdf_file)
print(f"  [OK] Removed {pdf_file}")

# Final result
print("\n" + "="*60)
print("  SUCCESS! BLOCKCHAIN VERIFICATION WORKING!")
print("="*60)
print("\n  The main issue (contract address mismatch) is FIXED!")
print("  All core functionality is operational.\n")
