import React from 'react';
import { motion as Motion } from 'framer-motion';
import {
  Leaf, ShieldCheck, TrendingUp, Users, ArrowRight,
  UserCheck, UploadCloud, ShoppingBag, CreditCard
} from 'lucide-react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-green-200 selection:text-green-900">
      <NavBar />

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-green-200/40 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">

            {/* Hero Content */}
            <Motion.div
              className="flex-1 text-center md:text-left"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <Motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium text-sm mb-6 border border-green-200 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                The Future of Agriculture is Here
              </Motion.div>

              <Motion.h1
                variants={fadeIn}
                className="text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6 text-slate-900"
              >
                Connecting <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400">Farmers</span> Directly to Buyers
              </Motion.h1>

              <Motion.p variants={fadeIn} className="text-lg lg:text-xl text-slate-600 mb-8 max-w-2xl mx-auto md:mx-0 leading-relaxed">
                Empowering farmers with fair prices and giving buyers access to fresh, quality produce. No middlemen. Pure transparency.
              </Motion.p>

              <Motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-semibold transition-all shadow-lg shadow-green-600/30 hover:shadow-green-600/50 hover:-translate-y-1 flex items-center justify-center gap-2 group">
                  Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/listings" className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl font-semibold transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2">
                  Explore Crops
                </Link>
              </Motion.div>
            </Motion.div>

            {/* Hero Image / Illustration */}
            <Motion.div
              className="flex-1 w-full max-w-lg relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="aspect-square rounded-[2.5rem] bg-gradient-to-tr from-green-500 to-emerald-300 p-1 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595166258076-2e8f000b2184?q=80&w=1500&auto=format&fit=crop')] bg-cover bg-center rounded-[2.4rem] opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-[2.4rem]"></div>

                {/* Floating Badge */}
                <Motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="absolute bottom-8 -left-6 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 border border-slate-100"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="text-green-600 w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Farmer Profit</p>
                    <p className="text-xl font-bold text-slate-900">+40%</p>
                  </div>
                </Motion.div>
              </div>
            </Motion.div>

          </div>
        </div>
      </section>

      {/* 2. STATS / TRUST SECTION */}
      <section className="py-12 border-y border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Farmers", value: "10,000+" },
              { label: "Total Transactions", value: "Rs. 50M+" },
              { label: "Happy Buyers", value: "25,000+" },
              { label: "Regions Covered", value: "12 States" }
            ].map((stat, idx) => (
              <Motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">{stat.value}</h3>
                <p className="text-sm md:text-base font-medium text-slate-500 uppercase tracking-wide">{stat.label}</p>
              </Motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-green-600 font-semibold tracking-wide uppercase text-sm mb-3">Why Choose Us</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Revolutionizing the AgTech Space</h3>
            <p className="text-lg text-slate-600">We provide the tools and platform needed to make agricultural trading fair, secure, and profitable for everyone.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Users className="w-8 h-8 text-blue-600" />,
                title: "No Middlemen",
                desc: "Connect directly with buyers to maximize your profits and secure fair market value.",
                bg: "bg-blue-50"
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-green-600" />,
                title: "Fair Pricing",
                desc: "Real-time market rates and AI-driven insights ensure transparent pricing every time.",
                bg: "bg-green-50"
              },
              {
                icon: <ShieldCheck className="w-8 h-8 text-purple-600" />,
                title: "Secure Transactions",
                desc: "Escrow-based payments and verified user profiles guarantee safety and reliability.",
                bg: "bg-purple-50"
              },
              {
                icon: <Leaf className="w-8 h-8 text-amber-600" />,
                title: "Quality Assurance",
                desc: "Ratings and reviews maintain high standards for fresh, quality agricultural produce.",
                bg: "bg-amber-50"
              }
            ].map((feature, idx) => (
              <Motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className={`w-16 h-16 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </Motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Subtle patterned background */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-green-600 font-semibold tracking-wide uppercase text-sm mb-3">Simple Process</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-slate-900">How AgriConnect Works</h3>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-green-200 via-green-400 to-green-200 -translate-y-1/2 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {[
                { step: "01", icon: <UserCheck />, title: "Create Profile", desc: "Sign up as a farmer or buyer in minutes with verification." },
                { step: "02", icon: <UploadCloud />, title: "Upload Crop", desc: "Farmers list their produce with details, images, and expected price." },
                { step: "03", icon: <ShoppingBag />, title: "Buyer Connects", desc: "Buyers browse listings and place orders directly with farmers." },
                { step: "04", icon: <CreditCard />, title: "Secure Purchase", desc: "Payment is processed safely upon successful delivery confirmation." }
              ].map((item, idx) => (
                <Motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  className="relative z-10 flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 bg-white rounded-full border-4 border-green-100 flex items-center justify-center mb-6 shadow-xl relative group">
                    <div className="text-green-600 w-8 h-8 group-hover:scale-110 transition-transform">{item.icon}</div>
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                      {item.step}
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h4>
                  <p className="text-slate-600">{item.desc}</p>
                </Motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION SECTION */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-green-600"></div>
        {/* Background Decorative Circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500 rounded-full blur-3xl opacity-50 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-700 rounded-full blur-3xl opacity-50 -translate-x-1/3 translate-y-1/3"></div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <Motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">Ready to Transform Your Trading Experience?</h2>
            <p className="text-green-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Join thousands of farmers and buyers already using AgriConnect to trade fairly, securely, and profitably.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup" className="px-8 py-4 bg-white text-green-700 rounded-2xl font-bold text-lg hover:bg-slate-50 hover:scale-105 transition-all shadow-xl shadow-green-900/20">
                Join AgriConnect Today
              </Link>
              <Link to="/login" className="px-8 py-4 bg-green-700 text-white border border-green-500 rounded-2xl font-bold text-lg hover:bg-green-800 transition-all">
                Login to Account
              </Link>
            </div>
          </Motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
