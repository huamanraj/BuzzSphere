import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#111b21] text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-lg mb-6">Oops! The page you're looking for doesn't exist.</p>
        <Link to="/" className="text-blue-500 underline text-lg">
          Go to Login Page
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
