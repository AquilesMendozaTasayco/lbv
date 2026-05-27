"use client";

import { motion } from "framer-motion";

export default function PageHero({ title, subtitle, bgImage }) {
  return (
    <section className="relative flex min-h-[300px] sm:min-h-[340px] md:min-h-[400px] items-center justify-center overflow-hidden bg-primary pt-16">
      {bgImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}

      <div
        className={`absolute inset-0 ${
          bgImage
            ? "bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60"
            : "bg-primary"
        }`}
      />

      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="mx-auto mb-4 md:mb-5 h-[2px] w-10 md:w-14 bg-accent" />
          <h1 className="font-sans text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 md:mb-4 leading-tight drop-shadow-lg">
            {title}
          </h1>
          {subtitle && (
            <p className="font-sans text-xs sm:text-sm md:text-base lg:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
