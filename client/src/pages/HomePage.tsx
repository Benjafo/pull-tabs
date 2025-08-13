import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function HomePage() {
  const { user } = useAuth();

  return (
    <div className="py-8">
      <div className="text-center text-white mb-12">
        <h1 className="text-5xl font-bold mb-4 text-shadow-lg">
          Welcome to Pull Tabs Treasure!
        </h1>
        <p className="text-xl opacity-95">
          Experience the thrill of digital pull tabs with a pirate treasure theme
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h3 className="text-2xl font-bold text-primary-800 mb-4">How to Play</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-accent-500 mr-2">•</span>
              Purchase a ticket for $1
            </li>
            <li className="flex items-start">
              <span className="text-accent-500 mr-2">•</span>
              Flip the ticket to reveal 5 tabs
            </li>
            <li className="flex items-start">
              <span className="text-accent-500 mr-2">•</span>
              Pull each tab to uncover symbols
            </li>
            <li className="flex items-start">
              <span className="text-accent-500 mr-2">•</span>
              Match Skull-Skull-X patterns to win!
            </li>
          </ul>
        </div>
        
        <div className="bg-white rounded-lg shadow-xl p-6">
          <h3 className="text-2xl font-bold text-primary-800 mb-4">Prize Table</h3>
          <ul className="space-y-2">
            <li className="flex justify-between items-center py-2 border-b border-gray-200">
              <span>💀💀💀 Three Skulls</span>
              <span className="font-bold text-green-600">$100</span>
            </li>
            <li className="flex justify-between items-center py-2 border-b border-gray-200">
              <span>💀💀💎 Skull-Skull-Treasure</span>
              <span className="font-bold text-green-600">$50</span>
            </li>
            <li className="flex justify-between items-center py-2 border-b border-gray-200">
              <span>💀💀⛵ Skull-Skull-Ship</span>
              <span className="font-bold text-green-600">$20</span>
            </li>
            <li className="flex justify-between items-center py-2 border-b border-gray-200">
              <span>💀💀⚓ Skull-Skull-Anchor</span>
              <span className="font-bold text-green-600">$10</span>
            </li>
            <li className="flex justify-between items-center py-2 border-b border-gray-200">
              <span>💀💀🧭 Skull-Skull-Compass</span>
              <span className="font-bold text-green-600">$5</span>
            </li>
            <li className="flex justify-between items-center py-2">
              <span>💀💀🗺️ Skull-Skull-Map</span>
              <span className="font-bold text-green-600">$2</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="text-center">
        {user ? (
          <Link 
            to="/game" 
            className="inline-block bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-lg text-xl font-bold transform transition-all hover:scale-105 hover:shadow-xl"
          >
            Play Now
          </Link>
        ) : (
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/login" 
              className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-lg text-xl font-bold transform transition-all hover:scale-105 hover:shadow-xl"
            >
              Login to Play
            </Link>
            <Link 
              to="/register" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-xl font-bold transform transition-all hover:scale-105 hover:shadow-xl"
            >
              Create Account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}