import Navbar from "./Navbar";

const Footer = () => (
  <footer className="py-8 border-t border-white/10 relative z-10">
    <div className="container mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto">
        <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          The Bharat Astro
        </h3>
        <p className="text-[11px] text-gray-500">
          Copyright © 2026 The Bharat Astro. All Rights Reserved
        </p>
      </div>
    </div>
  </footer>
);

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout = ({ children, className = "" }: LayoutProps) => (
  <div className={`min-h-screen bg-slate-950 flex flex-col ${className}`}>
    <Navbar />
    <main className="flex-1 pt-16 md:pt-20">
      {children}
    </main>
    <Footer />
  </div>
);

export { Footer };
export default Layout;
