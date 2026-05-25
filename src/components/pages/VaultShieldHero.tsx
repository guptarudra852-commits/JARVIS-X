import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, LockKeyhole, Fingerprint, ArrowRightCircle, Menu, X } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }
  })
};

const Navbar = ({ onMenuClick }: { onMenuClick: () => void }) => {
  const links = ['Vault', 'Plans', 'Install', 'News', 'Help'];
  return (
    <nav className="max-w-[1280px] mx-auto z-10 px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" overflow="visible" viewBox="0 0 256 256">
            <path d="M 64 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 L 128 64 L 128 64.5 L 161 32 L 192 0 L 256 0 L 256 64 L 192 128 L 128 128 L 128 192 L 96 223 L 63.5 256 L 0 256 L 0 192 Z M 256 192 L 224 223 L 191.5 256 L 128 256 L 128 192 L 192 128 L 256 128 Z" fill="#192837"/>
        </svg>
        <span className="font-bold text-xl" style={{ fontFamily: 'var(--font-heading)' }}>VaultShield</span>
      </div>
      <div className="hidden md:flex items-center gap-8">
        {links.map((link) => (
          <a key={link} href="#" className="text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: 'var(--color-text)' }}>{link}</a>
        ))}
      </div>
      <div className="hidden md:flex items-center gap-3">
        <button className="text-white rounded-full px-5 py-2.5 text-sm" style={{ backgroundColor: 'var(--color-accent)' }}>Start For Free</button>
        <button className="rounded-full px-5 py-2.5 text-sm" style={{ backgroundColor: 'var(--color-login-bg)', color: 'var(--color-text)' }}>Sign In</button>
      </div>
      <button className="md:hidden" onClick={onMenuClick}><Menu size={28} /></button>
    </nav>
  );
};

const MobileMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const links = ['Vault', 'Plans', 'Install', 'News', 'Help'];
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div className="fixed inset-0 z-40" style={{ backgroundColor: 'rgba(25, 40, 55, 0.35)', backdropFilter: 'blur(4px)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div className="fixed right-0 top-0 z-50 h-[100dvh] p-6" style={{ width: 'min(88vw, 360px)', backgroundColor: '#CFC8C5' }} initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ ease: [0.22, 1, 0.36, 1] as any, duration: 0.45 }}>
            <div className="flex items-center justify-between mb-8"><span className="font-bold text-xl" style={{ fontFamily: 'var(--font-heading)' }}>VaultShield</span><button onClick={onClose}><X size={28} /></button></div>
            <div className="h-px bg-black/10 mb-8" /><div className="flex flex-col gap-5">
              {links.map((link, i) => (
                <motion.a key={link} href="#" className="text-lg font-medium" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 + i * 0.07 }}>{link}</motion.a>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default function VaultShieldHero() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    return (
        <div className="relative w-full min-h-screen text-[#192837] overflow-hidden" style={{ fontFamily: 'var(--font-body)' }}>
            <video className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline>
                <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260518_003132_8b7edcb6-c64d-4a52-a9ca-879942e122ad.mp4" type="video/mp4" />
            </video>
            <Navbar onMenuClick={() => setIsMobileMenuOpen(true)} />
            <div className="max-w-[1280px] mx-auto px-5 sm:px-8 mt-[clamp(40px,8vw,72px)]">
                <div className="max-w-[560px]">
                    <motion.h1 className="font-bold tracking-tight mb-6" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.65rem, 5vw, 3rem)', lineHeight: '1.05' }} custom={0} initial="hidden" animate="visible" variants={fadeUp}>
                        Lock Down Your Passwords <Zap size={24} className="inline relative -top-1" /> with Ironclad <LockKeyhole size={24} className="inline relative -top-1" /> Security <Fingerprint size={24} className="inline relative -top-1" />
                    </motion.h1>
                    <motion.p className="mb-8" style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)', lineHeight: '1.65', opacity: 0.8 }} custom={1} initial="hidden" animate="visible" variants={fadeUp}>
                        Zero stress, total control. VaultShield keeps you covered with unbreakable storage, one-tap access, and pro-grade tools for your non-stop world.
                    </motion.p>
                    <motion.button className="flex justify-between items-center gap-8 text-white px-6 py-4 rounded-[50px] shadow-[0_4px_24px_rgba(115,66,226,0.28)]" style={{ backgroundColor: 'var(--color-accent)', minWidth: '210px', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }} custom={2} initial="hidden" animate="visible" variants={fadeUp} whileHover={{ scale: 1.04, filter: 'brightness(1.1)' }} whileTap={{ scale: 0.96 }}>
                        Get It Free <ArrowRightCircle size={20} />
                    </motion.button>
                </div>
            </div>
            <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        </div>
    );
};
