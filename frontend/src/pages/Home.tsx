import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ROUTES } from '../utils/constants';

export const Home = () => {
  const [showBox, setShowBox] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const pipelineSection = document.getElementById('ai-pipeline');
      if (pipelineSection) {
        const rect = pipelineSection.getBoundingClientRect();
        setShowBox(rect.top < window.innerHeight);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col justify-center">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            <br></br>
            Blockchain-Powered Certificate Verification
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Secure, transparent, and tamper-proof certificate issuance and verification using
            Ethereum blockchain and AI-powered forgery detection.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <Link
            to={ROUTES.INSTITUTION}
            className="card hover:shadow-xl transition-shadow cursor-pointer"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Institution</h3>
              <p className="text-gray-600">
                Issue certificates and store them on the blockchain
              </p>
            </div>
          </Link>

          <Link
            to={ROUTES.STUDENT}
            className="card hover:shadow-xl transition-shadow cursor-pointer"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Student</h3>
              <p className="text-gray-600">
                View, download, and share your issued certificates
              </p>
            </div>
          </Link>

          <Link
            to={ROUTES.VERIFIER}
            className="card hover:shadow-xl transition-shadow cursor-pointer"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Verifier</h3>
              <p className="text-gray-600">
                Verify certificate authenticity with blockchain and AI
              </p>
            </div>
          </Link>
        </div>

        <div className="mt-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Why CertificateForgeDetect?</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div>
                  <strong>Immutable Records:</strong> Once issued, certificates cannot be altered
                  or tampered with
                </div>
              </li>
              <li className="flex items-start">
                <div>
                  <strong>AI-Powered Detection:</strong> Advanced forgery detection using machine
                  learning models 
                  - tesseract OCR, OpenCV, CNN AND Pillow
                </div>
              </li>
              <li className="flex items-start">
                <div>
                  <strong>Instant Verification:</strong> Anyone can verify certificate
                  authenticity in seconds
                </div>
              </li>
              <li className="flex items-start">
                <div>
                  <strong>Decentralized Storage:</strong> Certificate hashes stored for
                  permanent availability
                  <br></br>
                  <br></br>
                </div>
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">How It Works</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-white text-primary-600 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">
                  1
                </div>
                <p>Institution uploads certificate PDF with student details</p>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-white text-primary-600 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">
                  2
                </div>
                <p>Certificate hash is stored on Ethereum blockchain</p>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-white text-primary-600 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">
                  3
                </div>
                <p>Verify authenticity using AI-powered forgery detection</p>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-white text-primary-600 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">
                  4
                </div>
                <p>Verify authenticity using hash</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Verification Pipeline Section */}
        <div className="mt-24 mb-12" id="ai-pipeline">
          <h2 className="text-3xl font-bold text-center mb-12">AI Verification Pipeline</h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left - Pipeline Container */}
            <div>
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-300 rounded-2xl p-8">
                <div className="space-y-4">
                  <div className="flex items-start group cursor-pointer hover:bg-primary-200 p-3 rounded transition-colors">
                    <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4 flex-shrink-0">1</div>
                    <div>
                      <p className="font-semibold text-gray-900">OCR - Extract text from PDF</p>
                      <p className="text-sm text-gray-600">Tesseract OCR extracts text content</p>
                    </div>
                  </div>

                  <div className="flex items-start group cursor-pointer hover:bg-primary-200 p-3 rounded transition-colors">
                    <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4 flex-shrink-0">2</div>
                    <div>
                      <p className="font-semibold text-gray-900">Name Verification - Match student name with blockchain record</p>
                      <p className="text-sm text-gray-600">Validates name against blockchain data</p>
                    </div>
                  </div>

                  <div className="flex items-start group cursor-pointer hover:bg-primary-200 p-3 rounded transition-colors">
                    <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4 flex-shrink-0">3</div>
                    <div>
                      <p className="font-semibold text-gray-900">Layout Analysis - Compare certificate layout with templates</p>
                      <p className="text-sm text-gray-600">OpenCV compares with standard templates</p>
                    </div>
                  </div>

                  <div className="flex items-start group cursor-pointer hover:bg-primary-200 p-3 rounded transition-colors">
                    <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4 flex-shrink-0">4</div>
                    <div>
                      <p className="font-semibold text-gray-900">Logo Detection - Verify institution logos</p>
                      <p className="text-sm text-gray-600">Matches logos against registered institutions</p>
                    </div>
                  </div>

                  <div className="flex items-start group cursor-pointer hover:bg-primary-200 p-3 rounded transition-colors">
                    <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4 flex-shrink-0">5</div>
                    <div>
                      <p className="font-semibold text-gray-900">Signature Analysis - Classify signature authenticity</p>
                      <p className="text-sm text-gray-600">(Placeholder for future ML models)</p>
                    </div>
                  </div>

                  <div className="flex items-start group cursor-pointer hover:bg-primary-200 p-3 rounded transition-colors">
                    <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4 flex-shrink-0">6</div>
                    <div>
                      <p className="font-semibold text-gray-900">Tamper Detection - Detect image manipulation</p>
                      <p className="text-sm text-gray-600">(Placeholder for future ML models)</p>
                    </div>
                  </div>
                </div>

              
              </div>
            </div>

            {/* Right - 3D AI Forgery Check Box (appears on scroll) */}
            <div className="flex justify-center">
              <div
                className={`transform transition-all duration-1000 ${
                  showBox
                    ? 'opacity-100 scale-100 rotate-0'
                    : 'opacity-0 scale-50 -rotate-12'
                }`}
                style={{
                  perspective: '1000px',
                  transformStyle: 'preserve-3d',
                }}
              >
                <div className="relative w-96 h-96 cursor-pointer group"
                  style={{
                    transform: 'rotateX(0deg) rotateY(0deg)',
                    transition: 'transform 0.6s ease-out',
                  }}
                >
                  {/* 3D Box Front */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl shadow-2xl flex items-center justify-center text-white p-8 hover:shadow-3xl transition-shadow"
                    style={{
                      transform: 'translateZ(50px)',
                    }}
                  >
                    <div className="text-center">
                      <p className="text-base font-semibold opacity-75">Detailed</p>
                      <p className="text-5xl font-bold mt-4">AI-POWERED</p>
                      <p className="text-base font-semibold mt-4">Forgery Check</p>
                    </div>
                  </div>

                  {/* 3D Box Shadow Effect */}
                  <div className="absolute inset-0 bg-primary-900 rounded-xl blur-lg -z-10"
                    style={{
                      transform: 'translateZ(-30px)',
                    }}
                  ></div>

                  {/* Top Face */}
                  <div className="absolute -top-2 left-0 right-0 h-2 bg-gradient-to-r from-primary-300 to-primary-500 rounded-full"
                    style={{
                      transform: 'rotateX(90deg) translateZ(50px)',
                    }}
                  ></div>

                  {/* Side Face */}
                  <div className="absolute top-0 -right-2 w-2 h-full bg-gradient-to-b from-primary-600 to-primary-800 rounded-r"
                    style={{
                      transform: 'rotateY(90deg) translateZ(50px)',
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};        
