import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { ADMIN_EMAIL } from '../lib/paymentPlans';
import { logger } from '../lib/logger';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] [Contact] Page loaded`,
  ]);
  const [errors, setErrors] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const fullLog = `[${timestamp}] ${message}`;
    setLogs(prev => [...prev.slice(-14), fullLog]);
    logger.info(message);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    addLog(`[Contact] Input changed: ${name}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    
    const newErrors: string[] = [];
    if (!formData.name.trim()) newErrors.push('Name is required');
    if (!formData.email.trim()) newErrors.push('Email is required');
    if (!formData.email.includes('@')) newErrors.push('Invalid email format');
    if (!formData.subject.trim()) newErrors.push('Subject is required');
    if (!formData.message.trim()) newErrors.push('Message is required');
    
    if (newErrors.length > 0) {
      setErrors(newErrors);
      addLog(`[Contact] Validation failed: ${newErrors.join(', ')}`);
      logger.warn('[Contact] Form validation failed', { errors: newErrors });
      return;
    }

    try {
      addLog(`[Contact] Form submitted - Preparing to send email`);
      logger.info('[Contact] Form validation passed', { email: formData.email });
      
      const mailtoLink = `mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
      )}`;
      
      addLog(`[Contact] Opening email client for ${formData.email}`);
      window.location.href = mailtoLink;
      
      setSubmitted(true);
      logger.success('[Contact] Email link opened successfully');
      addLog(`[Contact] Form submitted successfully`);
      
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      addLog(`[Contact] Error: ${errorMsg}`);
      logger.error('[Contact] Submit error', error);
      setErrors([errorMsg]);
    }
  };

  return (
    <div className="min-h-screen text-white pt-20" style={{ background: '#08060f' }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-400">We're here to help. Contact our team for support.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Contact Info */}
          <div className="space-y-8 lg:col-span-1">
            <div className="flex gap-4">
              <Mail className="text-amber-400 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-semibold mb-2">Email</h3>
                <a href={`mailto:${ADMIN_EMAIL}`} className="text-gray-300 hover:text-white">
                  {ADMIN_EMAIL}
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <Phone className="text-cyan-400 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-semibold mb-2">Support Hours</h3>
                <p className="text-gray-300">Mon-Fri: 9AM - 6PM IST</p>
              </div>
            </div>

            <div className="flex gap-4">
              <MapPin className="text-green-400 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-semibold mb-2">Location</h3>
                <p className="text-gray-300">India</p>
              </div>
            </div>
          </div>

          {/* Contact Form & Logs */}
          <div className="lg:col-span-3 space-y-6">
            {/* Error Messages */}
            {errors.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <div className="text-red-400 text-sm font-medium mb-2">Please fix the following errors:</div>
                <ul className="space-y-1">
                  {errors.map((error, i) => (
                    <li key={i} className="text-red-300 text-sm">• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Success Message */}
            {submitted && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-gap-3">
                <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
                <div>
                  <div className="text-green-400 font-medium">Email sent successfully!</div>
                  <div className="text-green-300 text-sm mt-1">Your email client should open. If not, you can email us directly at {ADMIN_EMAIL}</div>
                </div>
              </div>
            )}

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-400"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-400"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-400"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-400 resize-none"
                  placeholder="Tell us more..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-400 to-cyan-400 text-[#080c18] font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Send size={18} />
                Send Message
              </button>
            </form>

            {/* Activity Logs */}
            <div className="bg-black/40 border border-amber-500/20 rounded-xl p-4">
              <div className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                Activity Logs ({logs.length})
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto font-mono text-xs">
                {logs.map((log, idx) => (
                  <div key={idx} className="text-gray-400 hover:text-amber-300 transition-colors pl-2 border-l border-amber-500/20">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
