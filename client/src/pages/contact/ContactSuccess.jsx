import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, MessageCircle, Compass, ArrowLeft, Heart, Instagram, Youtube } from 'lucide-react';
import Navbar from '../../components/home/Navbar.jsx';
import Footer from '../../components/home/Footer.jsx';

const ContactSuccess = () => {
  return (
    <div className="bg-brand-dark text-white min-h-screen flex flex-col justify-between relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-brand-purple/[0.04] blur-[150px]" />
        <div className="absolute top-[35%] left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-brand-gold/[0.03] blur-[150px]" />
      </div>

      <Navbar />

      <main className="flex-grow flex items-center justify-center py-16 px-4 relative z-10 w-full">
        <div className="max-w-md w-full bg-zinc-800/10 border border-brand-border/40 p-8 sm:p-10 rounded-3xl text-center backdrop-blur-md shadow-2xl relative">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-brand-dark border-4 border-brand-border/60 flex items-center justify-center text-brand-gold shadow-gold-glow">
            <CheckCircle2 size={48} className="animate-bounce" />
          </div>

          <div className="mt-8 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest block">
                Submission Received
              </span>
              <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
                Message Dispatched!
              </h1>
              <p className="text-zinc-400 text-sm leading-relaxed font-sans">
                Thank you for contacting NextGen CMA. An expert counselor will review your inquiry and reply via email or phone within 24 business hours.
              </p>
            </div>

            {/* Quick community hooks */}
            <div className="p-4 rounded-2xl bg-black/40 border border-brand-border/40 text-left space-y-3.5">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">
                Recommended Next Step
              </span>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                Join our active candidate channels to receive syllabus guides, exam updates, and peer advice instantly:
              </p>
              <div className="flex flex-col gap-2.5">
                <a
                  href="https://chat.whatsapp.com/EG1Xfx2JylM0SISodwhLh2?s=cl&p=a&ilr=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-green-500/5 hover:bg-green-500/10 border border-green-500/10 hover:border-green-500/20 text-xs font-semibold text-white transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    <MessageCircle size={14} className="text-green-400" /> WhatsApp Community
                  </span>
                  <span className="text-[10px] text-green-400 uppercase tracking-wider font-bold">Join →</span>
                </a>

                <a
                  href="https://t.me/nextgencma18"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/10 hover:border-blue-500/20 text-xs font-semibold text-white transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    <Compass size={14} className="text-blue-400" /> Telegram Channel
                  </span>
                  <span className="text-[10px] text-blue-400 uppercase tracking-wider font-bold">Join →</span>
                </a>

                <a
                  href="https://www.instagram.com/cma_nextgen_?utm_source=qr&igsh=MWg0cDBnZGhzZ3l2MQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-pink-500/5 hover:bg-pink-500/10 border border-pink-500/10 hover:border-pink-500/20 text-xs font-semibold text-white transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    <Instagram size={14} className="text-pink-400" /> Instagram Handle
                  </span>
                  <span className="text-[10px] text-pink-400 uppercase tracking-wider font-bold">Follow →</span>
                </a>

                <a
                  href="https://youtube.com/@nextgencma?si=W8caW7Va1D328W3z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20 text-xs font-semibold text-white transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    <Youtube size={14} className="text-red-400" /> YouTube Channel
                  </span>
                  <span className="text-[10px] text-red-400 uppercase tracking-wider font-bold">Watch →</span>
                </a>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <Link
                to="/"
                className="btn-gold w-full text-center py-3 rounded-xl text-xs uppercase tracking-wider font-bold shadow-lg shadow-gold-glow/5"
              >
                Return to Homepage
              </Link>
              <Link
                to="/services"
                className="flex items-center justify-center gap-2 text-xs text-zinc-500 hover:text-white transition-colors py-2 font-medium"
              >
                <ArrowLeft size={12} /> Explore Our Core Services
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactSuccess;
