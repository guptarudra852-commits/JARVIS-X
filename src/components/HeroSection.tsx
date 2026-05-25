import React from 'react';
import { motion } from 'framer-motion';
import { Zap, LockKeyhole, Fingerprint, ArrowRightCircle } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }
  })
};

export const HeroSection = () => {
    return (
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 mt-[clamp(40px,8vw,72px)]">
            <div className="max-w-[560px]">
                <motion.h1 
                    className="font-bold tracking-tight text-[#192837] mb-6"
                    style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.65rem, 5vw, 3rem)', lineHeight: '1.05' }}
                    custom={0}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                >
                    Lock Down Your Passwords <Zap size={24} className="inline relative -top-1" /> with Ironclad <LockKeyhole size={24} className="inline relative -top-1" /> Security <Fingerprint size={24} className="inline relative -top-1" />
                </motion.h1>
                <motion.p 
                    className="mb-8"
                    style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)', lineHeight: '1.65', opacity: 0.8 }}
                    custom={1}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                >
                    Zero stress, total control. VaultShield keeps you covered with unbreakable storage, one-tap access, and pro-grade tools for your non-stop world.
                </motion.p>
                <motion.button 
                    className="flex justify-between items-center gap-8 text-white px-6 py-4 rounded-[50px] shadow-[0_4px_24px_rgba(115,66,226,0.28)]"
                    style={{ backgroundColor: 'var(--color-accent)', minWidth: '210px', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
                    custom={2}
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    whileHover={{ scale: 1.04, filter: 'brightness(1.1)' }}
                    whileTap={{ scale: 0.96 }}
                >
                    Get It Free <ArrowRightCircle size={20} />
                </motion.button>
            </div>
        </div>
    );
};
