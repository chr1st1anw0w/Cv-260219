import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-200 dark:border-gray-800 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
      <p>© {new Date().getFullYear()} Christian Wu. Crafted with precision.</p>
      <div className="flex gap-6 mt-4 md:mt-0">
        <a className="hover:text-primary transition-colors" href="#">LinkedIn</a>
        <a className="hover:text-primary transition-colors" href="#">Behance</a>
        <a className="hover:text-primary transition-colors" href="#">Dribbble</a>
      </div>
    </footer>
  );
};

export default Footer;