import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const MobileMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const links = ['Vault', 'Plans', 'Install', 'News', 'Help'];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(25, 40, 55, 0.35)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div 
            className="fixed right-0 top-0 z-50 h-[100dvh] p-6 shadow-[-12px_0_48px_rgba(25,40,55,0.18)]"
            style={{ width: 'min(88vw, 360px)', backgroundColor: '#CFC8C5' }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.45 }}
          >
            <div className="flex items-center justify-between mb-8">
              <span className="font-bold text-xl" style={{ fontFamily: 'var(--font-heading)' }}>VaultShield</span>
              <button onClick={onClose}><X size={28} /></button>
            </div>
            <div className="h-px bg-black/10 mb-8" />
            <div className="flex flex-col gap-5">
              {links.map((link, i) => (
                <motion.a 
                  key={link}
                  href="#"
                  className="text-lg font-medium"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 + i * 0.07 }}
                >
                  {link}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
