"use client";

import { useState, useEffect } from "react";
import { Menu, X, Search, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import SmartSearchBar from "@/components/SmartSearchBar";

export default function Navbar() {
  const pathname = usePathname();
  const router   = useRouter();

  const [isOpen, setIsOpen]         = useState(false);
  const [visible, setVisible]       = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [signedIn, setSignedIn]     = useState(false);
  const [showQuote, setShowQuote]   = useState(false);

  // Hide navbar for internal authenticated pages
  const isDashboard =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/portal") ||
    pathname?.startsWith("/login");

  const links = [
    { name: "Home",             href: "/" },
    { name: "About",            href: "/about" },
    { name: "Services",         href: "/services" },
    { name: "Fleet Complement", href: "/fleet" },
    { name: "Initiatives",      href: "/initiatives" },
    { name: "Contact",          href: "/contact" },
  ];

  // Sync auth state
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setSignedIn(!!user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setSignedIn(!!session?.user);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Hide on scroll down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 50) setVisible(false);
      else setVisible(true);
      setLastScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleUserClick = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const { data: portalCheck } = await supabase
      .from("portal_admins")
      .select("email")
      .eq("email", user.email)
      .single();

    router.push(portalCheck ? "/portal" : "/dashboard");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  };
  const linkVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  if (isDashboard) return null;

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="fixed top-7 left-0 w-full z-50"
      >
        <div className="container mx-auto px-6 lg:px-16 flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="Premier Mobility Logo" width={160} height={80} />
          </Link>

          {/* Desktop Nav */}
          <div className={`hidden md:flex flex-grow items-center justify-between h-16 rounded-full pr-2 mt-5 transition-all duration-300 ${
            visible ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-white/40 backdrop-blur-lg shadow-md"
          }`}>
            <div className="flex items-center space-x-8 md:pl-8">
              {links.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link key={link.name} href={link.href}
                    className={`relative text-sm font-medium transition group ${active ? "text-black" : "text-gray-700 hover:text-black"}`}>
                    {link.name}
                    <span className={`absolute bottom-[-4px] left-0 h-[2px] bg-gradient-to-r from-teal-400 to-green-400 transition-all duration-300 ${active ? "w-full" : "w-0 group-hover:w-full"}`} />
                  </Link>
                );
              })}
            </div>

            {/* Search / Quote trigger */}
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 10px rgba(20,184,166,0.2)" }}
              onClick={() => setShowQuote(true)}
              className="flex items-center border rounded-full shadow-sm px-2 py-2 hover:shadow-md transition cursor-pointer bg-transparent"
            >
              <span className="text-sm text-gray-600 ml-2 mr-4">Where to?</span>
              <span className="w-px h-6 bg-gray-300 mr-4" />
              <span className="text-sm text-gray-600 mr-4">When?</span>
              <span className="w-px h-6 bg-gray-300 mr-4" />
              <span className="text-sm text-gray-600">Which Cargo</span>
              <div className="ml-4 bg-gradient-to-r from-teal-400 to-green-400 text-white p-2 rounded-full">
                <Search className="w-4 h-4" />
              </div>
            </motion.button>
          </div>

          {/* User Icon */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleUserClick}
            title={signedIn ? "Go to dashboard" : "Sign in"}
            className={`hidden md:flex items-center mt-5 justify-center w-16 h-16 rounded-full transition-all duration-300 cursor-pointer ${
              signedIn
                ? "bg-gradient-to-r from-teal-400 to-green-400 shadow-lg shadow-teal-400/30"
                : visible
                  ? "bg-white/90 shadow-md"
                  : "bg-white/40 backdrop-blur-lg shadow-md"
            }`}
          >
            <User className={`w-6 h-6 ${signedIn ? "text-[#0D1B2A]" : "text-gray-700"}`} />
          </motion.button>

          {/* Mobile Hamburger */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="md:hidden flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-md hover:shadow-lg transition"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
          </motion.button>
        </div>

        {/* Full-screen Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="hidden"
              animate="show"
              exit={{ opacity: 0 }}
              variants={containerVariants}
              className="fixed inset-0 bg-white flex flex-col justify-center items-center space-y-10 z-40"
            >
              {links.map((link) => (
                <motion.div key={link.name} variants={linkVariants}>
                  <Link href={link.href} onClick={() => setIsOpen(false)}
                    className={`relative text-2xl font-semibold transition group ${pathname === link.href ? "text-black" : "text-gray-700 hover:text-black"}`}>
                    {link.name}
                    <span className={`absolute bottom-[-6px] left-0 h-[3px] bg-gradient-to-r from-teal-400 to-green-400 transition-all duration-300 ${pathname === link.href ? "w-full" : "w-0 group-hover:w-full"}`} />
                  </Link>
                </motion.div>
              ))}

              {/* Mobile quote button */}
              <motion.div variants={linkVariants}>
                <button
                  onClick={() => { setIsOpen(false); setShowQuote(true); }}
                  className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-teal-400 text-teal-600 font-semibold"
                >
                  <Search className="w-5 h-5" /> Request a Quote
                </button>
              </motion.div>

              {/* Mobile user / sign in */}
              <motion.div variants={linkVariants}>
                <button
                  onClick={() => { setIsOpen(false); handleUserClick(); }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm ${
                    signedIn
                      ? "bg-gradient-to-r from-teal-400 to-green-400 text-[#0D1B2A]"
                      : "border border-gray-300 text-gray-700"
                  }`}
                >
                  <User className="w-4 h-4" />
                  {signedIn ? "My Dashboard" : "Sign In"}
                </button>
              </motion.div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(false)}
                className="absolute bottom-0 left-0 w-full py-5 bg-gradient-to-r from-teal-400 to-green-400 text-white text-lg font-semibold"
              >
                Close Menu
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Quote modal — rendered outside the nav so it covers everything */}
      <AnimatePresence>
        {showQuote && <SmartSearchBar onClose={() => setShowQuote(false)} />}
      </AnimatePresence>
    </>
  );
}
