import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Home } from './pages/Home';
import { Institution } from './pages/Institution';
import { Student } from './pages/Student';
import { Verifier } from './pages/Verifier';
import { ROUTES } from './utils/constants';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path={ROUTES.HOME} element={<Home />} />
              <Route path={ROUTES.INSTITUTION} element={<Institution />} />
              <Route path={ROUTES.STUDENT} element={<Student />} />
              <Route path={ROUTES.VERIFIER} element={<Verifier />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
