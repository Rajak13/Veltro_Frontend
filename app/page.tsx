"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Cog, Bell, Car, PackageCheck, Calendar, Brain,
  Search, CalendarCheck, History, Gift, PackagePlus,
  ArrowRight, PlayCircle, Check, Star, ShoppingCart,
  Disc, Filter, Zap, Battery,
} from "lucide-react";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

export default function HomePage() {
  return (
    <main
      className="min-h-screen bg-[#fafafa] text-[#18181b] overflow-x-hidden"
      style={{ fontFamily: "var(--font-inter, 'Inter', sans-serif)" }}
    >
      {/* Dot grid */}
      <div className="fixed inset-0 pointer-events-none dot-grid" style={{ zIndex: -10 }} />
      {/* Orange glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
        style={{
          zIndex: -5,
          background: "radial-gradient(ellipse, rgba(249,115,22,0.06) 0%, transparent 65%)",
          filter: "blur(50px)",
        }}
      />

      {/* ════════════════════════════════════════
          NAV
      ════════════════════════════════════════ */}
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 w-[94%] max-w-2xl" style={{ zIndex: 50 }}>
        <div className="bg-white/80 backdrop-blur-xl border border-zinc-200/70 rounded-full py-2 px-2 flex items-center justify-between shadow-sm">
          <a href="#" className="flex items-center gap-2.5 pl-4">
            <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center">
              <Cog className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-zinc-900 tracking-tight">Veltro</span>
          </a>
          <div className="hidden md:flex items-center gap-1">
            {[
              ["Features", "#features"],
              ["How It Works", "#how"],
              ["App Preview", "#app"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="text-xs font-medium text-zinc-500 hover:text-orange-600 transition-colors px-3 py-1.5 rounded-full hover:bg-orange-50"
              >
                {label}
              </a>
            ))}
          </div>
          <Link href="/register" className="btn-shine bg-zinc-900 text-white text-xs font-semibold px-5 py-2 rounded-full hover:scale-105 active:scale-95 transition-transform">
            Get Started
          </Link>
        </div>
      </nav>

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section className="relative pt-44 pb-32" style={{ zIndex: 10 }}>
        <div className="max-w-7xl mx-auto px-6">

          {/* Headline + CTA */}
          <motion.div {...fadeUp()} className="max-w-3xl mx-auto text-center mb-20">
            <h1 className="text-6xl md:text-7xl font-semibold tracking-tighter leading-tight text-zinc-900 mb-6">
              Your Vehicle.<br />One App.
            </h1>
            <p className="text-xl font-light text-zinc-500 leading-relaxed max-w-xl mx-auto mb-10">
              Browse parts, book services, and get AI-powered health predictions for your car — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/register" className="btn-shine bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-8 py-4 rounded-full transition-colors hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg shadow-orange-500/20">
                <ArrowRight className="w-4 h-4" />
                Get Started — It&apos;s Free
              </Link>
              <button className="flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-zinc-900 px-8 py-4 rounded-full border border-zinc-200 hover:border-zinc-300 bg-white transition-colors">
                <PlayCircle className="w-4 h-4 text-orange-500" />
                See How It Works
              </button>
            </div>
          </motion.div>

          {/* Dashboard mockup */}
          <motion.div {...fadeUp(0.15)} className="relative max-w-4xl mx-auto">
            <div className="relative bg-white rounded-2xl border border-zinc-200 shadow-2xl overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100 bg-zinc-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="text-xs text-zinc-400 font-medium">veltro.app/dashboard</div>
                <div />
              </div>

              <div className="p-8 md:p-10">
                {/* Welcome row */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="text-sm text-zinc-400 mb-1">Welcome back,</div>
                    <div className="text-2xl font-semibold text-zinc-900">Rajesh Kumar</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-zinc-200 border-2 border-zinc-100 flex items-center justify-center text-sm font-bold text-zinc-500">
                      RK
                    </div>
                  </div>
                </div>

                {/* Vehicle card */}
                <div className="flex items-center gap-5 p-5 rounded-2xl bg-zinc-50 border border-zinc-100 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0">
                    <Car className="w-8 h-8 text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-semibold text-zinc-800">Honda Civic 2022</div>
                    <div className="text-sm text-zinc-400 mt-0.5">BA 123 PA · 34,500 km</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm text-zinc-400 mb-1">Health Score</div>
                    <div className="text-3xl font-bold text-green-600">
                      87<span className="text-sm text-zinc-400 font-normal">/100</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-2xl bg-white border border-zinc-100 text-center">
                    <div className="text-2xl font-bold text-zinc-900">4</div>
                    <div className="text-xs text-zinc-400 mt-1">Parts Ordered</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-zinc-100 text-center">
                    <div className="text-2xl font-bold text-zinc-900">2</div>
                    <div className="text-xs text-zinc-400 mt-1">Services Done</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 text-center">
                    <div className="text-2xl font-bold text-orange-600">Rs. 420</div>
                    <div className="text-xs text-orange-500/70 mt-1">Saved (Loyalty)</div>
                  </div>
                </div>

                {/* AI alert */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-50 border border-amber-100">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Brain className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-amber-800">AI Prediction</div>
                    <div className="text-sm text-amber-700/80 mt-0.5">Brake pads may need replacement in ~3,000 km</div>
                  </div>
                </div>
              </div>

              {/* Bottom fade */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#fafafa] to-transparent" />
            </div>

            {/* Floating card: parts */}
            <div className="absolute -right-4 top-24 float hidden md:block" style={{ zIndex: 20 }}>
              <div className="bg-white border border-zinc-200 rounded-2xl px-5 py-4 shadow-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center">
                  <PackageCheck className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-zinc-800">1,247 Parts</div>
                  <div className="text-xs text-zinc-400">Available for your car</div>
                </div>
              </div>
            </div>

            {/* Floating card: service */}
            <div className="absolute -left-4 bottom-24 float-slow hidden md:block" style={{ zIndex: 20 }}>
              <div className="bg-white border border-zinc-200 rounded-2xl px-5 py-4 shadow-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-zinc-800">Next Service</div>
                  <div className="text-xs text-zinc-400">Jan 15, 2026 — Oil Change</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FEATURES
      ════════════════════════════════════════ */}
      <section id="features" className="relative py-32" style={{ zIndex: 10 }}>
        <div className="max-w-5xl mx-auto px-6">
          <motion.div {...fadeUp()} className="max-w-xl mb-16">
            <div className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-4">Features</div>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900 mb-4">
              Everything for your vehicle, in one place.
            </h2>
            <p className="text-lg font-light text-zinc-500 leading-relaxed">
              No more juggling between service centers, part shops, and spreadsheets.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            {[
              { n: "01", Icon: Search,        title: "Browse & Buy Parts",              desc: "Search from 1,200+ parts filtered by your vehicle's make, model, and year. Check stock, compare prices, and order online." },
              { n: "02", Icon: CalendarCheck, title: "Book Service Appointments",       desc: "Pick a date, time, and service type. Get confirmation instantly and track your appointment status in real-time." },
              { n: "03", Icon: Brain,         title: "AI Health Predictions",           desc: "Our AI analyzes your vehicle's condition and usage to predict part failures before they happen — so you're never caught off guard." },
              { n: "04", Icon: History,       title: "Full Service & Purchase History", desc: "Every part you bought, every service you did — organized in a clear timeline. Great for resale value and warranty claims." },
              { n: "05", Icon: Gift,          title: "Loyalty Discounts",               desc: "Spend over Rs. 5,000 in a single purchase and automatically get 10% off. Your savings are tracked right in the app." },
              { n: "06", Icon: PackagePlus,   title: "Request Unavailable Parts",       desc: "Can't find what you need? Submit a request and we'll source it for you. You'll be notified as soon as it's in stock." },
            ].map(({ n, Icon, title, desc }, i) => (
              <motion.div
                key={n}
                {...fadeUp(i * 0.07)}
                className="feature-item py-8 border-b border-zinc-100 rounded-lg px-4"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="feat-num text-sm font-bold text-zinc-300 transition-colors">{n}</span>
                  <div className="feat-line w-6 h-px bg-zinc-200 transition-all" />
                  <Icon className="w-4 h-4 text-zinc-400" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 mb-2">{title}</h3>
                <p className="text-base font-light text-zinc-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════ */}
      <section id="how" className="relative py-32" style={{ zIndex: 10 }}>
        <div className="max-w-5xl mx-auto px-6">
          <motion.div {...fadeUp()} className="text-center mb-20">
            <div className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-4">How It Works</div>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900">
              Five steps. That&apos;s it.
            </h2>
          </motion.div>

          <div className="relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-5 left-[10%] right-[10%] h-px bg-zinc-200" />
            <div className="grid grid-cols-2 md:grid-cols-5 gap-y-12 gap-x-4">
              {[
                { n: "1", title: "Sign Up",          desc: "Create your account in under a minute" },
                { n: "2", title: "Add Your Vehicle", desc: "Enter make, model, year, and reg number" },
                { n: "3", title: "Browse or Book",   desc: "Find parts or schedule a service visit" },
                { n: "4", title: "Get AI Insights",  desc: "Receive predictions about your car's health" },
                { n: "5", title: "Save & Track",     desc: "Earn loyalty rewards and view full history" },
              ].map(({ n, title, desc }, i) => (
                <motion.div
                  key={n}
                  {...fadeUp(i * 0.1)}
                  className={`step-item text-center px-2${n === "5" ? " col-span-2 md:col-span-1" : ""}`}
                >
                  <div className="step-circle w-10 h-10 rounded-full border-2 border-zinc-200 bg-white flex items-center justify-center mx-auto mb-5 text-sm font-bold text-zinc-400 transition-all relative" style={{ zIndex: 10 }}>
                    {n}
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-900 mb-2">{title}</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          APP PREVIEW — Parts Catalog
      ════════════════════════════════════════ */}
      <section id="app" className="relative py-32" style={{ zIndex: 10 }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

            {/* Phone mockup */}
            <div className="flex justify-center">
              <div className="phone w-80 h-[600px] p-2.5 relative float">
                <div className="phone-notch" />
                <div className="w-full h-full rounded-[1.4rem] overflow-hidden bg-zinc-50 relative">
                  <div className="p-5 pt-10 h-full relative">
                    {/* Search */}
                    <div className="flex items-center gap-2 h-10 rounded-xl bg-white border border-zinc-200 px-3 mb-5">
                      <Search className="w-4 h-4 text-zinc-400" />
                      <span className="text-xs text-zinc-400">Search brake pads, filters...</span>
                    </div>
                    {/* Pills */}
                    <div className="flex gap-2 mb-5 overflow-hidden">
                      {["All", "Engine", "Brakes", "Electrical"].map((c, i) => (
                        <span
                          key={c}
                          className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                            i === 0 ? "bg-orange-500 text-white" : "bg-white border border-zinc-200 text-zinc-500"
                          }`}
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-zinc-400 font-medium mb-3">Popular for Honda Civic 2022</div>
                    {/* Parts list */}
                    <div className="space-y-2.5">
                      {[
                        { Icon: Disc,    name: "Brake Pad Set — Front", sub: "OEM Quality · In Stock", price: "Rs. 3,200", stock: "234 left", sc: "text-green-600" },
                        { Icon: Filter,  name: "Oil Filter — Genuine",  sub: "Honda OEM · Low Stock",  price: "Rs. 850",   stock: "8 left",   sc: "text-red-500" },
                        { Icon: Zap,     name: "Spark Plug — Iridium",  sub: "NGK · In Stock",         price: "Rs. 1,400", stock: "156 left", sc: "text-green-600" },
                        { Icon: Battery, name: "Battery 12V — 55Ah",    sub: "Amaron · In Stock",      price: "Rs. 6,500", stock: "42 left",  sc: "text-green-600" },
                      ].map(({ Icon, name, sub, price, stock, sc }) => (
                        <div key={name} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-zinc-100">
                          <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-zinc-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-zinc-800">{name}</div>
                            <div className="text-xs text-zinc-400 mt-0.5">{sub}</div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-xs font-bold text-zinc-900">{price}</div>
                            <div className={`text-xs font-medium mt-0.5 ${sc}`}>{stock}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Cart bar */}
                    <div className="absolute bottom-4 left-4 right-4 bg-orange-500 rounded-2xl p-3 flex items-center justify-between shadow-lg shadow-orange-500/20">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                          <ShoppingCart className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-xs font-semibold text-white">2 items</span>
                      </div>
                      <span className="text-xs font-bold text-white">Rs. 4,050 →</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <motion.div {...fadeUp(0.1)}>
              <div className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-4">Parts Catalog</div>
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900 mb-5">
                Find the right part, every time.
              </h2>
              <p className="text-lg font-light text-zinc-500 leading-relaxed mb-10">
                Every part in our catalog is matched to your specific vehicle. No guesswork, no wrong orders. See real-time stock levels, compare prices, and add to cart — or request parts we don&apos;t have yet.
              </p>
              <div className="space-y-5">
                {[
                  { title: "Filtered by your vehicle",  desc: "Only see parts compatible with your make and model" },
                  { title: "Live stock status",          desc: "See exactly how many units are available right now" },
                  { title: "Can't find it? Request it", desc: "We'll source unavailable parts and notify you" },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <div className="text-base font-medium text-zinc-800">{title}</div>
                      <div className="text-sm text-zinc-400 mt-0.5">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          APP PREVIEW — AI Predictions
      ════════════════════════════════════════ */}
      <section className="relative py-32" style={{ zIndex: 10 }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

            {/* Content */}
            <motion.div {...fadeUp()} className="order-2 lg:order-1">
              <div className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-4">AI Predictions</div>
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900 mb-5">
                Know what&apos;s coming, before it breaks.
              </h2>
              <p className="text-lg font-light text-zinc-500 leading-relaxed mb-10">
                Veltro&apos;s AI learns your driving patterns and vehicle condition to predict when parts might fail. You get early warnings with severity levels, so you can act on your schedule — not your car&apos;s.
              </p>
              <div className="space-y-5">
                {[
                  { title: "Usage-based analysis",      desc: "Predictions improve as the system learns your driving habits" },
                  { title: "Severity levels",           desc: "Low, medium, high — know what's urgent and what can wait" },
                  { title: "Book directly from alerts", desc: "See a warning? Tap to book a service appointment instantly" },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <div className="text-base font-medium text-zinc-800">{title}</div>
                      <div className="text-sm text-zinc-400 mt-0.5">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Phone mockup */}
            <div className="flex justify-center order-1 lg:order-2">
              <div className="phone w-80 h-[600px] p-2.5 relative float-slow">
                <div className="phone-notch" />
                <div className="w-full h-full rounded-[1.4rem] overflow-hidden bg-zinc-50">
                  <div className="p-5 pt-10">
                    <div className="text-xs text-zinc-400 font-medium mb-1">AI Health Analysis</div>
                    <div className="text-base font-semibold text-zinc-900 mb-6">Honda Civic 2022</div>

                    {/* Health ring */}
                    <div className="flex justify-center mb-6">
                      <div className="relative w-32 h-32">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="42" stroke="#f4f4f5" strokeWidth="8" fill="none" />
                          <circle
                            cx="50" cy="50" r="42"
                            stroke="#f97316" strokeWidth="8" fill="none"
                            strokeLinecap="round" strokeDasharray="230" strokeDashoffset="30"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-bold text-zinc-900">87</span>
                          <span className="text-xs text-zinc-400">/ 100</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-zinc-400 font-medium mb-3">Predicted Issues</div>
                    <div className="space-y-2.5">
                      {/* High */}
                      <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <span className="text-xs font-semibold text-red-700">High Priority</span>
                          </div>
                          <span className="text-xs text-red-500 font-medium">~3,000 km</span>
                        </div>
                        <div className="text-xs text-zinc-700 font-medium">Brake Pads — Front</div>
                        <div className="text-xs text-zinc-500 mt-0.5">Wear level at 15%. Replacement recommended soon.</div>
                      </div>
                      {/* Medium */}
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-amber-500" />
                            <span className="text-xs font-semibold text-amber-700">Medium</span>
                          </div>
                          <span className="text-xs text-amber-600 font-medium">~8,000 km</span>
                        </div>
                        <div className="text-xs text-zinc-700 font-medium">Engine Air Filter</div>
                        <div className="text-xs text-zinc-500 mt-0.5">Approaching end of service life.</div>
                      </div>
                      {/* Low */}
                      <div className="p-3 rounded-xl bg-green-50 border border-green-100">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-xs font-semibold text-green-700">Low</span>
                          </div>
                          <span className="text-xs text-green-600 font-medium">~15,000 km</span>
                        </div>
                        <div className="text-xs text-zinc-700 font-medium">Coolant Flush</div>
                        <div className="text-xs text-zinc-500 mt-0.5">Monitor over next few months.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          LOYALTY BANNER
      ════════════════════════════════════════ */}
      <section className="relative py-24" style={{ zIndex: 10 }}>
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            {...fadeUp()}
            className="bg-orange-500 rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full border-[20px] border-white/10" />
            <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full border-[16px] border-white/10" />

            <div className="flex-1 relative text-center md:text-left" style={{ zIndex: 10 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 mb-4">
                <Gift className="w-3.5 h-3.5 text-white" />
                <span className="text-xs font-semibold text-white">Loyalty Program</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-semibold text-white mb-3">
                Spend Rs. 5,000+, get 10% off.
              </h3>
              <p className="text-base text-white/80 leading-relaxed max-w-md">
                No codes, no coupons. The discount applies automatically at checkout when your cart crosses Rs. 5,000. Track all your savings in your profile.
              </p>
            </div>

            <div className="relative flex-shrink-0" style={{ zIndex: 10 }}>
              <div className="bg-white rounded-2xl p-6 shadow-2xl text-center min-w-[180px]">
                <div className="text-sm text-zinc-400 mb-1 font-medium">Your Savings</div>
                <div className="text-4xl font-bold text-orange-500 mb-1">Rs. 420</div>
                <div className="text-xs text-zinc-400">from 3 orders</div>
                <div className="mt-4 pt-4 border-t border-zinc-100">
                  <div className="text-xs text-zinc-500">Next reward at</div>
                  <div className="text-base font-semibold text-zinc-800 mt-0.5">Rs. 5,000</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════ */}
      <section className="relative py-32" style={{ zIndex: 10 }}>
        <div className="max-w-5xl mx-auto px-6">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <div className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-4">Reviews</div>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900">
              Trusted by vehicle owners.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Anita R.",
                car: "Hyundai i20 Owner",
                quote: "The AI prediction saved me from a highway breakdown. It flagged my brake pads weeks before they gave out. I replaced them on my own schedule.",
              },
              {
                name: "Bikash S.",
                car: "Toyota Corolla Owner",
                quote: "Ordering parts used to mean multiple calls and visits. Now I find exactly what I need filtered for my car, see the price, and it's ready when I arrive.",
              },
              {
                name: "Priya M.",
                car: "Honda Civic Owner",
                quote: "The loyalty discount is great — I've saved over Rs. 400 already. Plus having the full service history digital really helped when I sold my last car.",
              },
            ].map(({ name, car, quote }, i) => (
              <motion.div key={name} {...fadeUp(i * 0.1)} className="testi-card bg-white border border-zinc-200 rounded-2xl p-7">
                <div className="flex items-center gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-orange-400 fill-orange-400" />
                  ))}
                </div>
                <p className="text-base font-light text-zinc-600 leading-relaxed mb-6">
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-sm font-bold text-zinc-500 flex-shrink-0">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-zinc-800">{name}</div>
                    <div className="text-xs text-zinc-400 mt-0.5">{car}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA
      ════════════════════════════════════════ */}
      <section className="relative py-32" style={{ zIndex: 10 }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div {...fadeUp()}>
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-zinc-900 mb-5">
              Your vehicle deserves better than guesswork.
            </h2>
            <p className="text-lg font-light text-zinc-500 leading-relaxed max-w-lg mx-auto mb-10">
              Join thousands of vehicle owners who manage their parts, services, and car health from one app. It&apos;s free to get started.
            </p>
            <Link href="/register" className="btn-shine bg-orange-500 hover:bg-orange-600 text-white text-base font-semibold px-12 py-5 rounded-full transition-colors hover:scale-105 active:scale-95 shadow-xl shadow-orange-500/20 inline-flex items-center gap-2">
              <ArrowRight className="w-5 h-5" />
              Get Started Free
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════ */}
      <footer className="relative py-14 border-t border-zinc-200" style={{ zIndex: 10 }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center">
                <Cog className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-semibold text-zinc-900">Veltro</span>
              <span className="text-sm text-zinc-300 ml-1">Vehicle Parts &amp; Service Management</span>
            </div>
            <div className="flex items-center gap-8">
              {["Privacy", "Terms", "Support"].map((l) => (
                <a key={l} href="#" className="text-sm text-zinc-400 hover:text-orange-500 transition-colors">
                  {l}
                </a>
              ))}
            </div>
            <div className="text-sm text-zinc-300">© 2026 Veltro</div>
          </div>
        </div>
      </footer>

    </main>
  );
}
