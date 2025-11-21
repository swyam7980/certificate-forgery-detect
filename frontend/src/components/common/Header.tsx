import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ROUTES } from '../../utils/constants';
import { apiService } from '../../services/api';

export const Header = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [institutionName, setInstitutionName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const institution = localStorage.getItem('institution');
    
    if (token && institution) {
      setIsAuthenticated(true);
      try {
        const institutionData = JSON.parse(institution);
        setInstitutionName(institutionData.name || '');
      } catch (error) {
        console.error('Error parsing institution data:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    apiService.logout();
    setIsAuthenticated(false);
    setInstitutionName('');
    navigate(ROUTES.HOME);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to={ROUTES.HOME} className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-primary-600 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-2xl font-bold text-gray-900">CertificateForgeDetect</span>
          </Link>

          <div className="flex items-center space-x-8">
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

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {institutionName}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to={ROUTES.AUTH}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
