// src/app/page.js
'use client';
import { motion } from 'framer-motion';
import AuthForm from '@/components/AuthForm';

export default function Home() {
  return (
    <motion.main
      className="flex min-h-screen flex-col items-center justify-center p-24"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <AuthForm />
    </motion.main>
  );
}
