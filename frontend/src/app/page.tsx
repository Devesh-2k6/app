"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { 
  MapPin, 
  ArrowRight, 
  MoreHorizontal, 
  Clock, 
  BarChart3, 
  Leaf, 
  Bell, 
  ShieldCheck,
  Sparkles,
  MessageCircle,
  Camera,
  Briefcase,
  Code
} from "lucide-react";

import { useConfetti } from "@/hooks/useConfetti";
import { useSound } from "@/hooks/useSound";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import MagneticButton from "@/components/ui/MagneticButton";

// Dynamically import client components
const HeroMap = dynamic(() => import('@/components/map/HeroMap'), { ssr: false });
const CustomCursor = dynamic(() => import('@/components/ui/CustomCursor'), { ssr: false });

export default function Home() {
  const { triggerConfetti } = useConfetti();
  const { playPopSound } = useSound();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Parallax effects
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -150]);

  const handleReserve = (e: React.MouseEvent) => {
    playPopSound();
    triggerConfetti(e);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden relative">
      <CustomCursor />
      
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-emerald-500 origin-left z-[99999] shadow-[0_0_10px_rgba(16,185,129,0.8)]"
        style={{ scaleX }}
      />

      {/* Ambient Parallax Background Glows */}
      <div className="absolute top-0 inset-x-0 h-[120vh] overflow-hidden pointer-events-none z-0">
        <motion.div 
          style={{ y: y1 }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-20 w-[40vw] h-[40vw] min-w-[500px] min-h-[500px] bg-emerald-500/30 rounded-full blur-[130px]" 
        />
        <motion.div 
          style={{ y: y2 }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[20%] -right-20 w-[45vw] h-[45vw] min-w-[600px] min-h-[600px] bg-amber-500/20 rounded-full blur-[150px]" 
        />
      </div>

      {/* Navbar */}
      <div className="pt-6 px-4 max-w-7xl mx-auto sticky top-0 z-50">
        <nav className="bg-[#242424]/60 backdrop-blur-3xl border border-white/5 rounded-2xl px-4 md:px-6 py-3 md:py-4 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300">
          <div className="flex items-center gap-8">
            <MagneticButton>
              <Link href="/" onClick={playPopSound} className="flex items-center gap-2 group cursor-pointer">
                <div className="bg-emerald-500 p-1.5 rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                  <MapPin size={20} className="text-white fill-white" />
                </div>
                <span className="text-xl font-bold tracking-tight">Expiry<span className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">Go</span></span>
              </Link>
            </MagneticButton>
            
            <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-gray-300">
              <Link href="#" onClick={playPopSound} className="hover:text-white transition-all cursor-pointer">For shoppers</Link>
              <Link href="#" onClick={playPopSound} className="hover:text-white transition-all cursor-pointer">For shops</Link>
              <Link href="#" onClick={playPopSound} className="hover:text-white transition-all cursor-pointer">How it works</Link>
              <Link href="#" onClick={playPopSound} className="hover:text-white transition-all cursor-pointer">Impact</Link>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <MagneticButton className="hidden md:block">
              <Link href="/auth?tab=login" onClick={playPopSound} className="text-sm font-semibold text-white px-5 py-2.5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer">
                Sign in
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link href="/auth?tab=register" onClick={playPopSound} className="text-sm font-bold text-[#111111] bg-white px-5 py-2.5 rounded-xl hover:bg-gray-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-300 cursor-pointer">
                Get started
              </Link>
            </MagneticButton>
            <button onClick={playPopSound} className="p-2.5 text-gray-400 hover:text-white bg-white/5 rounded-xl ml-1 hover:bg-white/10 transition-colors cursor-pointer">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-4 pt-20 md:pt-32 pb-24 flex flex-col items-center text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-5 py-2 rounded-full text-xs md:text-sm font-semibold mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.15)]"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
          Live in Chennai • 240+ shops onboard
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter mb-6 leading-[1.05]"
        >
          Don&apos;t waste it.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600 drop-shadow-sm">Grab it</span> before it&apos;s <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 drop-shadow-sm">gone.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 font-medium leading-relaxed"
        >
          Near-expiry products from local shops — at up to 70% off. Save money, fight food waste, shop smarter.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full mb-20"
        >
          <MagneticButton className="w-full sm:w-auto">
            <Link href="/deals" onClick={playPopSound} className="w-full sm:w-auto flex justify-center items-center gap-2 px-8 py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all duration-300 transform cursor-pointer text-lg">
              <MapPin size={22} />
              Browse deals near me
            </Link>
          </MagneticButton>
          <MagneticButton className="w-full sm:w-auto">
            <Link href="/shop/setup" onClick={playPopSound} className="w-full sm:w-auto flex justify-center items-center gap-2 px-8 py-4 bg-[#242424] border border-white/10 rounded-2xl font-bold hover:bg-[#333] hover:border-white/30 transition-all duration-300 cursor-pointer text-lg">
              List your shop <ArrowRight size={22} />
            </Link>
          </MagneticButton>
        </motion.div>

        {/* Interactive Map */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-4xl h-[400px] md:h-[450px] relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5"
        >
          <HeroMap />
        </motion.div>
      </main>

      {/* Divider */}
      <div className="h-px w-full max-w-7xl mx-auto bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Nearby Deals Section */}
      <section className="max-w-5xl mx-auto px-4 py-24 relative z-10">
        <motion.div {...fadeInUp} className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-emerald-500" />
            <h3 className="text-emerald-500 font-bold text-sm tracking-widest uppercase">Nearby Deals</h3>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Freshness hunting, made easy</h2>
          <p className="text-gray-400 font-medium text-lg max-w-2xl">Real-time listings from shops in your neighbourhood. Updated hourly to bring you the best local steals.</p>
        </motion.div>

        <motion.div {...fadeInUp} className="flex flex-wrap gap-3 mb-12 overflow-x-auto pb-2 scrollbar-hide">
          <button onClick={playPopSound} className="px-6 py-2.5 rounded-xl bg-white text-[#111111] font-bold shadow-[0_0_15px_rgba(255,255,255,0.2)] cursor-pointer">All</button>
          <button onClick={playPopSound} className="px-6 py-2.5 rounded-xl bg-[#242424] border border-white/5 text-gray-300 font-semibold hover:bg-white/10 hover:border-white/20 transition-all whitespace-nowrap cursor-pointer">Bakery</button>
          <button onClick={playPopSound} className="px-6 py-2.5 rounded-xl bg-[#242424] border border-white/5 text-gray-300 font-semibold hover:bg-white/10 hover:border-white/20 transition-all whitespace-nowrap cursor-pointer">Dairy</button>
          <button onClick={playPopSound} className="px-6 py-2.5 rounded-xl bg-[#242424] border border-white/5 text-gray-300 font-semibold hover:bg-white/10 hover:border-white/20 transition-all whitespace-nowrap cursor-pointer">Snacks</button>
          <button onClick={playPopSound} className="px-6 py-2.5 rounded-xl bg-[#242424] border border-white/5 text-gray-300 font-semibold hover:bg-white/10 hover:border-white/20 transition-all whitespace-nowrap cursor-pointer">Produce</button>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        >
          {/* Card 1 */}
          <motion.div variants={staggerItem} className="rounded-3xl border border-white/5 bg-[#1A1A1A] overflow-hidden flex flex-col group hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] hover:border-white/10 transition-all duration-500">
            <div className="bg-gradient-to-br from-[#FFDFB3] to-[#FFC980] h-56 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/5 transition-opacity duration-500" />
              <div className="absolute top-4 right-4 bg-[#FF4C4C] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                <Clock size={12} /> Expires today
              </div>
              <motion.span whileHover={{ scale: 1.15, rotate: 5 }} className="text-8xl drop-shadow-2xl">🍞</motion.span>
            </div>
            <div className="p-6 flex-1 flex flex-col relative">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FF4C4C] to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
              <div className="text-gray-400 text-xs font-black tracking-widest uppercase mb-2">Bakery</div>
              <h4 className="text-2xl font-bold mb-3 text-white group-hover:text-[#FFDFB3] transition-colors">Sourdough Bread</h4>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-gray-500 line-through text-sm font-medium">₹80</span>
                <span className="text-emerald-400 text-3xl font-black">₹28</span>
                <span className="bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold px-2.5 py-1 rounded-md ml-auto">65% off</span>
              </div>
              
              <div className="w-full bg-[#333] rounded-full h-2 mb-4 overflow-hidden border border-[#444]">
                <div className="bg-gradient-to-r from-red-500 to-red-400 h-full rounded-full relative" style={{ width: '85%' }}>
                   <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>
              
              <div className="text-sm text-gray-400 mb-6 font-medium">Expires in 6 hrs • ABC Bakery</div>
              
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center text-sm font-bold text-gray-300">
                  <MapPin size={16} className="mr-1.5 text-emerald-500" /> 0.4 km
                </div>
                <button onClick={handleReserve} className="bg-[#242424] border border-white/10 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] cursor-pointer">
                  Reserve
                </button>
              </div>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={staggerItem} className="rounded-3xl border border-white/5 bg-[#1A1A1A] overflow-hidden flex flex-col group hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] hover:border-white/10 transition-all duration-500">
            <div className="bg-gradient-to-br from-[#C2F0E0] to-[#8EE1C3] h-56 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/5 transition-opacity duration-500" />
              <div className="absolute top-4 right-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                2 days left
              </div>
              <motion.span whileHover={{ scale: 1.15, rotate: -5 }} className="text-8xl drop-shadow-2xl">🥛</motion.span>
            </div>
            <div className="p-6 flex-1 flex flex-col relative">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
              <div className="text-gray-400 text-xs font-black tracking-widest uppercase mb-2">Dairy</div>
              <h4 className="text-2xl font-bold mb-3 text-white group-hover:text-[#C2F0E0] transition-colors">Greek Yogurt 4-pack</h4>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-gray-500 line-through text-sm font-medium">₹160</span>
                <span className="text-emerald-400 text-3xl font-black">₹80</span>
                <span className="bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold px-2.5 py-1 rounded-md ml-auto">50% off</span>
              </div>
              
              <div className="w-full bg-[#333] rounded-full h-2 mb-4 overflow-hidden border border-[#444]">
                <div className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full" style={{ width: '45%' }}></div>
              </div>
              
              <div className="text-sm text-gray-400 mb-6 font-medium">Expires 25 May • FreshMart</div>
              
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center text-sm font-bold text-gray-300">
                  <MapPin size={16} className="mr-1.5 text-emerald-500" /> 1.2 km
                </div>
                <button onClick={handleReserve} className="bg-[#242424] border border-white/10 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] cursor-pointer">
                  Reserve
                </button>
              </div>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={staggerItem} className="rounded-3xl border border-white/5 bg-[#1A1A1A] overflow-hidden flex flex-col group hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] hover:border-white/10 transition-all duration-500">
            <div className="bg-gradient-to-br from-[#DFD8F9] to-[#C3B8F5] h-56 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/5 transition-opacity duration-500" />
              <div className="absolute top-4 right-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                3 days
              </div>
              <motion.span whileHover={{ scale: 1.15, rotate: 10 }} className="text-8xl drop-shadow-2xl">🍟</motion.span>
            </div>
            <div className="p-6 flex-1 flex flex-col relative">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
              <div className="text-gray-400 text-xs font-black tracking-widest uppercase mb-2">Snacks</div>
              <h4 className="text-2xl font-bold mb-3 text-white group-hover:text-[#DFD8F9] transition-colors">Chips Variety Box ×8</h4>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-gray-500 line-through text-sm font-medium">₹240</span>
                <span className="text-emerald-400 text-3xl font-black">₹120</span>
                <span className="bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold px-2.5 py-1 rounded-md ml-auto">50% off</span>
              </div>
              
              <div className="w-full bg-[#333] rounded-full h-2 mb-4 overflow-hidden border border-[#444]">
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-400 h-full rounded-full" style={{ width: '20%' }}></div>
              </div>
              
              <div className="text-sm text-gray-400 mb-6 font-medium">Expires 26 May • QuickStore</div>
              
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center text-sm font-bold text-gray-300">
                  <MapPin size={16} className="mr-1.5 text-emerald-500" /> 2.1 km
                </div>
                <button onClick={handleReserve} className="bg-[#242424] border border-white/10 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] cursor-pointer">
                  Reserve
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="h-px w-full max-w-7xl mx-auto bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Impact Section with Animated Counters */}
      <section className="max-w-5xl mx-auto px-4 py-24 relative z-10">
        <motion.div {...fadeInUp} className="mb-12 text-center md:text-left">
          <h3 className="text-emerald-500 font-bold text-sm tracking-widest uppercase mb-3">Our Impact</h3>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Every deal = less waste</h2>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div variants={staggerItem} className="bg-gradient-to-br from-[#EAFDF4] to-[#C9F2DC] rounded-[2.5rem] p-10 flex flex-col items-center text-center shadow-lg hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.2)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/40 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700" />
            <div className="text-5xl md:text-6xl font-black text-[#0D6B42] mb-4 drop-shadow-sm flex items-end justify-center">
              <AnimatedCounter value={6.2} decimals={1} />
              <span className="text-3xl ml-2 mb-1">tons</span>
            </div>
            <div className="text-[#15803D] font-bold text-lg max-w-[200px] leading-snug">food waste prevented this month</div>
          </motion.div>
          
          <motion.div variants={staggerItem} className="bg-gradient-to-br from-[#FFF4E6] to-[#FFE2BF] rounded-[2.5rem] p-10 flex flex-col items-center text-center shadow-lg hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.2)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/40 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700" />
            <div className="text-5xl md:text-6xl font-black text-[#9A621E] mb-4 drop-shadow-sm flex items-end justify-center">
              <AnimatedCounter value={18} prefix="₹" suffix="L+" />
            </div>
            <div className="text-[#B45309] font-bold text-lg max-w-[200px] leading-snug">saved by shoppers in Chennai</div>
          </motion.div>
          
          <motion.div variants={staggerItem} className="bg-gradient-to-br from-[#F0F2FF] to-[#D5DAF9] rounded-[2.5rem] p-10 flex flex-col items-center text-center shadow-lg hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.2)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/40 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700" />
            <div className="text-5xl md:text-6xl font-black text-[#4F46E5] mb-4 drop-shadow-sm flex items-end justify-center">
              <AnimatedCounter value={240} suffix="+" />
            </div>
            <div className="text-[#4338CA] font-bold text-lg max-w-[200px] leading-snug">local shops onboarded on platform</div>
          </motion.div>
        </motion.div>
      </section>

      {/* Why ExpiryGo Section */}
      <section className="max-w-5xl mx-auto px-4 py-24 pb-32 relative z-10">
        <motion.div {...fadeInUp} className="mb-14 text-center md:text-left">
          <h3 className="text-emerald-500 font-bold text-sm tracking-widest uppercase mb-3">Why ExpiryGo</h3>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Built for real people</h2>
          <p className="text-gray-400 font-medium text-lg">Not another food delivery app — a smart, local deal engine designed for sustainability.</p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {[
            { icon: MapPin, color: "text-emerald-500", bg: "bg-emerald-500/10", title: "Hyper-local discovery", desc: "See deals within walking distance, sorted by expiry urgency and discount." },
            { icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", title: "Expiry countdown rings", desc: "Visual urgency indicators show exactly how much time is left — no guesswork." },
            { icon: BarChart3, color: "text-indigo-500", bg: "bg-indigo-500/10", title: "Owner analytics", desc: "Revenue, waste saved, most viewed items — everything a shop owner needs." },
            { icon: Leaf, color: "text-emerald-500", bg: "bg-emerald-500/10", title: "Eco score & badges", desc: "Shops earn sustainability ratings. Customers see who&apos;s reducing waste most." },
            { icon: Bell, color: "text-amber-500", bg: "bg-amber-500/10", title: "Smart notifications", desc: "&quot;50% off near you&quot; — get alerted when your favourite category drops a deal." },
            { icon: ShieldCheck, color: "text-pink-500", bg: "bg-pink-500/10", title: "Verified shops only", desc: "Every listing is from a verified local business. Trust built in by default." }
          ].map((feature, i) => (
            <motion.div key={i} variants={staggerItem} className="bg-[#1A1A1A] border border-white/5 hover:border-white/20 p-8 rounded-[2rem] hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] transition-all duration-300 group cursor-default">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${feature.bg}`}>
                <feature.icon className={feature.color} size={28} />
              </div>
              <h4 className="font-bold text-xl mb-3 text-white">{feature.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Luxury Footer */}
      <footer className="bg-[#0A0A0A] border-t border-white/5 pt-20 pb-10 relative z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 rounded-[100%] blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-2 group mb-6 inline-block">
                <span className="text-2xl font-bold tracking-tight text-white">Expiry<span className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">Go</span></span>
              </Link>
              <p className="text-gray-400 text-sm font-medium leading-relaxed mb-8">
                Fighting food waste while saving you money. We connect communities with local shops to rescue near-expiry goods.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-emerald-500 hover:bg-emerald-500/10 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-300">
                  <MessageCircle size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-emerald-500 hover:bg-emerald-500/10 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-300">
                  <Camera size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-emerald-500 hover:bg-emerald-500/10 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-300">
                  <Briefcase size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-emerald-500 hover:bg-emerald-500/10 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-300">
                  <Code size={18} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Product</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm font-medium">Browse Deals</a></li>
                <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm font-medium">For Shop Owners</a></li>
                <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm font-medium">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm font-medium">Download App</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Company</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm font-medium">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm font-medium">Impact Report</a></li>
                <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm font-medium">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm font-medium">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Stay Updated</h4>
              <p className="text-gray-400 text-sm font-medium mb-4">Get the best deals delivered directly to your inbox.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 w-full text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
                <button className="bg-emerald-500 hover:bg-emerald-400 text-white p-3 rounded-xl transition-colors">
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-xs font-medium">
              &copy; {new Date().getFullYear()} ExpiryGo. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-500 hover:text-white transition-colors text-xs font-medium">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors text-xs font-medium">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors text-xs font-medium">Cookies Settings</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
