export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-bold">CertifyChain</h3>
            <p className="text-gray-400 text-sm mt-1">
              Blockchain-powered certificate verification
            </p>
          </div>
          <div className="text-gray-400 text-sm">
            © 2025 CertifyChain. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
