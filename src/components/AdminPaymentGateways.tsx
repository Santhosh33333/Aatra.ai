import { useState } from 'react';
import { Settings, CheckCircle, AlertCircle, Copy, ExternalLink } from 'lucide-react';
import { GATEWAYS, type GatewayType } from '../lib/payment-gateways';

export default function AdminPaymentGateways() {
  const [selectedGateway, setSelectedGateway] = useState<GatewayType>('instamojo');
  const [copied, setCopied] = useState<string>('');

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(''), 2000);
    } catch {
      setCopied(`error-${id}`);
    }
  };

  const gatewayConfigs = {
    instamojo: {
      env_vars: [
        { key: 'VITE_INSTAMOJO_CLIENT_ID', value: '', example: 'rzp_live_1234567890' },
        { key: 'VITE_INSTAMOJO_CLIENT_SECRET', value: '', example: 'abcd1234efgh5678' },
      ],
      setup_steps: [
        'Go to https://www.instamojo.com/',
        'Sign up and complete KYC verification',
        'Go to Settings → API & Webhooks',
        'Copy Client ID and Client Secret',
        'Add to Vercel environment variables',
        `Set webhook URL: ${window.location.origin}/api/instamojo/webhook`,
        'Deploy and test',
      ],
      docs: 'INSTAMOJO_FREE_SETUP.md',
      status: 'Available',
      statusColor: 'bg-blue-100 text-blue-800',
    },
    razorpay: {
      env_vars: [
        { key: 'RAZORPAY_KEY_ID', value: '', example: 'rzp_live_1234567890abcdef' },
        { key: 'RAZORPAY_KEY_SECRET', value: '', example: 'abcd1234efgh5678ijkl9012' },
      ],
      setup_steps: [
        'Go to https://razorpay.com/',
        'Sign up with business account',
        'Complete KYC verification',
        'Go to Settings → API Keys',
        'Copy Key ID and Key Secret',
        'Add to Vercel environment variables',
        `Set webhook URL: ${window.location.origin}/api/razorpay/webhook`,
        'Deploy and test with Razorpay test cards',
      ],
      docs: 'RAZORPAY_INDIA_SETUP.md',
      status: 'Available',
      statusColor: 'bg-blue-100 text-blue-800',
    },
    payu: {
      env_vars: [
        { key: 'PAYU_MERCHANT_KEY', value: '', example: 'merchant_key_123' },
        { key: 'PAYU_MERCHANT_SALT', value: '', example: 'merchant_salt_456' },
      ],
      setup_steps: [
        'Go to https://www.payu.in/merchant-account',
        'Sign up for merchant account',
        'Verify email and complete KYC',
        'Go to Account Settings → API Details',
        'Copy Merchant Key and Salt',
        'Add to Vercel environment variables',
        'Enable webhook in PayU dashboard',
        'Deploy and test',
      ],
      docs: 'PAYU_SETUP.md',
      status: 'Available',
      statusColor: 'bg-blue-100 text-blue-800',
    },
    mock: {
      env_vars: [],
      setup_steps: [
        'Mock gateway is ready to use immediately',
        'No credentials required for testing',
        'Use test card: 4111 1111 1111 1111',
        'Test payment verification in admin',
        'Ideal for development and testing',
        'Switch to production gateways when ready',
      ],
      docs: 'MOCK_GATEWAY.md',
      status: 'Ready',
      statusColor: 'bg-green-100 text-green-800',
    },
  };

  const config = gatewayConfigs[selectedGateway];
  const gateway = GATEWAYS[selectedGateway];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-8 h-8 text-amber-400" />
            <h1 className="text-4xl font-bold text-white">Payment Gateways Admin</h1>
          </div>
          <p className="text-gray-400">Configure and manage payment gateways for Astra AI</p>
        </div>

        {/* Gateway Tabs */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {Object.entries(GATEWAYS).map(([key, g]) => {
            const logoPath = `/logos/${key}-logo.png`;
            return (
              <button
                key={key}
                onClick={() => setSelectedGateway(key as GatewayType)}
                className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center ${
                  selectedGateway === key
                    ? 'bg-amber-500/20 border-amber-400 text-white'
                    : 'bg-slate-700/50 border-slate-600 text-gray-300 hover:border-slate-500'
                }`}
              >
                <img 
                  src={logoPath} 
                  alt={g.name} 
                  className="w-12 h-12 mb-2 rounded" 
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = `data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2248%22 height=%2248%22%3E%3Crect fill=%22%232c3e50%22 width=%2248%22 height=%2248%22 rx=%224%22/%3E%3Ctext x=%2224%22 y=%2224%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-size=%2212%22 fill=%22%2388a5d8%22 font-family=%22Arial%22%3E${g.name[0]}%3C/text%3E%3C/svg%3E`;
                  }}
                  loading="lazy"
                />
                <div className="font-semibold text-center">{g.name}</div>
                <div className="text-xs mt-2 opacity-75 text-center">{g.description.substring(0, 35)}...</div>
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-8">
          {/* Setup Steps */}
          <div className="col-span-2 space-y-8">
            {/* Status */}
            <div className={`p-6 rounded-lg border ${config.statusColor} border-opacity-50`}>
              <div className="flex items-center gap-2 mb-2">
                {config.status === 'Ready' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span className="font-semibold">{config.status}</span>
              </div>
              <p className="text-sm">{gateway.description}</p>
            </div>

            {/* Environment Variables */}
            {config.env_vars.length > 0 && (
              <div className="bg-slate-700/50 p-6 rounded-lg border border-slate-600">
                <h3 className="text-lg font-semibold text-white mb-4">Environment Variables</h3>
                <div className="space-y-3">
                  {config.env_vars.map((env, idx) => (
                    <div key={idx} className="bg-slate-800/50 p-3 rounded border border-slate-600">
                      <div className="flex items-center justify-between">
                        <code className="text-amber-300 font-mono text-sm">{env.key}</code>
                        <button
                          onClick={() => copyToClipboard(env.example, env.key)}
                          className={`transition-colors ${
                            copied === env.key ? 'text-green-400' : 'text-gray-400 hover:text-white'
                          }`}
                          title="Copy to clipboard"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Example: <code className="text-gray-300">{env.example}</code>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        Add this to Vercel Settings → Environment Variables
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Setup Steps */}
            <div className="bg-slate-700/50 p-6 rounded-lg border border-slate-600">
              <h3 className="text-lg font-semibold text-white mb-4">Setup Steps</h3>
              <ol className="space-y-3">
                {config.setup_steps.map((step, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="flex items-center justify-center w-6 h-6 bg-amber-400/20 text-amber-300 rounded-full text-sm font-semibold flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-gray-300 pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Payment Methods */}
            <div className="bg-slate-700/50 p-6 rounded-lg border border-slate-600">
              <h3 className="text-lg font-semibold text-white mb-4">Supported Payment Methods</h3>
              <div className="grid grid-cols-2 gap-2">
                {gateway.paymentMethods.map((method, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800/50 px-3 py-2 rounded text-sm text-gray-300 border border-slate-600"
                  >
                    ✓ {method}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-slate-700/50 p-6 rounded-lg border border-slate-600">
              <h4 className="font-semibold text-white mb-4">Quick Info</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-gray-400">Transaction Fee</div>
                  <div className="text-white font-semibold">{gateway.fee}</div>
                </div>
                <div>
                  <div className="text-gray-400">Support Email</div>
                  <div className="text-amber-300">{gateway.supportEmail}</div>
                </div>
                <div>
                  <div className="text-gray-400">Mode</div>
                  <div className="text-white font-semibold">
                    {config.status === 'Ready' ? 'Demo Ready' : 'Needs Setup'}
                  </div>
                </div>
              </div>
            </div>

            {/* Useful Links */}
            <div className="bg-slate-700/50 p-6 rounded-lg border border-slate-600">
              <h4 className="font-semibold text-white mb-4">Useful Links</h4>
              <div className="space-y-2">
                <a
                  href={`https://${selectedGateway === 'mock' ? 'example.com' : selectedGateway}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-amber-300 hover:text-amber-200 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Official Website
                </a>
                <a
                  href={`https://vercel.com/docs`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-amber-300 hover:text-amber-200 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Vercel Docs
                </a>
                <a
                  href={`https://vercel.com/docs/functions`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-amber-300 hover:text-amber-200 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Vercel Functions Docs
                </a>
              </div>
            </div>

            {/* Test Payment */}
            <div className="bg-amber-500/10 p-6 rounded-lg border border-amber-400/30">
              <h4 className="font-semibold text-amber-300 mb-3">Test Payment</h4>
              <p className="text-sm text-gray-300 mb-4">
                {selectedGateway === 'mock'
                  ? 'Use this gateway to test the checkout flow without real payments.'
                  : `Switch to ${selectedGateway === 'instamojo' ? 'Instamojo' : selectedGateway === 'razorpay' ? 'Razorpay' : 'PayU'} to test with real credentials.`}
              </p>
              <button
                onClick={() => (window.location.href = '/checkout?plan=pro&gateway=' + selectedGateway)}
                className="w-full bg-amber-400 hover:bg-amber-500 text-black font-semibold py-2 rounded-lg transition-colors"
              >
                Test {gateway.name}
              </button>
            </div>

            {/* Status Indicator */}
            <div className="text-xs text-gray-400 space-y-1">
              <div>Last Updated: {new Date().toLocaleDateString()}</div>
              <div>API Endpoints: {Object.keys(GATEWAYS).length}</div>
              <div>Version: 1.0.0</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
