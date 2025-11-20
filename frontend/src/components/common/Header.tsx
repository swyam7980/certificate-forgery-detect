import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

export const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to={ROUTES.HOME} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-xl font-bold text-gray-900">CertifyChain</span>
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
