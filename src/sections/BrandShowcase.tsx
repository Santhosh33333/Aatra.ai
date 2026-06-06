import { useState, useRef } from 'react';
import { Check, AlertCircle, Zap, Users, TrendingUp, Image, X } from 'lucide-react';
import { logger } from '../lib/logger';

export default function BrandShowcase() {
  const [logoPreview, setLogoPreview] = useState<string>(localStorage.getItem('brand_logo') || '');
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats = [
    { label: 'Active Users', value: '10M+', icon: Users, color: 'from-blue-400 to-blue-600' },
    { label: 'API Calls/Day', value: '500M+', icon: Zap, color: 'from-amber-400 to-amber-600' },
    { label: 'Growth Rate', value: '+45%', icon: TrendingUp, color: 'from-cyan-400 to-cyan-600' },
  ];

  const processSteps = [
    { step: 1, title: 'Upload Logo', description: 'Drag & drop or click to upload your brand logo' },
    { step: 2, title: 'Customize', description: 'Adjust colors and settings to match your brand' },
    { step: 3, title: 'Deploy', description: 'Deploy and see your brand across all platforms' },
  ];

  const handleLogoUpload = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus('error');
      logger.error('[BrandShowcase] Logo too large', { size: file.size });
      setTimeout(() => setUploadStatus('idle'), 3000);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setUploadStatus('error');
      logger.error('[BrandShowcase] Invalid file type', { type: file.type });
      setTimeout(() => setUploadStatus('idle'), 3000);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      setLogoPreview(preview);
      localStorage.setItem('brand_logo', preview);
      setUploadStatus('success');
      logger.success('[BrandShowcase] Logo uploaded', { filename: file.name });
      setTimeout(() => setUploadStatus('idle'), 3000);
    };
    reader.onerror = () => {
      setUploadStatus('error');
      logger.error('[BrandShowcase] Failed to read logo');
      setTimeout(() => setUploadStatus('idle'), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      logger.info('[BrandShowcase] Logo dropped');
      handleLogoUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleLogoUpload(e.target.files[0]);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview('');
    localStorage.removeItem('brand_logo');
    logger.info('[BrandShowcase] Logo removed');
  };

  return (
    <section className="relative w-full py-20 bg-gradient-to-b from-[#080c18] to-[#0d1117] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #ffb340, transparent)' }} />
        <div className="absolute bottom-1/4 -left-32 w-[500px] h-[500px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #00c8ff, transparent)' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Your Brand, Your Way</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">Upload your logo and customize how your brand appears across Astra</p>
        </div>

        {/* Logo Upload Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16 items-center">
          {/* Upload Area */}
          <div>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-12 transition-all cursor-pointer ${
                dragActive
                  ? 'border-amber-400 bg-amber-400/10 scale-105'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {logoPreview ? (
                <div className="relative">
                  <div className="w-full h-64 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center border border-white/10">
                    <img src={logoPreview} alt="Brand logo" className="max-w-full max-h-full object-contain p-4" />
                  </div>
                  <button
                    onClick={handleRemoveLogo}
                    className="absolute top-4 right-4 p-2 bg-red-500/80 hover:bg-red-600 rounded-lg transition-colors"
                  >
                    <X size={16} className="text-white" />
                  </button>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-400 to-cyan-400 text-[#080c18] font-semibold rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Change Logo
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-cyan-400 flex items-center justify-center mx-auto mb-4">
                    <Image size={24} className="text-[#080c18]" />
                  </div>
                  <p className="text-xl font-semibold text-white mb-2">Drag your logo here</p>
                  <p className="text-gray-400 text-sm mb-6">or click to browse files (Max 5MB)</p>
                  <button className="px-6 py-3 bg-gradient-to-r from-amber-400 to-cyan-400 text-[#080c18] font-semibold rounded-lg hover:opacity-90 transition-opacity">
                    Select File
                  </button>
                </div>
              )}
            </div>

            {/* Status Messages */}
            {uploadStatus === 'success' && (
              <div className="mt-4 flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <Check size={18} className="text-green-400" />
                <span className="text-green-400 text-sm">Logo uploaded successfully!</span>
              </div>
            )}
            {uploadStatus === 'error' && (
              <div className="mt-4 flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <AlertCircle size={18} className="text-red-400" />
                <span className="text-red-400 text-sm">Upload failed. Check file size and format.</span>
              </div>
            )}
          </div>

          {/* Preview & Stats */}
          <div className="space-y-8">
            <div className="p-8 bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-2xl">
              <p className="text-sm text-gray-400 mb-3">Brand Logo Preview</p>
              <div className="w-full h-40 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                ) : (
                  <div className="text-center">
                    <Image size={32} className="text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">Logo will appear here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="p-4 bg-white/[0.04] border border-white/10 rounded-xl hover:border-white/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                        <Icon size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">{stat.label}</p>
                        <p className="text-xl font-bold text-white">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-white text-center mb-12">How it works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {processSteps.map((item, idx) => (
              <div key={idx} className="relative">
                {/* Connection line */}
                {idx < processSteps.length - 1 && (
                  <div className="hidden md:block absolute left-[60px] top-20 w-[calc(100%+40px)] h-1 bg-gradient-to-r from-amber-400/50 to-cyan-400/50" />
                )}

                <div className="p-6 bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-xl relative z-10">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-cyan-400 flex items-center justify-center mb-4">
                    <span className="text-[#080c18] font-bold text-lg">{item.step}</span>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Visualization */}
        <div className="mt-20 p-8 bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-8">Real-time Data & Processing</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { metric: 'Requests/sec', value: '1.2M', status: 'Optimal' },
              { metric: 'Avg Response', value: '45ms', status: 'Fast' },
              { metric: 'Uptime', value: '99.99%', status: 'Excellent' },
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-white/[0.04] rounded-lg border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-400">{item.metric}</p>
                  <div className="px-2 py-1 rounded text-xs font-semibold bg-green-400/10 text-green-400">
                    {item.status}
                  </div>
                </div>
                <p className="text-3xl font-bold text-white">{item.value}</p>
                <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-gradient-to-r from-green-400 to-green-600 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
