import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

export const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-48">
          <Link to={ROUTES.HOME} className="flex items-center space-x-6">
            <div className="w-40 h-40 bg-primary-600 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-4xl font-bold text-gray-900">CertificateForgeDetect</span>
          </Link>

          <div className="flex space-x-8">
            <Link
              to={ROUTES.INSTITUTION}
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Institution
            </Link>
            <Link
              to={ROUTES.STUDENT}
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Student
            </Link>
            <Link
              to={ROUTES.VERIFIER}
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Verifier
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};
