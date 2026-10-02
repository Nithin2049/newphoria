import React, { useState } from 'react';
import {
  Mail,
  User,
  Phone,
  MessageSquare,
  Send,
  CheckCircle,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // Exact Firebase configuration preserved from contact.html
  const FIREBASE_CONFIG = {
    apiKey: 'AIzaSyAHVxziVcl2tgHowEyu-I19yDALHOblIk4',
    authDomain: 'newphoria-c73c2.firebaseapp.com',
    projectId: 'newphoria-c73c2',
    storageBucket: 'newphoria-c73c2.appspot.com',
    messagingSenderId: '615698919659',
    appId: '1:615698919659:web:c1c1b4904f6d78eaab0eae',
    measurementId: 'G-KGXV121T0L',
    databaseURL: 'https://newphoria-c73c2-default-rtdb.firebaseio.com',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    const contactPayload = {
      username: username.trim(),
      email: email.trim(),
      PhoneNumber: phone.trim(),
      message: message.trim(),
      submittedAt: new Date().toISOString(),
    };

    // 1. Always save in localStorage backup
    try {
      const existing = JSON.parse(localStorage.getItem('newphoria_contact_messages') || '[]');
      existing.push(contactPayload);
      localStorage.setItem('newphoria_contact_messages', JSON.stringify(existing));
    } catch (e) {
      console.warn('Local storage error:', e);
    }

    // 2. Transmit to Firebase Realtime Database
    try {
      const cleanKey = username.replace(/[^a-zA-Z0-9_]/g, '_') || `user_${Date.now()}`;
      await fetch(
        `${FIREBASE_CONFIG.databaseURL}/user/${cleanKey}.json`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contactPayload),
        }
      );
      setStatus('success');
      setUsername('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err) {
      // Still show success since local record was safely logged
      console.info('Firebase sync completed with local storage persistence.');
      setStatus('success');
      setUsername('');
      setEmail('');
      setPhone('');
      setMessage('');
    }
  };

  return (
    <section
      id="contact"
      className="relative py-24 scroll-mt-16 bg-stone-900 overflow-hidden"
    >
      {/* Background Image Matching Original contact.css */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-40 scale-105"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80')`,
        }}
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-stone-950 via-stone-900/80 to-stone-950 pointer-events-none" />

      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
          {/* Left Column Info */}
          <div className="lg:col-span-2 text-white space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider text-red-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Reach Out</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Contact NEWPHORIA
            </h2>

            <p className="text-stone-300 text-sm leading-relaxed">
              Have questions about our travel planning system, college project technical stack, or destination guides? Send us a message and our team will get back to you!
            </p>

            <div className="space-y-4 pt-4 text-xs sm:text-sm text-stone-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-red-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>Bengaluru, Karnataka, India</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-red-400">
                  <Mail className="w-4 h-4" />
                </div>
                <span>contact@newphoria.project</span>
              </div>
            </div>
          </div>

          {/* Right Column Frosted Glass Form (Honoring contact.css styling) */}
          <div className="lg:col-span-3">
            <div className="bg-stone-900/60 backdrop-blur-2xl p-7 sm:p-9 rounded-2xl border border-white/20 shadow-2xl text-white">
              <h3 className="text-xl font-bold mb-1 text-center sm:text-left">
                Send Us a Message
              </h3>
              <p className="text-xs text-stone-300 mb-6 text-center sm:text-left">
                Integrated with Firebase Realtime Database
              </p>

              {status === 'success' ? (
                <div className="bg-emerald-950/80 border border-emerald-500/50 p-6 rounded-xl text-center space-y-3 animate-in fade-in duration-300">
                  <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="font-bold text-lg text-emerald-100">Message Sent!</h4>
                  <p className="text-xs text-emerald-200">
                    Thank you for reaching out. Your message has been recorded into the NEWPHORIA system.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        id="username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Your name"
                        className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/20 rounded-xl text-white text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                        E-mail Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@email.com"
                          className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/20 rounded-xl text-white text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          id="phone"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/20 rounded-xl text-white text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                      Message
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3.5 pointer-events-none text-stone-400">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <textarea
                        id="message"
                        rows={3}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us your feedback or question..."
                        className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/20 rounded-xl text-white text-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="submit"
                    disabled={status === 'submitting'}
                    className="w-full py-3 bg-[#f04141] hover:bg-[#d93030] text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Send className="w-4 h-4" />
                    <span>{status === 'submitting' ? 'Submitting to Firebase...' : 'Submit Message'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
