import { Navigation } from '../sections/Navigation';

export function Dashboard() {
  return (
    <div>
      <Navigation isSignedIn={true} userEmail="user@example.com" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome to Your Dashboard</h1>
        <p className="text-gray-600">Your chat history and settings will appear here.</p>
      </div>
    </div>
  );
}
