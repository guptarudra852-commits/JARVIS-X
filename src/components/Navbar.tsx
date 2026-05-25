import React from 'react';
import { Menu } from 'lucide-react';

export const Navbar = ({ onMenuClick }: { onMenuClick: () => void }) => {
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
          <a key={link} href="#" className="text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: 'var(--color-text)' }}>
            {link}
          </a>
        ))}
      </div>

      <div className="hidden md:flex items-center gap-3">
        <button className="text-white rounded-full px-5 py-2.5 text-sm" style={{ backgroundColor: 'var(--color-accent)' }}>
          Start For Free
        </button>
        <button className="rounded-full px-5 py-2.5 text-sm" style={{ backgroundColor: 'var(--color-login-bg)', color: 'var(--color-text)' }}>
          Sign In
        </button>
      </div>

      <button className="md:hidden" onClick={onMenuClick}>
        <Menu size={28} />
      </button>
    </nav>
  );
};
