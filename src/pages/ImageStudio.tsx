import { useState } from 'react';
import { Link } from 'react-router';
import { Sparkles, Image as ImageIcon, Upload, Download, RefreshCw, Check } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import { logger } from '../lib/logger';

export default function ImageStudio() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleImageUpload = (file: File, preview: string) => {
    setUploadedImage(preview);
    logger.info('[ImageStudio] Image uploaded', { name: file.name, size: file.size });
  };

  const generateImage = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    logger.info('[ImageStudio] Generating image', { prompt });

    const demoUrl = `https://source.unsplash.com/1024x1024?${encodeURIComponent(prompt)}`;
    setGeneratedImage(demoUrl);
    logger.success('[ImageStudio] Image generated');
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen text-white" style={{ background: '#08060f' }}>
      {/* BG glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-60 -right-60 w-[600px] h-[600px] rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle,#7c3aed,transparent 70%)' }} />
        <div className="absolute -bottom-60 -left-60 w-[500px] h-[500px] rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle,#10b981,transparent 70%)' }} />
      </div>

      {/* Mobile topbar */}
      <div className="lg:hidden flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid rgba(124,58,237,0.12)', background: 'rgba(255,255,255,0.02)' }}>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}>
            <Sparkles size={12} className="text-white" />
          </div>
          <span className="font-bold text-sm">Aatra AI</span>
        </Link>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-5 lg:px-8 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3"
            style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', color: '#a78bfa' }}>
            <ImageIcon size={12} />
            AI Image Studio
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Create & Edit Images</h1>
          <p className="text-gray-400 text-sm">Generate and enhance images with AI-powered tools</p>
        </div>

        {/* Upload Section */}
        <div className="rounded-2xl p-6 mb-8"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Upload size={16} /> Upload Image
          </h3>
          <ImageUpload onImageUpload={handleImageUpload} maxSize={5} />
          {uploadedImage && (
            <div className="mt-4">
              <img src={uploadedImage} alt="Uploaded" className="max-w-full max-h-60 rounded-xl" />
            </div>
          )}
        </div>

        {/* Generation Section */}
        <div className="rounded-2xl p-6 mb-8"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 className="text-lg font-semibold text-white mb-4">AI Generation</h3>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Describe what you want to generate..."
            rows={3}
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-violet-400 resize-none"
          />
          <button
            onClick={generateImage}
            disabled={!prompt.trim() || isGenerating}
            className="mt-3 px-5 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-2 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}
          >
            <RefreshCw size={14} className={isGenerating ? 'animate-spin' : ''} />
            {isGenerating ? 'Generating...' : 'Generate Image'}
          </button>
        </div>

        {/* Generated Image */}
        {generatedImage && (
          <div className="rounded-2xl p-6 mb-8"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Check size={16} className="text-emerald-400" /> Generated Result
            </h3>
            <img src={generatedImage} alt="Generated" className="max-w-full rounded-xl mb-4" />
            <a
              href={generatedImage}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}
            >
              <Download size={14} /> Download
            </a>
          </div>
        )}
      </div>
    </div>
  );
}