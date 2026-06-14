import React from 'react';
import { motion } from 'framer-motion';

export const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Background Mesh Grid overlay */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-70"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(14,135,235,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(14,135,235,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] dark:bg-[linear-gradient(to_right,rgba(14,135,235,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(14,135,235,0.03)_1px,transparent_1px)]"></div>
      
      {/* Blob 1 */}
      <motion.div
        className="absolute top-[10%] left-[-5%] w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] rounded-full bg-gradient-to-tr from-brand-300/10 to-indigo-400/10 blur-[80px] dark:from-brand-500/10 dark:to-indigo-500/10"
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.1, 0.9, 1]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Blob 2 */}
      <motion.div
        className="absolute bottom-[20%] right-[-5%] w-[40vw] h-[40vw] max-w-[450px] max-h-[450px] rounded-full bg-gradient-to-tr from-purple-300/10 to-brand-300/10 blur-[90px] dark:from-purple-500/10 dark:to-brand-500/10"
        animate={{
          x: [0, -35, 20, 0],
          y: [0, 30, -30, 0],
          scale: [1, 0.9, 1.1, 1]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Blob 3 (Center subtle glow) */}
      <div className="absolute top-[40%] left-[45%] w-[15vw] h-[15vw] rounded-full bg-brand-500/5 dark:bg-brand-500/8 blur-[50px]"></div>
    </div>
  );
};
