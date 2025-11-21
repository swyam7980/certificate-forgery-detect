import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { apiService } from '../../services/api';
import { ROUTES } from '../../utils/constants';

export const AuthForm = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    walletAddress: '',
    logoUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const response = await apiService.login(formData.email, formData.password);
        // Store token in localStorage
        localStorage.setItem('access_token', response.accessToken);
        localStorage.setItem('institution', JSON.stringify(response.institution));
        navigate(ROUTES.INSTITUTION);
      } else {
        const response = await apiService.signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          walletAddress: formData.walletAddress,
          logoUrl: formData.logoUrl || undefined
        });
        // Store token in localStorage
        localStorage.setItem('access_token', response.accessToken);
        localStorage.setItem('institution', JSON.stringify(response.institution));
        navigate(ROUTES.INSTITUTION);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.response?.data?.message || err.message || 'Authentication failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-md mx-auto">
      <Card title={isLogin ? 'Institution Login' : 'Institution Signup'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="label">Institution Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter institution name"
                className="input-field"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <div>
            <label className="label">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              className="input-field"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="label">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              className="input-field"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="label">Wallet Address</label>
                <input
                  type="text"
                  name="walletAddress"
                  placeholder="Enter Ethereum wallet address"
                  className="input-field"
                  value={formData.walletAddress}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="label">Logo URL (Optional)</label>
                <input
                  type="url"
                  name="logoUrl"
                  placeholder="Enter logo URL"
                  className="input-field"
                  value={formData.logoUrl}
                  onChange={handleInputChange}
                />
              </div>
            </>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-primary hover:underline text-sm"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};
