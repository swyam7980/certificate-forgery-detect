import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

export const Home = () => {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
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
                View, download, and share your verified certificates
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
            <h2 className="text-3xl font-bold mb-4">Why CertifyChain?</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-green-500 mr-3 mt-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <strong>Immutable Records:</strong> Once issued, certificates cannot be altered
                  or tampered with
                </div>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-green-500 mr-3 mt-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <strong>AI-Powered Detection:</strong> Advanced forgery detection using machine
                  learning models
                </div>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-green-500 mr-3 mt-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <strong>Instant Verification:</strong> Anyone can verify certificate
                  authenticity in seconds
                </div>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-green-500 mr-3 mt-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <strong>Decentralized Storage:</strong> Certificates stored on IPFS for
                  permanent availability
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
                <p>PDF is stored on decentralized IPFS network</p>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-white text-primary-600 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">
                  4
                </div>
                <p>Anyone can verify authenticity using hash or PDF</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
