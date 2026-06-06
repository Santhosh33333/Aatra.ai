import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { ADMIN_EMAIL } from '../lib/paymentPlans';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const mailtoLink = `mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    )}`;
    
    window.location.href = mailtoLink;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy to-[#1e2332] text-white pt-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-400">We're here to help. Contact our team for support.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Info */}
          <div className="space-y-8">
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

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-400"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-400"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-400"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-400 resize-none"
                  placeholder="Tell us more..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-400 to-cyan-400 text-[#080c18] py-3 rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Send size={20} />
                Send Message
              </button>

              {submitted && (
                <div className="bg-green-400/20 border border-green-400 rounded-lg p-3 text-green-300 text-sm">
                  Message sent! Opening email client...
                </div>
              )}
            </div>
          </form>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'How do I upgrade my plan?', a: 'Go to Pricing section and select your desired plan. You can upgrade anytime.' },
              { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription anytime. No questions asked.' },
              { q: 'Do you offer refunds?', a: 'We offer 30-day money-back guarantee on all paid plans.' },
              { q: 'Is there a free trial?', a: 'Yes! Start with our free Mini plan, no credit card required.' },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-6">
                <h3 className="font-semibold mb-2">{item.q}</h3>
                <p className="text-gray-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
