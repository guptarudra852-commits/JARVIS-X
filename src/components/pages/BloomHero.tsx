import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Download, Wand2, BookOpen, ArrowRight, Twitter, Linkedin, Instagram, Menu } from 'lucide-react';

export default function BloomHero() {
  return (
    <div className="relative min-h-screen w-full text-white font-['Poppins'] overflow-hidden">
        {/* Background Video */}
        <video className="absolute inset-0 w-full h-full object-cover z-0" autoPlay muted loop playsInline>
            <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260315_073750_51473149-4350-4920-ae24-c8214286f323.mp4" type="video/mp4" />
        </video>
        
        {/* Wrapped panels */}
        <div className="flex w-full min-h-screen [@media(min-width:1600px)]:max-w-[1600px] [@media(min-width:1600px)]:mx-auto">
            {/* Left Panel */}
            <div className="relative w-[52%] flex flex-col z-10 p-6">
                <div className="liquid-glass-strong absolute inset-4 lg:inset-6 rounded-3xl hidden lg:block"></div>
                <div className="liquid-glass-strong absolute inset-4 rounded-3xl lg:hidden"></div>
                
                <nav className="relative z-20 flex items-center justify-between px-6 pt-2">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="Bloom Logo" className="w-8 h-8 rounded-full" />
                        <span className="font-semibold text-2xl tracking-tighter">bloom</span>
                    </div>
                    <button className="liquid-glass rounded-[var(--radius)] px-5 py-2.5 flex items-center gap-2 hover:scale-105 transition-transform">
                        <Menu size={18} /> Menu
                    </button>
                </nav>

                <main className="relative z-20 flex-1 flex flex-col items-center justify-center gap-8 px-6 max-w-4xl mx-auto">
                    <div className="w-20 h-20 bg-white/10 rounded-[var(--radius)] flex items-center justify-center">
                        <img src="/logo.png" alt="Bloom Logo" className="w-12 h-12" />
                    </div>
                    
                    <h1 className="text-6xl lg:text-7xl tracking-[-0.05em] font-medium text-center">
                        Innovating the <em className="font-['Source_Serif_4'] font-serif text-white/80 italic">spirit of bloom AI</em>
                    </h1>
                    
                    <button className="liquid-glass-strong rounded-[var(--radius)] px-8 py-4 flex items-center gap-4 hover:scale-105 transition-transform">
                        Explore Now <div className="w-7 h-7 rounded-[var(--radius)] bg-white/15 flex items-center justify-center"><Download size={14} /></div>
                    </button>

                    <div className="flex gap-4">
                        {["Artistic Gallery", "AI Generation", "3D Structures"].map(text => (
                            <div key={text} className="liquid-glass rounded-[var(--radius)] px-5 py-2 text-xs text-white/80">{text}</div>
                        ))}
                    </div>
                </main>

                <footer className="relative z-20 px-6 pb-2 text-center max-w-4xl mx-auto">
                    <div className="text-xs tracking-widest uppercase text-white/50 mb-2">VISIONARY DESIGN</div>
                    <div className="text-xl font-medium"><i className="font-['Source_Serif_4'] italic">We imagined a realm with no ending.</i></div>
                    <div className="text-sm text-white/60 mt-2">--- MARCUS AURELIO ---</div>
                </footer>
            </div>

            {/* Right Panel (Desktop) */}
            <div className="relative w-[48%] z-10 p-6 hidden lg:flex flex-col gap-6">
                <div className="max-w-xl mx-auto w-full flex flex-col gap-6">
                    <div className="flex justify-end gap-3">
                        <div className="liquid-glass rounded-[var(--radius)] p-2 flex gap-3">
                            <Twitter size={18} className="hover:text-white/80 transition-colors cursor-pointer" />
                            <Linkedin size={18} className="hover:text-white/80 transition-colors cursor-pointer" />
                            <Instagram size={18} className="hover:text-white/80 transition-colors cursor-pointer" />
                            <ArrowRight size={18} className="hover:text-white/80 transition-colors cursor-pointer" />
                        </div>
                        <button className="liquid-glass rounded-[var(--radius)] p-2 px-4 hover:scale-105 transition-transform flex items-center gap-2">
                            <Sparkles size={18} /> Account
                        </button>
                    </div>
                    
                    <div className="liquid-glass w-56 rounded-3xl p-6">
                        <h3 className="font-medium text-lg mb-2">Enter our ecosystem</h3>
                        <p className="text-sm text-white/70">Join the collective of plant designers pushing boundaries.</p>
                    </div>

                    <div className="mt-auto liquid-glass rounded-[2.5rem] p-6 flex flex-col gap-4">
                        <div className="flex gap-4">
                            <div className="liquid-glass flex-1 rounded-3xl p-6 flex items-center gap-4">
                                <Wand2 size={24} /> Processing
                            </div>
                            <div className="liquid-glass flex-1 rounded-3xl p-6 flex items-center gap-4">
                                <BookOpen size={24} /> Growth Archive
                            </div>
                        </div>
                        <div className="liquid-glass rounded-3xl p-4 flex items-center gap-4">
                            <img src="/assets/hero-flowers.png" alt="Flowers" className="w-24 h-16 object-cover rounded-xl" />
                            <div className="flex-1">
                                <h4 className="font-medium">Advanced Plant Sculpting</h4>
                                <p className="text-sm text-white/70">Master the art with AI.</p>
                            </div>
                            <button className="w-10 h-10 rounded-[var(--radius)] bg-white/10 flex items-center justify-center text-xl">+</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
