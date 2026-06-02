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
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }
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
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
  };

  return (
    <div className="min-h-screen bg-[#F4FBF7] text-slate-900 font-sans selection:bg-emerald-500/30 overflow-x-hidden relative">
      <CustomCursor />
      
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-emerald-600 origin-left z-[99999] shadow-[0_0_10px_rgba(16,185,129,0.5)]"
        style={{ scaleX }}
      />

      {/* Ambient Parallax Background Glows */}
      <div className="absolute top-0 inset-x-0 h-[120vh] overflow-hidden pointer-events-none z-0">
        <motion.div 
          style={{ y: y1 }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.15, 0.08] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-20 w-[40vw] h-[40vw] min-w-[500px] min-h-[500px] bg-emerald-300/35 rounded-full blur-[130px]" 
        />
        <motion.div 
          style={{ y: y2 }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[20%] -right-20 w-[45vw] h-[45vw] min-w-[600px] min-h-[600px] bg-emerald-400/20 rounded-full blur-[150px]" 
        />
      </div>

      {/* Navbar */}
      <div className="pt-6 px-4 max-w-7xl mx-auto sticky top-0 z-50">
        <nav className="bg-white/80 backdrop-blur-3xl border border-emerald-100/50 rounded-2xl px-4 md:px-6 py-3 md:py-4 flex items-center justify-between shadow-[0_8px_30px_rgba(16,185,129,0.06)] transition-all duration-300">
          <div className="flex items-center gap-8">
            <MagneticButton>
              <Link href="/" onClick={playPopSound} className="flex items-center gap-2 group cursor-pointer">
                <div className="bg-emerald-600 p-1.5 rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <MapPin size={20} className="text-white fill-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900">Expiry<span className="text-emerald-600 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">Go</span></span>
              </Link>
            </MagneticButton>
            
            <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600">
              <Link href="#" onClick={playPopSound} className="hover:text-emerald-600 transition-all cursor-pointer">For shoppers</Link>
              <Link href="#" onClick={playPopSound} className="hover:text-emerald-600 transition-all cursor-pointer">For shops</Link>
              <Link href="#" onClick={playPopSound} className="hover:text-emerald-600 transition-all cursor-pointer">How it works</Link>
              <Link href="#" onClick={playPopSound} className="hover:text-emerald-600 transition-all cursor-pointer">Impact</Link>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <MagneticButton className="hidden md:block">
              <Link href="/auth?tab=login" onClick={playPopSound} className="text-sm font-semibold text-emerald-700 px-5 py-2.5 border border-emerald-200 rounded-xl hover:bg-emerald-50/50 hover:border-emerald-300 transition-all duration-300 cursor-pointer">
                Sign in
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link href="/auth?tab=signup" onClick={playPopSound} className="text-sm font-bold text-white bg-emerald-600 px-5 py-2.5 rounded-xl hover:bg-emerald-500 hover:shadow-[0_4px_12px_rgba(16,185,129,0.3)] transition-all duration-300 cursor-pointer">
                Get started
              </Link>
            </MagneticButton>
            <button onClick={playPopSound} className="p-2.5 text-slate-500 hover:text-emerald-600 bg-emerald-50/40 border border-emerald-100/30 rounded-xl ml-1 hover:bg-emerald-100/40 transition-colors cursor-pointer">
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
          className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-2 rounded-full text-xs md:text-sm font-semibold mb-8 backdrop-blur-md shadow-[0_4px_12px_rgba(16,185,129,0.06)]"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
          Live in Chennai • 240+ shops onboard
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter mb-6 leading-[1.05] text-slate-900"
        >
          Don&apos;t waste it.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-800 drop-shadow-sm">Grab it</span> before it&apos;s <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600 drop-shadow-sm">gone.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-lg md:text-xl text-slate-600 max-w-2xl mb-12 font-medium leading-relaxed"
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
            <Link href="/deals" onClick={playPopSound} className="w-full sm:w-auto flex justify-center items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-500 hover:shadow-[0_8px_24px_rgba(16,185,129,0.25)] transition-all duration-300 transform cursor-pointer text-lg">
              <MapPin size={22} />
              Browse deals near me
            </Link>
          </MagneticButton>
          <MagneticButton className="w-full sm:w-auto">
            <Link href="/shop/setup" onClick={playPopSound} className="w-full sm:w-auto flex justify-center items-center gap-2 px-8 py-4 bg-white border border-emerald-200 text-slate-800 rounded-2xl font-bold hover:bg-emerald-50/50 hover:border-emerald-300 transition-all duration-300 cursor-pointer text-lg shadow-sm">
              List your shop <ArrowRight size={22} />
            </Link>
          </MagneticButton>
        </motion.div>

        {/* Interactive Map */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-4xl h-[400px] md:h-[450px] relative rounded-3xl overflow-hidden shadow-xl shadow-emerald-950/5 border border-emerald-100/50"
        >
          <HeroMap />
        </motion.div>
      </main>

      {/* Divider */}
      <div className="h-px w-full max-w-7xl mx-auto bg-gradient-to-r from-transparent via-emerald-100 to-transparent" />

      {/* Nearby Deals Section */}
      <section className="max-w-5xl mx-auto px-4 py-24 relative z-10">
        <motion.div {...fadeInUp} className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-emerald-600" />
            <h3 className="text-emerald-600 font-bold text-sm tracking-widest uppercase">Nearby Deals</h3>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-slate-900">Freshness hunting, made easy</h2>
          <p className="text-slate-600 font-medium text-lg max-w-2xl">Real-time listings from shops in your neighbourhood. Updated hourly to bring you the best local steals.</p>
        </motion.div>

        <motion.div {...fadeInUp} className="flex flex-wrap gap-3 mb-12 overflow-x-auto pb-2 scrollbar-hide">
          <button onClick={playPopSound} className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950/10 cursor-pointer">All</button>
          <button onClick={playPopSound} className="px-6 py-2.5 rounded-xl bg-white border border-emerald-100 text-slate-700 font-semibold hover:bg-emerald-50/50 hover:border-emerald-200 transition-all whitespace-nowrap cursor-pointer">Bakery</button>
          <button onClick={playPopSound} className="px-6 py-2.5 rounded-xl bg-white border border-emerald-100 text-slate-700 font-semibold hover:bg-emerald-50/50 hover:border-emerald-200 transition-all whitespace-nowrap cursor-pointer">Dairy</button>
          <button onClick={playPopSound} className="px-6 py-2.5 rounded-xl bg-white border border-emerald-100 text-slate-700 font-semibold hover:bg-emerald-50/50 hover:border-emerald-200 transition-all whitespace-nowrap cursor-pointer">Snacks</button>
          <button onClick={playPopSound} className="px-6 py-2.5 rounded-xl bg-white border border-emerald-100 text-slate-700 font-semibold hover:bg-emerald-50/50 hover:border-emerald-200 transition-all whitespace-nowrap cursor-pointer">Produce</button>
        </motion.div>        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        >
          {/* Card 1 — Urgent + Selling Fast */}
          <motion.div variants={staggerItem} className="rounded-3xl border border-red-200 bg-white overflow-hidden flex flex-col group hover:-translate-y-1 hover:shadow-[0_15px_30px_-10px_rgba(239,68,68,0.12)] hover:border-red-400 transition-all duration-300 relative animate-border-glow-red shadow-sm">
            <div className="bg-gradient-to-br from-[#FFDFB3] to-[#FFC980] h-56 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/5 transition-opacity duration-500" />
              {/* Urgency badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7, x: -8 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.3 }}
                className="absolute top-4 left-4 flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold text-red-100 bg-red-500/90 backdrop-blur-md shadow-lg animate-urgency-pulse z-10"
              >
                <span>🔥</span> Selling Fast
              </motion.div>
              <div className="absolute top-4 right-4 bg-[#FF4C4C] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                <Clock size={12} /> Expires today
              </div>
              {/* Freshness dot */}
              <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-red-500 ring-2 ring-white animate-freshness-breath z-10" />
              <motion.span whileHover={{ scale: 1.15, rotate: 5 }} className="text-8xl drop-shadow-2xl">🍞</motion.span>
            </div>
            <div className="p-6 flex-1 flex flex-col relative">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FF4C4C] to-transparent opacity-50" />
              <div className="flex items-center gap-2 mb-2">
                <div className="text-slate-500 text-xs font-black tracking-widest uppercase">Bakery</div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full text-red-600 bg-red-50">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-freshness-breath" />
                  Urgent
                </span>
              </div>
              <h4 className="text-2xl font-bold mb-3 text-slate-900 group-hover:text-red-700 transition-colors">Sourdough Bread</h4>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-slate-400 line-through text-sm font-medium">₹80</span>
                <span className="text-red-600 text-3xl font-black">₹28</span>
                <span className="bg-emerald-500/15 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-md ml-auto animate-slide-in-right">65% off</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-red-600 bg-red-50 flex items-center gap-1">
                  <Clock size={10} /> Expires in 6 hours
                </span>
                <span className="text-[10px] font-bold text-red-600">Only 2 left!</span>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35, type: "spring", stiffness: 350, damping: 18 }}
                className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 w-max mb-4"
              >
                Save ₹52
              </motion.div>
              
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-emerald-100/40">
                <div className="flex items-center text-sm font-bold text-slate-600">
                  <MapPin size={16} className="mr-1.5 text-emerald-600" /> 0.4 km
                </div>
                <button onClick={handleReserve} className="bg-red-500 hover:bg-red-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all duration-300 hover:shadow-[0_4px_12px_rgba(239,68,68,0.2)] cursor-pointer">
                  Grab Now
                </button>
              </div>
            </div>
          </motion.div>

          {/* Card 2 — Near Expiry + Limited Stock */}
          <motion.div variants={staggerItem} className="rounded-3xl border border-orange-200 bg-white overflow-hidden flex flex-col group hover:-translate-y-1 hover:shadow-[0_15px_30px_-10px_rgba(249,115,22,0.1)] hover:border-orange-400 transition-all duration-300 relative animate-border-glow-orange shadow-sm">
            <div className="bg-gradient-to-br from-[#C2F0E0] to-[#8EE1C3] h-56 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/5 transition-opacity duration-500" />
              {/* Urgency badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7, x: -8 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.4 }}
                className="absolute top-4 left-4 flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold text-amber-200 bg-amber-500/80 backdrop-blur-md shadow-lg z-10"
              >
                <span>📦</span> Limited Stock
              </motion.div>
              <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                2 days left
              </div>
              {/* Freshness dot */}
              <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-orange-500 ring-2 ring-white z-10" />
              <motion.span whileHover={{ scale: 1.15, rotate: -5 }} className="text-8xl drop-shadow-2xl">🥛</motion.span>
            </div>
            <div className="p-6 flex-1 flex flex-col relative">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
              <div className="flex items-center gap-2 mb-2">
                <div className="text-slate-500 text-xs font-black tracking-widest uppercase">Dairy</div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full text-orange-600 bg-orange-50">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Near Expiry
                </span>
              </div>
              <h4 className="text-2xl font-bold mb-3 text-slate-900 group-hover:text-emerald-700 transition-colors">Greek Yogurt 4-pack</h4>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-slate-400 line-through text-sm font-medium">₹160</span>
                <span className="text-emerald-600 text-3xl font-black">₹80</span>
                <span className="bg-emerald-500/15 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-md ml-auto animate-slide-in-right">50% off</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-orange-600 bg-orange-50 flex items-center gap-1">
                  <Clock size={10} /> Expires in 2 days
                </span>
                <span className="text-[10px] font-bold text-amber-600">4 left</span>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, type: "spring", stiffness: 350, damping: 18 }}
                className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 w-max mb-4"
              >
                Save ₹80
              </motion.div>
              
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-emerald-100/40">
                <div className="flex items-center text-sm font-bold text-slate-600">
                  <MapPin size={16} className="mr-1.5 text-emerald-600" /> 1.2 km
                </div>
                <button onClick={handleReserve} className="bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-200 text-emerald-700 hover:border-emerald-600 font-bold px-5 py-2.5 rounded-xl text-sm transition-all duration-300 cursor-pointer">
                  Reserve
                </button>
              </div>
            </div>
          </motion.div>

          {/* Card 3 — Fresh + No urgency */}
          <motion.div variants={staggerItem} className="rounded-3xl border border-emerald-100 bg-white overflow-hidden flex flex-col group hover:-translate-y-1 hover:shadow-[0_15px_30px_-10px_rgba(16,185,129,0.08)] hover:border-emerald-300 transition-all duration-300 relative shadow-sm">
            <div className="bg-gradient-to-br from-[#DFD8F9] to-[#C3B8F5] h-56 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/5 transition-opacity duration-500" />
              <div className="absolute top-4 right-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                5 days left
              </div>
              {/* Freshness dot */}
              <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white z-10" />
              <motion.span whileHover={{ scale: 1.15, rotate: 10 }} className="text-8xl drop-shadow-2xl">🍟</motion.span>
            </div>
            <div className="p-6 flex-1 flex flex-col relative">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
              <div className="flex items-center gap-2 mb-2">
                <div className="text-slate-500 text-xs font-black tracking-widest uppercase">Snacks</div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full text-emerald-600 bg-emerald-50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Fresh
                </span>
              </div>
              <h4 className="text-2xl font-bold mb-3 text-slate-900 group-hover:text-indigo-700 transition-colors">Chips Variety Box ×8</h4>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-slate-400 line-through text-sm font-medium">₹240</span>
                <span className="text-emerald-600 text-3xl font-black">₹120</span>
                <span className="bg-emerald-500/15 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-md ml-auto animate-slide-in-right">50% off</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-emerald-600 bg-emerald-50 flex items-center gap-1">
                  <Clock size={10} /> Expires in 5 days
                </span>
                <span className="text-[10px] font-semibold text-slate-500">12 left</span>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.45, type: "spring", stiffness: 350, damping: 18 }}
                className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 w-max mb-4"
              >
                Save ₹120
              </motion.div>
              
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-emerald-100/40">
                <div className="flex items-center text-sm font-bold text-slate-600">
                  <MapPin size={16} className="mr-1.5 text-emerald-600" /> 2.1 km
                </div>
                <button onClick={handleReserve} className="bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-200 text-emerald-700 hover:border-emerald-600 font-bold px-5 py-2.5 rounded-xl text-sm transition-all duration-300 cursor-pointer">
                  Reserve
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="h-px w-full max-w-7xl mx-auto bg-gradient-to-r from-transparent via-emerald-100 to-transparent" />

      {/* Impact Section with Animated Counters */}
      <section className="max-w-5xl mx-auto px-4 py-24 relative z-10">
        <motion.div {...fadeInUp} className="mb-12 text-center md:text-left">
          <h3 className="text-emerald-600 font-bold text-sm tracking-widest uppercase mb-3">Our Impact</h3>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-slate-900">Every deal = less waste</h2>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <motion.div variants={staggerItem} className="bg-gradient-to-br from-[#EAFDF4] to-[#C9F2DC] rounded-[2.5rem] p-8 flex flex-col items-center text-center shadow-lg shadow-emerald-950/5 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/40 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700" />
            <div className="text-5xl md:text-6xl font-black text-[#0D6B42] mb-4 drop-shadow-sm flex items-end justify-center">
              <AnimatedCounter value={6.2} decimals={1} />
              <span className="text-2xl ml-1 mb-1">tons</span>
            </div>
            <div className="text-[#15803D] font-bold text-base max-w-[200px] leading-snug">food waste prevented this month</div>
          </motion.div>

          <motion.div variants={staggerItem} className="bg-gradient-to-br from-[#E6FCF5] to-[#BFEFE0] rounded-[2.5rem] p-8 flex flex-col items-center text-center shadow-lg shadow-emerald-950/5 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/40 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700" />
            <div className="text-5xl md:text-6xl font-black text-[#0D6B5A] mb-4 drop-shadow-sm flex items-end justify-center">
              <AnimatedCounter value={15.5} decimals={1} />
              <span className="text-2xl ml-1 mb-1">tons</span>
            </div>
            <div className="text-[#0F766E] font-bold text-base max-w-[200px] leading-snug">CO₂ emissions saved (2.5x ratio)</div>
          </motion.div>
          
          <motion.div variants={staggerItem} className="bg-gradient-to-br from-[#FFF4E6] to-[#FFE2BF] rounded-[2.5rem] p-8 flex flex-col items-center text-center shadow-lg shadow-emerald-950/5 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/40 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700" />
            <div className="text-5xl md:text-6xl font-black text-[#9A621E] mb-4 drop-shadow-sm flex items-end justify-center">
              <AnimatedCounter value={18} prefix="₹" suffix="L+" />
            </div>
            <div className="text-[#B45309] font-bold text-base max-w-[200px] leading-snug">saved by shoppers in Chennai</div>
          </motion.div>
          
          <motion.div variants={staggerItem} className="bg-gradient-to-br from-[#F0F2FF] to-[#D5DAF9] rounded-[2.5rem] p-8 flex flex-col items-center text-center shadow-lg shadow-emerald-950/5 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/40 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700" />
            <div className="text-5xl md:text-6xl font-black text-[#4F46E5] mb-4 drop-shadow-sm flex items-end justify-center">
              <AnimatedCounter value={240} suffix="+" />
            </div>
            <div className="text-[#4338CA] font-bold text-base max-w-[200px] leading-snug">local shops onboarded on platform</div>
          </motion.div>
        </motion.div>
      </section>

      {/* Why ExpiryGo Section */}
      <section className="max-w-5xl mx-auto px-4 py-24 pb-32 relative z-10">
        <motion.div {...fadeInUp} className="mb-14 text-center md:text-left">
          <h3 className="text-emerald-600 font-bold text-sm tracking-widest uppercase mb-3">Why ExpiryGo</h3>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-slate-900">Built for real people</h2>
          <p className="text-slate-600 font-medium text-lg">Not another food delivery app — a smart, local deal engine designed for sustainability.</p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {[
            { icon: MapPin, color: "text-emerald-600", bg: "bg-emerald-50", title: "Hyper-local discovery", desc: "See deals within walking distance, sorted by expiry urgency and discount." },
            { icon: Clock, color: "text-amber-600", bg: "bg-amber-50", title: "Expiry countdown rings", desc: "Visual urgency indicators show exactly how much time is left — no guesswork." },
            { icon: BarChart3, color: "text-indigo-600", bg: "bg-indigo-50", title: "Owner analytics", desc: "Revenue, waste saved, most viewed items — everything a shop owner needs." },
            { icon: Leaf, color: "text-emerald-600", bg: "bg-emerald-50", title: "Eco score & badges", desc: "Shops earn sustainability ratings. Customers see who&apos;s reducing waste most." },
            { icon: Bell, color: "text-amber-600", bg: "bg-amber-50", title: "Smart notifications", desc: "&quot;50% off near you&quot; — get alerted when your favourite category drops a deal." },
            { icon: ShieldCheck, color: "text-pink-600", bg: "bg-pink-50", title: "Verified shops only", desc: "Every listing is from a verified local business. Trust built in by default." }
          ].map((feature, i) => (
            <motion.div key={i} variants={staggerItem} className="bg-white border border-emerald-100/60 p-8 rounded-[2.5rem] hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-950/5 hover:border-emerald-300 transition-all duration-300 group cursor-default shadow-sm">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${feature.bg}`}>
                <feature.icon className={feature.color} size={28} />
              </div>
              <h4 className="font-bold text-xl mb-3 text-slate-900">{feature.title}</h4>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Luxury Footer */}
      <footer className="bg-emerald-50/50 border-t border-emerald-100/50 pt-20 pb-10 relative z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-200/10 rounded-[100%] blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-2 group mb-6 inline-block">
                <span className="text-2xl font-bold tracking-tight text-slate-900">Expiry<span className="text-emerald-600 drop-shadow-[0_0_8px_rgba(16,185,129,0.2)]">Go</span></span>
              </Link>
              <p className="text-slate-600 text-sm font-medium leading-relaxed mb-8">
                Fighting food waste while saving you money. We connect communities with local shops to rescue near-expiry goods.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white border border-emerald-200 flex items-center justify-center text-emerald-800 hover:text-white hover:border-emerald-600 hover:bg-emerald-600 hover:shadow-md hover:shadow-emerald-950/10 transition-all duration-300">
                  <MessageCircle size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white border border-emerald-200 flex items-center justify-center text-emerald-800 hover:text-white hover:border-emerald-600 hover:bg-emerald-600 hover:shadow-md hover:shadow-emerald-950/10 transition-all duration-300">
                  <Camera size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white border border-emerald-200 flex items-center justify-center text-emerald-800 hover:text-white hover:border-emerald-600 hover:bg-emerald-600 hover:shadow-md hover:shadow-emerald-950/10 transition-all duration-300">
                  <Briefcase size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white border border-emerald-200 flex items-center justify-center text-emerald-800 hover:text-white hover:border-emerald-600 hover:bg-emerald-600 hover:shadow-md hover:shadow-emerald-950/10 transition-all duration-300">
                  <Code size={18} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-slate-900 font-bold mb-6">Product</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-600 hover:text-emerald-600 transition-colors text-sm font-medium">Browse Deals</a></li>
                <li><a href="#" className="text-slate-600 hover:text-emerald-600 transition-colors text-sm font-medium">For Shop Owners</a></li>
                <li><a href="#" className="text-slate-600 hover:text-emerald-600 transition-colors text-sm font-medium">Pricing</a></li>
                <li><a href="#" className="text-slate-600 hover:text-emerald-600 transition-colors text-sm font-medium">Download App</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-900 font-bold mb-6">Company</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-600 hover:text-emerald-600 transition-colors text-sm font-medium">About Us</a></li>
                <li><a href="#" className="text-slate-600 hover:text-emerald-600 transition-colors text-sm font-medium">Impact Report</a></li>
                <li><a href="#" className="text-slate-600 hover:text-emerald-600 transition-colors text-sm font-medium">Careers</a></li>
                <li><a href="#" className="text-slate-600 hover:text-emerald-600 transition-colors text-sm font-medium">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-900 font-bold mb-6">Stay Updated</h4>
              <p className="text-slate-600 text-sm font-medium mb-4">Get the best deals delivered directly to your inbox.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-white border border-emerald-200 rounded-xl px-4 py-3 w-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all shadow-sm"
                />
                <button className="bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-xl transition-colors shadow-sm cursor-pointer">
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-emerald-100/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-xs font-medium">
              &copy; {new Date().getFullYear()} ExpiryGo. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-500 hover:text-emerald-600 transition-colors text-xs font-medium">Privacy Policy</a>
              <a href="#" className="text-slate-500 hover:text-emerald-600 transition-colors text-xs font-medium">Terms of Service</a>
              <a href="#" className="text-slate-500 hover:text-emerald-600 transition-colors text-xs font-medium">Cookies Settings</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
