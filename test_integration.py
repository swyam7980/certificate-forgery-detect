"""
Integration Test Script for CertifyChain
Tests end-to-end flow: Frontend -> Backend -> Blockchain
"""

import requests
import json
import time
from pathlib import Path


# Configuration
BACKEND_URL = "http://localhost:8000/api/v1"
FRONTEND_URL = "http://localhost:5174"
BLOCKCHAIN_RPC = "http://localhost:8545"


def print_section(title):
    """Print a formatted section header"""
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60 + "\n")


def test_backend_health():
    """Test if backend is running"""
    print_section("1. Testing Backend Health")
    
    try:
        response = requests.get(f"{BACKEND_URL}/health")
        print(f"✅ Backend is running: {response.status_code}")
        print(f"   Response: {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Backend health check failed: {e}")
        return False


def test_blockchain_connection():
    """Test if blockchain node is running"""
    print_section("2. Testing Blockchain Connection")
    
    try:
        response = requests.post(
            BLOCKCHAIN_RPC,
            json={
                "jsonrpc": "2.0",
                "method": "eth_blockNumber",
                "params": [],
                "id": 1
            }
        )
        result = response.json()
        block_number = int(result['result'], 16)
        print(f"✅ Blockchain is running")
        print(f"   Current block: {block_number}")
        return True
    except Exception as e:
        print(f"❌ Blockchain connection failed: {e}")
        return False


def create_test_certificate():
    """Create a test certificate PDF"""
    print_section("3. Creating Test Certificate")
    
    # Create a simple test PDF with unique content for each run
    import uuid
    unique_id = str(uuid.uuid4())
    
    test_content = f"""
    CERTIFICATE OF COMPLETION
    
    Certificate ID: {unique_id}
    
    This is to certify that
    John Doe
    
    has successfully completed
    Blockchain Development Course
    
    Issued on: 2024-01-15
    """.encode()
    
    test_pdf_path = Path("test_certificate.pdf")
    test_pdf_path.write_bytes(test_content)
    
    print(f"✅ Test certificate created: {test_pdf_path}")
    return test_pdf_path


def test_certificate_upload(pdf_path):
    """Test certificate upload through backend"""
    print_section("4. Testing Certificate Upload")
    
    try:
        # Use unique student ID for each test run
        import uuid
        unique_id = str(uuid.uuid4())[:8]
        student_id = f'STU-{unique_id}'
        
        with open(pdf_path, 'rb') as f:
            files = {'pdfFile': ('test_cert.pdf', f, 'application/pdf')}
            data = {
                'student_name': f'John Doe {unique_id}',
                'student_id': student_id,
                'course_name': 'Blockchain Development',
                'issue_date': '2024-01-15',
                'metadata': json.dumps({
                    'institution': 'Tech University',
                    'grade': 'A',
                    'credits': 4
                })
            }
            
            response = requests.post(
                f"{BACKEND_URL}/institution/certificates",
                files=files,
                data=data
            )
        
        if response.status_code == 200:
            result = response.json()
            result['_test_student_id'] = student_id  # Add for later use
            print(f"✅ Certificate uploaded successfully")
            print(f"   Certificate Hash: {result['certificate_hash']}")
            print(f"   Transaction Hash: {result['blockchain_tx_hash']}")
            print(f"   IPFS Hash: {result['ipfs_hash']}")
            print(f"   Certificate ID: {result['certificate_id']}")
            print(f"   Message: {result['message']}")
            return result
        else:
            print(f"❌ Upload failed: {response.status_code}")
            print(f"   Error: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Certificate upload failed: {e}")
        import traceback
        traceback.print_exc()
        return None


def test_blockchain_verification(cert_hash):
    """Test blockchain verification"""
    print_section("5. Testing Blockchain Verification")
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/verifier/blockchain",
            json={"hash": cert_hash}
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Blockchain verification completed")
            print(f"   Is Valid: {result['is_valid']}")
            print(f"   Blockchain Verified: {result['blockchain_verified']}")
            
            if result.get('certificate'):
                cert = result['certificate']
                print(f"   Student: {cert['student_name']}")
                print(f"   Course: {cert['course_name']}")
                print(f"   Issue Date: {cert['issue_date']}")
            
            if result.get('anomalies'):
                print(f"   ⚠️  Anomalies: {result['anomalies']}")
            
            return result
        else:
            print(f"❌ Verification failed: {response.status_code}")
            print(f"   Error: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Blockchain verification failed: {e}")
        return None


