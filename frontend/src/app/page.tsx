"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  MapPin, 
  ArrowRight, 
  MoreHorizontal, 
  Clock, 
  BarChart3, 
  Leaf, 
  Bell, 
  ShieldCheck,
  Sparkles
} from "lucide-react";

export default function Home() {
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
    <div className="min-h-screen bg-[#141414] text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden relative">
      
      {/* Ambient Background Glows */}
      <div className="absolute top-0 inset-x-0 h-[120vh] overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-20 w-[40vw] h-[40vw] min-w-[500px] min-h-[500px] bg-emerald-500/30 rounded-full blur-[130px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[20%] -right-20 w-[45vw] h-[45vw] min-w-[600px] min-h-[600px] bg-amber-500/20 rounded-full blur-[150px]" 
        />
      </div>

      {/* Navbar */}
      <div className="pt-6 px-4 max-w-7xl mx-auto sticky top-0 z-50">
        <nav className="bg-[#242424]/70 backdrop-blur-2xl border border-white/10 rounded-2xl px-4 md:px-6 py-3 md:py-4 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-emerald-500 p-1.5 rounded-lg group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                <MapPin size={20} className="text-white fill-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">Expiry<span className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">Go</span></span>
            </Link>
            
            <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-300">
              <Link href="#" className="hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">For shoppers</Link>
              <Link href="#" className="hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">For shops</Link>
              <Link href="#" className="hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">How it works</Link>
              <Link href="#" className="hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all">Impact</Link>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Link href="/auth?tab=login" className="hidden md:block text-sm font-semibold text-white px-4 py-2 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/30 transition-all duration-300">
              Sign in
            </Link>
            <Link href="/auth?tab=register" className="text-sm font-bold text-[#141414] bg-white px-4 py-2 rounded-xl hover:bg-gray-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 transform hover:-translate-y-0.5">
              Get started
            </Link>
            <button className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg ml-1 hover:bg-white/10 transition-colors">
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
          className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.15)]"
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
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-20"
        >
          <Link href="/deals" className="w-full sm:w-auto flex justify-center items-center gap-2 px-8 py-4 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all duration-300 transform hover:-translate-y-1">
            <MapPin size={20} />
            Browse deals near me
          </Link>
          <Link href="/shop/setup" className="w-full sm:w-auto flex justify-center items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 hover:border-white/30 transition-all duration-300">
            List your shop <ArrowRight size={20} />
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-4xl bg-gradient-to-b from-[#262626] to-[#1A1A1A] border border-[#3A3A3A] rounded-3xl grid grid-cols-2 md:grid-cols-4 overflow-hidden shadow-2xl relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-amber-500/5 pointer-events-none" />
          
          <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-[#3A3A3A] flex flex-col items-center justify-center group">
            <div className="text-3xl md:text-4xl font-black text-emerald-400 mb-1 group-hover:scale-110 transition-transform duration-300">₹2.4L</div>
            <div className="text-xs md:text-sm text-gray-400 font-bold uppercase tracking-wider">saved this week</div>
          </div>
          <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-[#3A3A3A] flex flex-col items-center justify-center group">
            <div className="text-3xl md:text-4xl font-black text-emerald-400 mb-1 group-hover:scale-110 transition-transform duration-300">1,840</div>
            <div className="text-xs md:text-sm text-gray-400 font-bold uppercase tracking-wider">products rescued</div>
          </div>
          <div className="p-6 md:p-8 border-r border-[#3A3A3A] flex flex-col items-center justify-center group">
            <div className="text-3xl md:text-4xl font-black text-emerald-400 mb-1 group-hover:scale-110 transition-transform duration-300">92%</div>
            <div className="text-xs md:text-sm text-gray-400 font-bold uppercase tracking-wider">customer rating</div>
          </div>
          <div className="p-6 md:p-8 flex flex-col items-center justify-center group">
            <div className="text-3xl md:text-4xl font-black text-emerald-400 mb-1 group-hover:scale-110 transition-transform duration-300">0.8km</div>
            <div className="text-xs md:text-sm text-gray-400 font-bold uppercase tracking-wider">avg. deal distance</div>
          </div>
        </motion.div>
      </main>

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

        <motion.div {...fadeInUp} className="flex flex-wrap gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          <button className="px-6 py-2.5 rounded-xl bg-white text-[#141414] font-bold shadow-[0_0_15px_rgba(255,255,255,0.2)]">All</button>
          <button className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-semibold hover:bg-white/10 hover:border-white/30 transition-all whitespace-nowrap">Bakery</button>
          <button className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-semibold hover:bg-white/10 hover:border-white/30 transition-all whitespace-nowrap">Dairy</button>
          <button className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-semibold hover:bg-white/10 hover:border-white/30 transition-all whitespace-nowrap">Snacks</button>
          <button className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-semibold hover:bg-white/10 hover:border-white/30 transition-all whitespace-nowrap">Produce</button>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        >
          {/* Card 1 */}
          <motion.div variants={staggerItem} className="rounded-3xl border border-[#3A3A3A] bg-[#222] overflow-hidden flex flex-col group hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] hover:border-white/20 transition-all duration-500 cursor-pointer">
            <div className="bg-gradient-to-br from-[#FFDFB3] to-[#FFC980] h-48 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/5 transition-opacity duration-500" />
              <div className="absolute top-4 right-4 bg-[#FF4C4C] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                <Clock size={12} /> Expires today
              </div>
              <motion.span whileHover={{ scale: 1.1, rotate: 5 }} className="text-7xl drop-shadow-2xl">🍞</motion.span>
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
                <button className="bg-white/5 border border-white/10 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white text-gray-200 font-bold px-5 py-2 rounded-xl text-sm transition-all duration-300">
                  Reserve
                </button>
              </div>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={staggerItem} className="rounded-3xl border border-[#3A3A3A] bg-[#222] overflow-hidden flex flex-col group hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] hover:border-white/20 transition-all duration-500 cursor-pointer">
            <div className="bg-gradient-to-br from-[#C2F0E0] to-[#8EE1C3] h-48 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/5 transition-opacity duration-500" />
              <div className="absolute top-4 right-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                2 days left
              </div>
              <motion.span whileHover={{ scale: 1.1, rotate: -5 }} className="text-7xl drop-shadow-2xl">🥛</motion.span>
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
                <button className="bg-white/5 border border-white/10 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white text-gray-200 font-bold px-5 py-2 rounded-xl text-sm transition-all duration-300">
                  Reserve
                </button>
              </div>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={staggerItem} className="rounded-3xl border border-[#3A3A3A] bg-[#222] overflow-hidden flex flex-col group hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] hover:border-white/20 transition-all duration-500 cursor-pointer">
            <div className="bg-gradient-to-br from-[#DFD8F9] to-[#C3B8F5] h-48 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/5 transition-opacity duration-500" />
              <div className="absolute top-4 right-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                3 days
              </div>
              <motion.span whileHover={{ scale: 1.1, rotate: 10 }} className="text-7xl drop-shadow-2xl">🍟</motion.span>
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
                <button className="bg-white/5 border border-white/10 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white text-gray-200 font-bold px-5 py-2 rounded-xl text-sm transition-all duration-300">
                  Reserve
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <div className="h-px w-full max-w-7xl mx-auto bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Impact Section */}
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
          <motion.div variants={staggerItem} className="bg-gradient-to-br from-[#EAFDF4] to-[#C9F2DC] rounded-[2rem] p-10 flex flex-col items-center text-center shadow-lg hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.2)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/40 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700" />
            <div className="text-5xl md:text-6xl font-black text-[#0D6B42] mb-4 drop-shadow-sm">6.2 <span className="text-3xl">tons</span></div>
            <div className="text-[#15803D] font-bold text-lg max-w-[200px] leading-snug">food waste prevented this month</div>
          </motion.div>
          
          <motion.div variants={staggerItem} className="bg-gradient-to-br from-[#FFF4E6] to-[#FFE2BF] rounded-[2rem] p-10 flex flex-col items-center text-center shadow-lg hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.2)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/40 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700" />
            <div className="text-5xl md:text-6xl font-black text-[#9A621E] mb-4 drop-shadow-sm">₹18L+</div>
            <div className="text-[#B45309] font-bold text-lg max-w-[200px] leading-snug">saved by shoppers in Chennai</div>
          </motion.div>
          
          <motion.div variants={staggerItem} className="bg-gradient-to-br from-[#F0F2FF] to-[#D5DAF9] rounded-[2rem] p-10 flex flex-col items-center text-center shadow-lg hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.2)] hover:-translate-y-2 transition-all duration-500 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/40 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700" />
            <div className="text-5xl md:text-6xl font-black text-[#4F46E5] mb-4 drop-shadow-sm">240+</div>
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
            <motion.div key={i} variants={staggerItem} className="bg-[#1E1E1E] border border-[#333] hover:border-white/20 p-8 rounded-[2rem] hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] transition-all duration-300 group">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${feature.bg}`}>
                <feature.icon className={feature.color} size={28} />
              </div>
              <h4 className="font-bold text-xl mb-3 text-white">{feature.title}</h4>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
