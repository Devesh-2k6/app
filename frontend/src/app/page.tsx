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
  ShieldCheck 
} from "lucide-react";

export default function Home() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" }
  };

  return (
    <div className="min-h-screen bg-[#1C1C1C] text-white font-sans selection:bg-emerald-500/30">
      {/* Navbar */}
      <div className="pt-6 px-4 max-w-7xl mx-auto">
        <nav className="bg-[#242424] border border-white/10 rounded-2xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-emerald-500 p-1.5 rounded-lg">
                <MapPin size={20} className="text-white fill-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">Expiry<span className="text-emerald-500">Go</span></span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
              <Link href="#" className="hover:text-white transition-colors">For shoppers</Link>
              <Link href="#" className="hover:text-white transition-colors">For shops</Link>
              <Link href="#" className="hover:text-white transition-colors">How it works</Link>
              <Link href="#" className="hover:text-white transition-colors">Impact</Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth?tab=login" className="text-sm font-semibold text-white px-4 py-2 border border-white/20 rounded-xl hover:bg-white/5 transition-colors">
              Sign in
            </Link>
            <Link href="/auth?tab=register" className="text-sm font-semibold text-[#1C1C1C] bg-white px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors">
              Get started
            </Link>
            <button className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg ml-2">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-4 pt-24 pb-20 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-[#D1F4E0] text-emerald-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Live in Chennai • 240+ shops onboard
        </motion.div>

        <motion.h1 
          {...fadeInUp}
          className="text-6xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]"
        >
          Don&apos;t waste it.<br />
          <span className="text-emerald-500">Grab it</span> before it&apos;s <span className="text-amber-500">gone.</span>
        </motion.h1>

        <motion.p 
          {...fadeInUp}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-xl text-gray-400 max-w-2xl mb-10 font-medium"
        >
          Near-expiry products from local shops — at up to 70% off. Save money, fight food waste, shop smarter.
        </motion.p>

        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-16"
        >
          <Link href="/deals" className="flex items-center gap-2 px-6 py-3.5 bg-transparent border border-white/20 rounded-xl font-semibold hover:bg-white/5 transition-colors">
            <MapPin size={20} />
            Browse deals near me
          </Link>
          <Link href="/shop/setup" className="flex items-center gap-2 px-6 py-3.5 bg-transparent border border-white/20 rounded-xl font-semibold hover:bg-white/5 transition-colors">
            List your shop <ArrowRight size={20} />
          </Link>
        </motion.div>

        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full max-w-3xl bg-[#262626] border border-[#3A3A3A] rounded-2xl grid grid-cols-2 md:grid-cols-4 overflow-hidden"
        >
          <div className="p-6 border-b md:border-b-0 md:border-r border-[#3A3A3A] flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-emerald-500 mb-1">₹2.4L</div>
            <div className="text-xs text-gray-400 font-medium">saved this week</div>
          </div>
          <div className="p-6 border-b md:border-b-0 md:border-r border-[#3A3A3A] flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-emerald-500 mb-1">1,840</div>
            <div className="text-xs text-gray-400 font-medium">products rescued</div>
          </div>
          <div className="p-6 border-r border-[#3A3A3A] flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-emerald-500 mb-1">92%</div>
            <div className="text-xs text-gray-400 font-medium">customer rating</div>
          </div>
          <div className="p-6 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-emerald-500 mb-1">0.8km</div>
            <div className="text-xs text-gray-400 font-medium">avg. deal distance</div>
          </div>
        </motion.div>
      </main>

      <hr className="border-white/5" />

      {/* Nearby Deals Section */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-emerald-500 font-bold text-sm tracking-wider uppercase mb-3">Nearby Deals</h3>
          <h2 className="text-3xl font-bold mb-2">Freshness hunting, made easy</h2>
          <p className="text-gray-400 font-medium">Real-time listings from shops in your neighbourhood. Updated hourly.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-wrap gap-3 mb-8">
          <button className="px-5 py-2 rounded-lg bg-[#333] border border-white/10 font-medium">All</button>
          <button className="px-5 py-2 rounded-lg bg-transparent border border-white/20 text-gray-300 font-medium hover:bg-white/5 transition-colors">Bakery</button>
          <button className="px-5 py-2 rounded-lg bg-transparent border border-white/20 text-gray-300 font-medium hover:bg-white/5 transition-colors">Dairy</button>
          <button className="px-5 py-2 rounded-lg bg-transparent border border-white/20 text-gray-300 font-medium hover:bg-white/5 transition-colors">Snacks</button>
          <button className="px-5 py-2 rounded-lg bg-transparent border border-white/20 text-gray-300 font-medium hover:bg-white/5 transition-colors">Produce</button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="rounded-2xl border border-[#3A3A3A] overflow-hidden flex flex-col group hover:-translate-y-1 transition-transform"
          >
            <div className="bg-[#FFDFB3] h-40 relative flex items-center justify-center">
              <div className="absolute top-3 right-3 bg-[#FF4C4C] text-white text-xs font-bold px-3 py-1 rounded-full">
                Expires today
              </div>
              <span className="text-6xl drop-shadow-lg">🍞</span>
            </div>
            <div className="bg-[#2A2A2A] p-5 flex-1 flex flex-col">
              <div className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-1">Bakery</div>
              <h4 className="text-xl font-bold mb-2">Sourdough Bread</h4>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-500 line-through text-sm">₹80</span>
                <span className="text-emerald-400 text-2xl font-bold">₹28</span>
                <span className="bg-[#FFF3E0] text-[#E65100] text-xs font-bold px-2 py-0.5 rounded-md ml-1">65% off</span>
              </div>
              
              <div className="w-full bg-[#444] rounded-full h-1.5 mb-3 overflow-hidden">
                <div className="bg-[#FF4C4C] h-1.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
              
              <div className="text-xs text-gray-400 mb-4">Expires in 6 hrs • ABC Bakery</div>
              
              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="flex items-center text-sm text-gray-400">
                  <MapPin size={14} className="mr-1" /> 0.4 km
                </div>
                <button className="bg-transparent border border-white/30 hover:bg-white/10 text-white font-medium px-4 py-1.5 rounded-lg text-sm transition-colors">
                  Reserve
                </button>
              </div>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="rounded-2xl border border-[#3A3A3A] overflow-hidden flex flex-col group hover:-translate-y-1 transition-transform"
          >
            <div className="bg-[#C2F0E0] h-40 relative flex items-center justify-center">
              <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                2 days left
              </div>
              <span className="text-6xl drop-shadow-lg">🥛</span>
            </div>
            <div className="bg-[#2A2A2A] p-5 flex-1 flex flex-col">
              <div className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-1">Dairy</div>
              <h4 className="text-xl font-bold mb-2">Greek Yogurt 4-pack</h4>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-500 line-through text-sm">₹160</span>
                <span className="text-emerald-400 text-2xl font-bold">₹80</span>
                <span className="bg-[#FFF3E0] text-[#E65100] text-xs font-bold px-2 py-0.5 rounded-md ml-1">50% off</span>
              </div>
              
              <div className="w-full bg-[#444] rounded-full h-1.5 mb-3 overflow-hidden">
                <div className="bg-[#F59E0B] h-1.5 rounded-full" style={{ width: '45%' }}></div>
              </div>
              
              <div className="text-xs text-gray-400 mb-4">Expires 25 May • FreshMart</div>
              
              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="flex items-center text-sm text-gray-400">
                  <MapPin size={14} className="mr-1" /> 1.2 km
                </div>
                <button className="bg-transparent border border-white/30 hover:bg-white/10 text-white font-medium px-4 py-1.5 rounded-lg text-sm transition-colors">
                  Reserve
                </button>
              </div>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="rounded-2xl border border-[#3A3A3A] overflow-hidden flex flex-col group hover:-translate-y-1 transition-transform"
          >
            <div className="bg-[#DFD8F9] h-40 relative flex items-center justify-center">
              <div className="absolute top-3 right-3 bg-[#6366F1] text-white text-xs font-bold px-3 py-1 rounded-full">
                3 days
              </div>
              <span className="text-6xl drop-shadow-lg">🍟</span>
            </div>
            <div className="bg-[#2A2A2A] p-5 flex-1 flex flex-col">
              <div className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-1">Snacks</div>
              <h4 className="text-xl font-bold mb-2">Chips Variety Box ×8</h4>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-500 line-through text-sm">₹240</span>
                <span className="text-emerald-400 text-2xl font-bold">₹120</span>
                <span className="bg-[#FFF3E0] text-[#E65100] text-xs font-bold px-2 py-0.5 rounded-md ml-1">50% off</span>
              </div>
              
              <div className="w-full bg-[#444] rounded-full h-1.5 mb-3 overflow-hidden">
                <div className="bg-[#6366F1] h-1.5 rounded-full" style={{ width: '20%' }}></div>
              </div>
              
              <div className="text-xs text-gray-400 mb-4">Expires 26 May • QuickStore</div>
              
              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="flex items-center text-sm text-gray-400">
                  <MapPin size={14} className="mr-1" /> 2.1 km
                </div>
                <button className="bg-transparent border border-white/30 hover:bg-white/10 text-white font-medium px-4 py-1.5 rounded-lg text-sm transition-colors">
                  Reserve
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <hr className="border-white/5" />

      {/* Shop Owners Section */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-emerald-500 font-bold text-sm tracking-wider uppercase mb-3">For Shop Owners</h3>
          <h2 className="text-3xl font-bold mb-2">Your inventory, your revenue</h2>
          <p className="text-gray-400 font-medium">Turn expiring stock into income — in 2 minutes a day.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-2xl p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h3 className="text-2xl font-bold">ABC Bakery - Dashboard</h3>
              <p className="text-gray-400">Saturday, 23 May 2026</p>
            </div>
            <button className="flex items-center gap-2 border border-white/20 px-5 py-2.5 rounded-xl font-medium hover:bg-white/5 transition-colors">
              <span>+</span> Add product
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#222] rounded-xl p-5 border border-[#333]">
              <div className="text-gray-400 text-xs font-bold mb-2 uppercase">Revenue Today</div>
              <div className="text-3xl font-bold text-emerald-400 mb-1">₹4,820</div>
              <div className="text-emerald-500 text-xs font-medium">↑ 18% vs yesterday</div>
            </div>
            <div className="bg-[#222] rounded-xl p-5 border border-[#333]">
              <div className="text-gray-400 text-xs font-bold mb-2 uppercase">Active Listings</div>
              <div className="text-3xl font-bold mb-1">12</div>
              <div className="text-amber-500 text-xs font-medium">3 expiring today</div>
            </div>
            <div className="bg-[#222] rounded-xl p-5 border border-[#333]">
              <div className="text-gray-400 text-xs font-bold mb-2 uppercase">Items Rescued</div>
              <div className="text-3xl font-bold text-emerald-400 mb-1">148</div>
              <div className="text-emerald-500 text-xs font-medium">This month</div>
            </div>
            <div className="bg-[#222] rounded-xl p-5 border border-[#333]">
              <div className="text-gray-400 text-xs font-bold mb-2 uppercase">Waste Saved</div>
              <div className="text-3xl font-bold text-amber-500 mb-1">24 kg</div>
              <div className="text-gray-500 text-xs font-medium">CO₂ equiv: 48kg</div>
            </div>
          </div>

          <div className="bg-[#222] rounded-xl p-5 border border-[#333] mb-8">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Leaf size={16} className="text-emerald-500" />
                <span className="font-bold text-sm">Waste reduction score</span>
              </div>
              <div className="font-bold text-emerald-400 text-sm">68 / 100</div>
            </div>
            <div className="w-full bg-[#333] rounded-full h-2.5 mb-2 overflow-hidden">
              <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '68%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 font-medium">
              <span>Starter</span>
              <span>25 → Green badge</span>
              <span>50 → Featured</span>
              <span className="text-emerald-500">75 → Eco hero ★</span>
              <span>100</span>
            </div>
          </div>

          <div className="overflow-x-auto border border-[#333] rounded-xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#222] text-gray-400 text-xs uppercase border-b border-[#333]">
                <tr>
                  <th className="px-5 py-4 font-bold">Product</th>
                  <th className="px-5 py-4 font-bold">Price</th>
                  <th className="px-5 py-4 font-bold">Stock</th>
                  <th className="px-5 py-4 font-bold">Expiry</th>
                  <th className="px-5 py-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#333] bg-[#222]/50">
                <tr>
                  <td className="px-5 py-4 font-bold">Sourdough Bread</td>
                  <td className="px-5 py-4">
                    <span className="font-bold">₹28</span> <span className="text-gray-500 line-through text-xs">/ ₹80</span>
                  </td>
                  <td className="px-5 py-4 text-red-400 font-medium">2 left</td>
                  <td className="px-5 py-4 text-red-400 font-medium">Today</td>
                  <td className="px-5 py-4">
                    <span className="bg-[#FFF3E0] text-[#E65100] px-3 py-1 rounded-full text-xs font-bold">Expiring</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-5 py-4 font-bold">Croissants ×6</td>
                  <td className="px-5 py-4">
                    <span className="font-bold">₹60</span> <span className="text-gray-500 line-through text-xs">/ ₹120</span>
                  </td>
                  <td className="px-5 py-4 text-emerald-400 font-medium">8 left</td>
                  <td className="px-5 py-4 font-medium">25 May</td>
                  <td className="px-5 py-4">
                    <span className="bg-[#E6F8F0] text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">Active</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-5 py-4 font-bold">Butter Cake Slices</td>
                  <td className="px-5 py-4">
                    <span className="font-bold">₹45</span> <span className="text-gray-500 line-through text-xs">/ ₹90</span>
                  </td>
                  <td className="px-5 py-4 text-gray-500 font-medium">0</td>
                  <td className="px-5 py-4 text-gray-500 font-medium">24 May</td>
                  <td className="px-5 py-4">
                    <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">Sold out</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </section>

      <hr className="border-white/5" />

      {/* Impact Section */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-emerald-500 font-bold text-sm tracking-wider uppercase mb-3">Our Impact</h3>
          <h2 className="text-3xl font-bold mb-2">Every deal = less waste</h2>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-[#EAFDF4] rounded-2xl p-8 flex flex-col items-center text-center">
            <div className="text-4xl md:text-5xl font-bold text-[#0D6B42] mb-3">6.2 tons</div>
            <div className="text-[#3A8F6A] font-medium max-w-[180px]">food waste prevented this month</div>
          </div>
          <div className="bg-[#FFF4E6] rounded-2xl p-8 flex flex-col items-center text-center">
            <div className="text-4xl md:text-5xl font-bold text-[#9A621E] mb-3">₹18L+</div>
            <div className="text-[#C59B6A] font-medium max-w-[180px]">saved by shoppers in Chennai</div>
          </div>
          <div className="bg-[#F0F2FF] rounded-2xl p-8 flex flex-col items-center text-center">
            <div className="text-4xl md:text-5xl font-bold text-[#4F46E5] mb-3">240+</div>
            <div className="text-[#8481D8] font-medium max-w-[180px]">local shops onboarded</div>
          </div>
        </motion.div>
      </section>

      {/* Why ExpiryGo Section */}
      <section className="max-w-5xl mx-auto px-4 py-20 pb-32">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-emerald-500 font-bold text-sm tracking-wider uppercase mb-3">Why ExpiryGo</h3>
          <h2 className="text-3xl font-bold mb-2">Built for real people</h2>
          <p className="text-gray-400 font-medium">Not another food delivery app — a smart, local deal engine.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-[#262626] border border-[#3A3A3A] p-6 rounded-2xl">
            <div className="bg-white rounded-xl w-10 h-10 flex items-center justify-center mb-5">
              <MapPin className="text-emerald-500" size={20} />
            </div>
            <h4 className="font-bold text-lg mb-2">Hyper-local discovery</h4>
            <p className="text-gray-400 text-sm leading-relaxed font-medium">See deals within walking distance, sorted by expiry urgency and discount.</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-[#262626] border border-[#3A3A3A] p-6 rounded-2xl">
            <div className="bg-white rounded-xl w-10 h-10 flex items-center justify-center mb-5">
              <Clock className="text-amber-500" size={20} />
            </div>
            <h4 className="font-bold text-lg mb-2">Expiry countdown rings</h4>
            <p className="text-gray-400 text-sm leading-relaxed font-medium">Visual urgency indicators show exactly how much time is left — no guesswork.</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="bg-[#262626] border border-[#3A3A3A] p-6 rounded-2xl">
            <div className="bg-white rounded-xl w-10 h-10 flex items-center justify-center mb-5">
              <BarChart3 className="text-indigo-500" size={20} />
            </div>
            <h4 className="font-bold text-lg mb-2">Owner analytics</h4>
            <p className="text-gray-400 text-sm leading-relaxed font-medium">Revenue, waste saved, most viewed items — everything a shop owner needs.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="bg-[#262626] border border-[#3A3A3A] p-6 rounded-2xl">
            <div className="bg-white rounded-xl w-10 h-10 flex items-center justify-center mb-5">
              <Leaf className="text-emerald-500" size={20} />
            </div>
            <h4 className="font-bold text-lg mb-2">Eco score & badges</h4>
            <p className="text-gray-400 text-sm leading-relaxed font-medium">Shops earn sustainability ratings. Customers see who&apos;s reducing waste most.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }} className="bg-[#262626] border border-[#3A3A3A] p-6 rounded-2xl">
            <div className="bg-white rounded-xl w-10 h-10 flex items-center justify-center mb-5">
              <Bell className="text-amber-500" size={20} />
            </div>
            <h4 className="font-bold text-lg mb-2">Smart notifications</h4>
            <p className="text-gray-400 text-sm leading-relaxed font-medium">&quot;50% off near you&quot; — get alerted when your favourite category drops a deal.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }} className="bg-[#262626] border border-[#3A3A3A] p-6 rounded-2xl">
            <div className="bg-white rounded-xl w-10 h-10 flex items-center justify-center mb-5">
              <ShieldCheck className="text-pink-500" size={20} />
            </div>
            <h4 className="font-bold text-lg mb-2">Verified shops only</h4>
            <p className="text-gray-400 text-sm leading-relaxed font-medium">Every listing is from a verified local business. Trust built in by default.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
