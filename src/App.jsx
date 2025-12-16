import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <h1 className="text-4xl font-bold text-primary-600 mb-4">
          Shina Boutique ✨
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          Setup Complete! Ready to build.
        </p>
        <button className="btn-primary w-full">
          Get Started
        </button>
      </div>
    </div>
  );
}

export default App;