def test_student_certificates(student_id):
    """Test retrieving student certificates"""
    print_section("6. Testing Student Portal")
    
    try:
        response = requests.get(f"{BACKEND_URL}/student/{student_id}/certificates")
        
        if response.status_code == 200:
            certificates = response.json()
            print(f"✅ Retrieved student certificates")
            print(f"   Total Certificates: {len(certificates)}")
            
            for i, cert in enumerate(certificates, 1):
                print(f"\n   Certificate {i}:")
                print(f"     Course: {cert['course_name']}")
                print(f"     Hash: {cert['certificate_hash'][:16]}...")
                print(f"     Date: {cert['issue_date']}")
            
            return certificates
        else:
            print(f"❌ Failed to retrieve certificates: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"❌ Student certificate retrieval failed: {e}")
        return None


def test_frontend_reachable():
    """Test if frontend is reachable"""
    print_section("7. Testing Frontend")
    
    try:
        response = requests.get(FRONTEND_URL, timeout=5)
        print(f"✅ Frontend is running: {response.status_code}")
        return True
    except Exception as e:
        print(f"❌ Frontend not reachable: {e}")
        return False


def cleanup(pdf_path):
    """Clean up test files"""
    print_section("Cleanup")
    
    try:
        if pdf_path.exists():
            pdf_path.unlink()
            print(f"✅ Removed test file: {pdf_path}")
    except Exception as e:
        print(f"⚠️  Cleanup warning: {e}")


def run_integration_tests():
    """Run all integration tests"""
    print("\n" + "=" * 60)
    print("  CERTIFYCHAIN INTEGRATION TESTS")
    print("=" * 60)
    
    results = {
        'backend_health': False,
        'blockchain_connection': False,
        'certificate_upload': False,
        'blockchain_verification': False,
        'student_portal': False,
        'frontend_reachable': False
    }
    
    # Test 1: Backend Health
    results['backend_health'] = test_backend_health()
    if not results['backend_health']:
        print("\n❌ Backend is not running. Start it with: uvicorn app.main:app --reload")
        return results
    
    # Test 2: Blockchain Connection
    results['blockchain_connection'] = test_blockchain_connection()
    if not results['blockchain_connection']:
        print("\n❌ Blockchain node is not running. Start it with: npx hardhat node")
        return results
    
    # Test 3-6: End-to-End Flow
    pdf_path = create_test_certificate()
    
    try:
        # Upload certificate
        upload_result = test_certificate_upload(pdf_path)
        results['certificate_upload'] = upload_result is not None
        
        if upload_result:
            cert_hash = upload_result['certificate_hash']
            # Extract student_id from the result
            student_id = upload_result.get('_test_student_id', 'STU-2024-001')
            
            # Small delay for blockchain confirmation
            time.sleep(2)
            
            # Verify on blockchain
            verify_result = test_blockchain_verification(cert_hash)
            results['blockchain_verification'] = (
                verify_result is not None and verify_result.get('is_valid', False)
            )
            
            # Check student portal
            student_certs = test_student_certificates(student_id)
            results['student_portal'] = student_certs is not None and len(student_certs) > 0
    
    finally:
        cleanup(pdf_path)
    
    # Test 7: Frontend
    results['frontend_reachable'] = test_frontend_reachable()
    
    # Summary
    print_section("TEST SUMMARY")
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, passed_test in results.items():
        status = "✅ PASSED" if passed_test else "❌ FAILED"
        print(f"{status}: {test_name.replace('_', ' ').title()}")
    
    print(f"\n{'='*60}")
    print(f"  Total: {passed}/{total} tests passed")
    print(f"{'='*60}\n")
    
    if passed == total:
        print("*** ALL TESTS PASSED! ***")
        print("\nYour CertifyChain system is fully integrated and working!")
        print("\nNext steps:")
        print("  1. Access frontend: http://localhost:5174")
        print("  2. Upload certificates via Institution portal")
        print("  3. Verify certificates via Verifier portal")
        print("  4. View certificates via Student portal")
    else:
        print("*** Some tests failed. Please check the output above. ***")
    
    return results


if __name__ == "__main__":
    run_integration_tests()
