"""
AI-powered certificate verification service
Implements OCR, layout analysis, logo detection, signature analysis, and tamper detection
"""

import io
import logging
from typing import Dict, List, Tuple, Optional
from PIL import Image
import numpy as np
import cv2
import pytesseract
from pdf2image import convert_from_bytes
import re

logger = logging.getLogger(__name__)


class AIVerificationService:
    """
    Service for AI-powered certificate forgery detection
    """
    
    def __init__(self):
        """Initialize AI verification service"""
        # Set tesseract path if on Windows
        # pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
        pass
    
    def extract_text_from_pdf(self, pdf_content: bytes) -> Tuple[str, float]:
        """
        Step 1: OCR - Extract text from PDF using Tesseract
        
        Args:
            pdf_content: PDF file content as bytes
            
        Returns:
            Tuple of (extracted_text, ocr_confidence_score)
        """
        try:
            logger.info("🔍 Step 1: Extracting text using Tesseract OCR...")
            
            # Convert PDF to images
            try:
                images = convert_from_bytes(pdf_content, dpi=300, first_page=1, last_page=1)
            except Exception as pdf_error:
                logger.error(f"❌ PDF conversion failed: {str(pdf_error)}")
                if "poppler" in str(pdf_error).lower():
                    raise Exception("Layout analysis error: Unable to get page count. Is poppler installed and in PATH?")
                raise Exception(f"PDF conversion error: {str(pdf_error)}")
            
            if not images:
                logger.warning("No images extracted from PDF")
                raise Exception("No images could be extracted from PDF")
            
            # Get first page
            image = images[0]
            
            # Convert PIL image to OpenCV format
            opencv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
            
            # Preprocess image for better OCR
            gray = cv2.cvtColor(opencv_image, cv2.COLOR_BGR2GRAY)
            
            # Apply thresholding to get better contrast
            _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)
            
            # Perform OCR with detailed data
            try:
                ocr_data = pytesseract.image_to_data(thresh, output_type=pytesseract.Output.DICT)
                extracted_text = pytesseract.image_to_string(thresh)
            except pytesseract.TesseractNotFoundError:
                logger.error("❌ Tesseract not found")
                raise Exception("Tesseract OCR is not installed. Please install Tesseract and ensure it's in your PATH.")
            except Exception as ocr_error:
                logger.error(f"❌ OCR processing failed: {str(ocr_error)}")
                raise Exception(f"OCR processing error: {str(ocr_error)}")
            
            # Calculate average confidence (filter out -1 confidence values)
            confidences = [int(conf) for conf in ocr_data['conf'] if int(conf) > 0]
            avg_confidence = sum(confidences) / len(confidences) if confidences else 0.0
            
            ocr_score = min(100.0, avg_confidence)
            
            logger.info(f"✅ OCR Complete - Extracted {len(extracted_text)} characters")
            logger.info(f"📊 OCR Confidence Score: {ocr_score:.2f}%")
            logger.info(f"📝 Sample text: {extracted_text[:100]}...")
            
            return extracted_text.strip(), ocr_score
            
        except Exception as e:
            logger.error(f"❌ OCR extraction failed: {str(e)}")
            raise
    
    def verify_name_match(self, extracted_text: str, expected_name: str) -> Tuple[bool, float]:
        """
        Step 2: Name Verification - Match student name with extracted text
        
        Args:
            extracted_text: Text extracted from certificate
            expected_name: Expected student name from blockchain
            
        Returns:
            Tuple of (name_found, confidence_score)
        """
        try:
            logger.info("🔍 Step 2: Verifying student name...")
            
            if not expected_name or not extracted_text:
                logger.warning("Missing name or text for verification")
                return False, 0.0
            
            # Normalize text for comparison
            extracted_lower = extracted_text.lower()
            expected_lower = expected_name.lower()
            
            # Check for exact match
            if expected_lower in extracted_lower:
                logger.info(f"✅ Exact name match found: {expected_name}")
                return True, 100.0
            
            # Check for partial match (each word)
            name_parts = expected_lower.split()
            matches = sum(1 for part in name_parts if part in extracted_lower)
            match_percentage = (matches / len(name_parts)) * 100 if name_parts else 0.0
            
            if match_percentage >= 50:
                logger.info(f"✅ Partial name match: {match_percentage:.2f}%")
                return True, match_percentage
            else:
                logger.warning(f"❌ Name not found in certificate text")
                return False, match_percentage
                
        except Exception as e:
            logger.error(f"❌ Name verification failed: {str(e)}")
            return False, 0.0
    
    def analyze_layout(self, pdf_content: bytes) -> Tuple[float, List[str]]:
        """
        Step 3: Layout Analysis - Compare certificate layout with standard templates
        
        Args:
            pdf_content: PDF file content as bytes
            
        Returns:
            Tuple of (layout_score, detected_anomalies)
        """
        try:
            logger.info("🔍 Step 3: Analyzing certificate layout...")
            
            # Convert PDF to image
            try:
                images = convert_from_bytes(pdf_content, dpi=200, first_page=1, last_page=1)
            except Exception as pdf_error:
                logger.error(f"❌ PDF conversion failed: {str(pdf_error)}")
                if "poppler" in str(pdf_error).lower():
                    raise Exception("Layout analysis error: Unable to get page count. Is poppler installed and in PATH?")
                raise Exception(f"PDF conversion error: {str(pdf_error)}")
            
            if not images:
                raise Exception("Failed to convert PDF to image")
            
            image = images[0]
            opencv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
            gray = cv2.cvtColor(opencv_image, cv2.COLOR_BGR2GRAY)
            
            anomalies = []
            score_components = []
            
            # 1. Check image dimensions (standard certificate dimensions)
            height, width = gray.shape
            aspect_ratio = width / height if height > 0 else 0
            
            # Standard certificates are usually landscape (wider than tall)
            if 1.2 <= aspect_ratio <= 1.6:
                score_components.append(100)
                logger.info(f"✅ Standard aspect ratio detected: {aspect_ratio:.2f}")
            else:
                score_components.append(60)
                anomalies.append(f"Unusual aspect ratio: {aspect_ratio:.2f}")
                logger.warning(f"⚠️ Non-standard aspect ratio: {aspect_ratio:.2f}")
            
            # 2. Detect edges and contours
            edges = cv2.Canny(gray, 50, 150)
            contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            # Check for certificate border
            border_found = False
            for contour in contours:
                area = cv2.contourArea(contour)
                image_area = width * height
                
                # If contour covers 60-95% of image, likely a border
                if 0.6 * image_area <= area <= 0.95 * image_area:
                    border_found = True
                    logger.info("✅ Certificate border detected")
                    break
            
            if border_found:
                score_components.append(100)
            else:
                score_components.append(70)
                anomalies.append("No clear certificate border detected")
                logger.warning("⚠️ No certificate border found")
            
            # 3. Check for text regions (certificates should have multiple text blocks)
            _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
            
            # Dilate to connect text
            kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (50, 10))
            dilated = cv2.dilate(thresh, kernel, iterations=1)
            
            text_contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            text_regions = len([c for c in text_contours if cv2.contourArea(c) > 100])
            
            if text_regions >= 3:
                score_components.append(100)
                logger.info(f"✅ Found {text_regions} text regions")
            elif text_regions >= 1:
                score_components.append(75)
                logger.info(f"⚠️ Only {text_regions} text regions found")
            else:
                score_components.append(40)
                anomalies.append("Insufficient text regions detected")
                logger.warning("❌ Very few text regions detected")
            
            # Calculate final layout score
            layout_score = sum(score_components) / len(score_components)
            
            logger.info(f"📊 Layout Analysis Score: {layout_score:.2f}%")
            if anomalies:
                logger.warning(f"⚠️ Layout anomalies: {', '.join(anomalies)}")
            
            return layout_score, anomalies
            
        except Exception as e:
            logger.error(f"❌ Layout analysis failed: {str(e)}")
            raise
    
    def detect_logo(self, pdf_content: bytes) -> Tuple[float, bool]:
        """
        Step 4: Logo Detection - Verify presence of institution logos
        
        Args:
            pdf_content: PDF file content as bytes
            
        Returns:
            Tuple of (logo_score, logo_detected)
        """
        try:
            logger.info("🔍 Step 4: Detecting institution logos...")
            
            # Convert PDF to image
            try:
                images = convert_from_bytes(pdf_content, dpi=200, first_page=1, last_page=1)
            except Exception as pdf_error:
                logger.error(f"❌ PDF conversion failed: {str(pdf_error)}")
                if "poppler" in str(pdf_error).lower():
                    raise Exception("Logo detection error: Unable to get page count. Is poppler installed and in PATH?")
                raise Exception(f"PDF conversion error: {str(pdf_error)}")
            
            if not images:
                raise Exception("Failed to convert PDF to image")
            
            image = images[0]
            opencv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
            
            # Convert to grayscale
            gray = cv2.cvtColor(opencv_image, cv2.COLOR_BGR2GRAY)
            
            # Detect circular/square shapes (common in logos)
            circles = cv2.HoughCircles(
                gray,
                cv2.HOUGH_GRADIENT,
                dp=1,
                minDist=100,
                param1=50,
                param2=30,
                minRadius=20,
                maxRadius=150
            )
            
            logo_elements_found = 0
            
            if circles is not None:
                logo_elements_found += len(circles[0])
                logger.info(f"✅ Detected {len(circles[0])} circular logo elements")
            
            # Detect rectangular regions (logos often have distinctive rectangles)
            edges = cv2.Canny(gray, 50, 150)
            contours, _ = cv2.findContours(edges, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
            
            # Filter for logo-sized rectangles
            height, width = gray.shape
            for contour in contours:
                x, y, w, h = cv2.boundingRect(contour)
                area = w * h
                
                # Logo typically in top 30% of image and reasonable size
                if (y < height * 0.3 and 
                    2000 < area < 50000 and 
                    0.5 <= w/h <= 2.0):
                    logo_elements_found += 1
            
            # Calculate logo score
            if logo_elements_found >= 2:
                logo_score = 95.0
                logo_detected = True
                logger.info(f"✅ Logo detected with confidence: {logo_score:.2f}%")
            elif logo_elements_found == 1:
                logo_score = 75.0
                logo_detected = True
                logger.info(f"✅ Potential logo detected: {logo_score:.2f}%")
            else:
                logo_score = 40.0
                logo_detected = False
                logger.warning("⚠️ No clear logo detected")
            
            logger.info(f"📊 Logo Detection Score: {logo_score:.2f}%")
            
            return logo_score, logo_detected
            
        except Exception as e:
            logger.error(f"❌ Logo detection failed: {str(e)}")
            raise
    
    def analyze_signature(self, pdf_content: bytes) -> float:
        """
        Step 5: Signature Analysis - Placeholder for future ML model
        
        Args:
            pdf_content: PDF file content as bytes
            
        Returns:
            Signature authenticity score
        """
        try:
            logger.info("🔍 Step 5: Analyzing signatures (placeholder)...")
            
            # Convert PDF to image
            try:
                images = convert_from_bytes(pdf_content, dpi=200, first_page=1, last_page=1)
            except Exception as pdf_error:
                logger.error(f"❌ PDF conversion failed: {str(pdf_error)}")
                if "poppler" in str(pdf_error).lower():
                    raise Exception("Signature analysis error: Unable to get page count. Is poppler installed and in PATH?")
                raise Exception(f"PDF conversion error: {str(pdf_error)}")
            
            if not images:
                raise Exception("Failed to convert PDF to image")
            
            image = images[0]
            opencv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
            gray = cv2.cvtColor(opencv_image, cv2.COLOR_BGR2GRAY)
            
            # Look for signature-like regions (usually in bottom 30% of certificate)
            height, width = gray.shape
            signature_region = gray[int(height * 0.7):height, :]
            
            # Detect edges in signature region
            edges = cv2.Canny(signature_region, 30, 100)
            edge_density = np.sum(edges > 0) / edges.size
            
            # Signatures typically have moderate edge density
            if 0.01 <= edge_density <= 0.15:
                signature_score = 85.0
                logger.info(f"✅ Signature-like patterns detected: {signature_score:.2f}%")
            else:
                signature_score = 70.0
                logger.info(f"⚠️ Signature patterns unclear: {signature_score:.2f}%")
            
            logger.info("ℹ️ Note: Full signature analysis requires trained ML model")
            
            return signature_score
            
        except Exception as e:
            logger.error(f"❌ Signature analysis failed: {str(e)}")
            raise
    
    def detect_tampering(self, pdf_content: bytes) -> Tuple[float, List[str]]:
        """
        Step 6: Tamper Detection - Detect image manipulation
        
        Args:
            pdf_content: PDF file content as bytes
            
        Returns:
            Tuple of (tamper_score, detected_manipulations)
        """
        try:
            logger.info("🔍 Step 6: Detecting image tampering...")
            
            # Convert PDF to image
            try:
                images = convert_from_bytes(pdf_content, dpi=200, first_page=1, last_page=1)
            except Exception as pdf_error:
                logger.error(f"❌ PDF conversion failed: {str(pdf_error)}")
                if "poppler" in str(pdf_error).lower():
                    raise Exception("Tamper detection error: Unable to get page count. Is poppler installed and in PATH?")
                raise Exception(f"PDF conversion error: {str(pdf_error)}")
            
            if not images:
                raise Exception("Failed to convert PDF")
            
            image = images[0]
            opencv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
            
            manipulations = []
            checks_passed = 0
            total_checks = 4
            
            # 1. Check for JPEG compression artifacts (inconsistent compression)
            gray = cv2.cvtColor(opencv_image, cv2.COLOR_BGR2GRAY)
            
            # Calculate local standard deviation
            kernel_size = 5
            local_mean = cv2.blur(gray, (kernel_size, kernel_size))
            local_sq_mean = cv2.blur(gray ** 2, (kernel_size, kernel_size))
            local_variance = local_sq_mean - local_mean ** 2
            
            variance_std = np.std(local_variance)
            
            if variance_std < 5000:  # Consistent compression
                checks_passed += 1
                logger.info("✅ Consistent compression detected")
            else:
                manipulations.append("Inconsistent compression artifacts detected")
                logger.warning("⚠️ Inconsistent compression patterns")
            
            # 2. Check for noise consistency
            # Add Gaussian noise analysis
            noise = gray - cv2.GaussianBlur(gray, (5, 5), 0)
            noise_std = np.std(noise)
            
            if 3.0 <= noise_std <= 15.0:  # Normal noise range
                checks_passed += 1
                logger.info("✅ Normal noise levels detected")
            else:
                manipulations.append("Unusual noise patterns detected")
                logger.warning(f"⚠️ Abnormal noise level: {noise_std:.2f}")
            
            # 3. Check for edge consistency (cloning detection)
            edges = cv2.Canny(gray, 100, 200)
            edge_count = np.sum(edges > 0)
            edge_density = edge_count / edges.size
            
            if 0.01 <= edge_density <= 0.2:  # Normal edge density
                checks_passed += 1
                logger.info("✅ Normal edge density")
            else:
                manipulations.append("Unusual edge patterns (possible cloning)")
                logger.warning(f"⚠️ Unusual edge density: {edge_density:.4f}")
            
            # 4. Check for color consistency
            if len(opencv_image.shape) == 3:
                b, g, r = cv2.split(opencv_image)
                
                # Check if color channels have similar distributions
                b_std, g_std, r_std = np.std(b), np.std(g), np.std(r)
                color_variation = max(b_std, g_std, r_std) - min(b_std, g_std, r_std)
                
                if color_variation < 30:  # Consistent color distribution
                    checks_passed += 1
                    logger.info("✅ Consistent color distribution")
                else:
                    manipulations.append("Inconsistent color channels")
                    logger.warning(f"⚠️ Color channel variation: {color_variation:.2f}")
            else:
                checks_passed += 1  # Grayscale is fine
            
            # Calculate tamper score (higher = less tampered)
            tamper_score = (checks_passed / total_checks) * 100
            
            logger.info(f"📊 Tamper Detection Score: {tamper_score:.2f}%")
            logger.info(f"✅ Passed {checks_passed}/{total_checks} tamper checks")
            
            if manipulations:
                logger.warning(f"⚠️ Potential manipulations: {', '.join(manipulations)}")
            
            return tamper_score, manipulations
            
        except Exception as e:
            logger.error(f"❌ Tamper detection failed: {str(e)}")
            raise
    
    def verify_certificate_ai(
        self,
        pdf_content: bytes,
        expected_student_name: Optional[str] = None
    ) -> Dict:
        """
        Complete AI verification pipeline
        
        Args:
            pdf_content: PDF file content as bytes
            expected_student_name: Expected student name for verification
            
        Returns:
            Dictionary containing all verification scores and results
        """
        logger.info("="*50)
        logger.info("🚀 Starting Complete AI Verification Pipeline")
        logger.info("="*50)
        
        results = {
            "ocr_score": 0.0,
            "name_match": False,
            "name_confidence": 0.0,
            "layout_score": 0.0,
            "logo_score": 0.0,
            "signature_score": 0.0,
            "tamper_score": 0.0,
            "trust_score": 0.0,
            "anomalies": [],
            "extracted_text": ""
        }
        
        try:
            # Step 1: OCR - Extract text
            try:
                extracted_text, ocr_score = self.extract_text_from_pdf(pdf_content)
                results["extracted_text"] = extracted_text
                results["ocr_score"] = ocr_score
            except Exception as e:
                results["anomalies"].append(str(e))
                results["ocr_score"] = 0.0
                extracted_text = ""
            
            # Step 2: Name verification (if expected name provided)
            if expected_student_name and extracted_text:
                name_match, name_confidence = self.verify_name_match(extracted_text, expected_student_name)
                results["name_match"] = name_match
                results["name_confidence"] = name_confidence
                
                if not name_match:
                    results["anomalies"].append(f"Student name mismatch (confidence: {name_confidence:.1f}%)")
            
            # Step 3: Layout analysis
            try:
                layout_score, layout_anomalies = self.analyze_layout(pdf_content)
                results["layout_score"] = layout_score
                results["anomalies"].extend(layout_anomalies)
            except Exception as e:
                results["anomalies"].append(str(e))
                results["layout_score"] = 0.0
            
            # Step 4: Logo detection
            try:
                logo_score, logo_detected = self.detect_logo(pdf_content)
                results["logo_score"] = logo_score
                
                if not logo_detected:
                    results["anomalies"].append("No clear institution logo detected")
            except Exception as e:
                results["anomalies"].append(str(e))
                results["logo_score"] = 50.0
            
            # Step 5: Signature analysis
            try:
                signature_score = self.analyze_signature(pdf_content)
                results["signature_score"] = signature_score
            except Exception as e:
                results["anomalies"].append(str(e))
                results["signature_score"] = 50.0
            
            # Step 6: Tamper detection
            try:
                tamper_score, tamper_anomalies = self.detect_tampering(pdf_content)
                results["tamper_score"] = tamper_score
                results["anomalies"].extend(tamper_anomalies)
            except Exception as e:
                results["anomalies"].append(str(e))
                results["tamper_score"] = 50.0
            
            # Calculate overall trust score (weighted average)
            weights = {
                "ocr": 0.15,
                "name": 0.20,
                "layout": 0.20,
                "logo": 0.15,
                "signature": 0.10,
                "tamper": 0.20
            }
            
            trust_score = (
                weights["ocr"] * ocr_score +
                weights["name"] * (name_confidence if expected_student_name else 80.0) +
                weights["layout"] * layout_score +
                weights["logo"] * logo_score +
                weights["signature"] * signature_score +
                weights["tamper"] * tamper_score
            )
            
            results["trust_score"] = round(trust_score, 2)
            
            logger.info("="*50)
            logger.info(f"🎯 FINAL TRUST SCORE: {results['trust_score']:.2f}%")
            logger.info("="*50)
            logger.info(f"📊 Component Scores:")
            logger.info(f"   - OCR: {ocr_score:.2f}%")
            if expected_student_name:
                logger.info(f"   - Name Match: {name_confidence:.2f}%")
            logger.info(f"   - Layout: {layout_score:.2f}%")
            logger.info(f"   - Logo: {logo_score:.2f}%")
            logger.info(f"   - Signature: {signature_score:.2f}%")
            logger.info(f"   - Tamper: {tamper_score:.2f}%")
            logger.info("="*50)
            
            return results
            
        except Exception as e:
            logger.error(f"❌ AI verification pipeline failed: {str(e)}")
            results["anomalies"].append(f"Verification error: {str(e)}")
            return results


# Global service instance
ai_verification_service = AIVerificationService()
