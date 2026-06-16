import { useState, useRef } from 'react';
import { Upload, X, Check, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload?: (file: File, preview: string) => void;
  maxSize?: number;
  className?: string;
}

export default function ImageUpload({ onImageUpload, maxSize = 5, className = '' }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    if (file.size > maxSize * 1024 * 1024) {
      setErrorMessage(`File too large. Max ${maxSize}MB.`);
      return false;
    }
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Invalid file type. Use PNG or JPG.');
      return false;
    }
    return true;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) {
      setStatus('error');
      setPreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreview(result);
      setStatus('success');
      onImageUpload?.(file, result);
      setTimeout(() => setStatus('idle'), 3000);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setPreview(null);
    setStatus('idle');
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-4">
        {preview ? (
          <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button
              onClick={clearImage}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <div className="w-20 h-20 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(124,58,237,0.3)' }}>
            <Upload size={24} className="text-gray-600" />
          </div>
        )}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white cursor-pointer hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#10b981)' }}
          >
            <Upload size={14} />Select Image
          </label>
          <p className="text-xs text-gray-600 mt-1">Max {maxSize}MB • PNG, JPG</p>
        </div>
      </div>
      {status === 'success' && (
        <div className="flex items-center gap-2 text-emerald-400 text-xs">
          <Check size={14} /> Uploaded successfully
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-400 text-xs">
          <AlertCircle size={14} /> {errorMessage}
        </div>
      )}
    </div>
  );
}