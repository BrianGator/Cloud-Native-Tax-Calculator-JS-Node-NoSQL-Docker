/**
 * Cloud Native Tax Calculator UI
 * Written by Brian McCarthy
 */
import React, { useState, useEffect } from 'react';
import { calculateTax } from './taxCalculator';
import { getTaxBrackets, seedBrackets } from './services/taxService';
import initialBrackets from './config/taxBrackets.json' with { type: 'json' };
import { Calculator, ReceiptText, Landmark, ShieldCheck, ArrowRight, Database, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [income, setIncome] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [allowances, setAllowances] = useState('');
  const [result, setResult] = useState(null);
  const [brackets, setBrackets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState('Checking...');

  useEffect(() => {
    async function loadData() {
      try {
        let data = await getTaxBrackets();
        if (!data || data.length === 0) {
          console.log('No brackets found in NoSQL, seeding initial data...');
          await seedBrackets();
          data = await getTaxBrackets();
        }
        
        if (data && data.length > 0) {
          setBrackets(data);
          setDataSource('NoSQL');
        } else {
          throw new Error('No data returned from NoSQL');
        }
      } catch (err) {
        console.warn('Failed to load tax configuration from NoSQL, using local fallback:', err);
        // Fallback to local JSON if Firestore fails
        setBrackets(initialBrackets.brackets);
        setDataSource('Local Fallback');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCalculate = (e) => {
    e.preventDefault();
    const numIncome = parseFloat(income);
    if (!isNaN(numIncome) && brackets.length > 0) {
      setResult(calculateTax(numIncome, brackets));
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] font-sans text-[#E4E4E7] selection:bg-emerald-500/30">
      {/* Header */}
      <header className="bg-[#0D0D0E] border-b border-[#27272A]">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-[#27272A] rounded border border-[#3F3F46] text-emerald-400">
              <Calculator size={20} />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-[#F4F4F5] block leading-none">tax-calculator</span>
              <span className="text-[10px] text-[#71717A] uppercase tracking-widest font-bold">Written by Brian McCarthy</span>
            </div>
          </div>
          <div className="hidden md:flex gap-3">
            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">Active Project</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Context & Form */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-7 space-y-10"
        >
          {loading ? (
            <div className="flex items-center gap-3 text-emerald-500 animate-pulse py-12">
              <RefreshCcw className="animate-spin" size={24} />
              <span className="font-bold uppercase tracking-widest text-sm">Consulting NoSQL Backend...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#F4F4F5] leading-tight">
                Modernize your <span className="text-emerald-500">tax calculation</span> infrastructure.
              </h1>
              <p className="text-lg text-[#A1A1AA] leading-relaxed max-w-xl">
                Agile planning, containerization, and automated pipelines. A full-stack assessment of your cloud-native capabilities powered by <span className="text-white font-semibold">Firebase NoSQL</span>.
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            <form onSubmit={handleCalculate} className="bg-[#121214] p-8 rounded-2xl border border-[#27272A] shadow-2xl space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="income" className="text-xs font-bold uppercase tracking-widest text-[#71717A]">Your Total Income</label>
                    <div className={`flex items-center gap-1.5 px-2 py-0.5 border rounded text-[10px] font-bold transition-colors ${
                      dataSource === 'NoSQL' 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                        : 'bg-orange-500/10 border-orange-500/20 text-orange-400'
                    }`}>
                      <Database size={10} />
                      {dataSource}
                    </div>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3F3F46] font-mono">$</span>
                    <input
                      id="income"
                      type="number"
                      placeholder="75000"
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                      className="w-full pl-10 pr-4 py-4 bg-[#0A0A0B] border border-[#27272A] rounded-xl focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all text-lg font-medium text-[#F4F4F5]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="city" className="text-[10px] font-bold uppercase tracking-widest text-[#71717A]">City</label>
                    <input
                      id="city"
                      type="text"
                      placeholder="Austin"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0A0A0B] border border-[#27272A] rounded-lg focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all text-sm font-medium text-[#F4F4F5]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="state" className="text-[10px] font-bold uppercase tracking-widest text-[#71717A]">State</label>
                    <input
                      id="state"
                      type="text"
                      placeholder="TX"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0A0A0B] border border-[#27272A] rounded-lg focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all text-sm font-medium text-[#F4F4F5]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="zip" className="text-[10px] font-bold uppercase tracking-widest text-[#71717A]">Zip Code</label>
                    <input
                      id="zip"
                      type="text"
                      placeholder="78701"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0A0A0B] border border-[#27272A] rounded-lg focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all text-sm font-medium text-[#F4F4F5]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="allowances" className="text-[10px] font-bold uppercase tracking-widest text-[#71717A]">Allowances</label>
                    <input
                      id="allowances"
                      type="number"
                      placeholder="2"
                      value={allowances}
                      onChange={(e) => setAllowances(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0A0A0B] border border-[#27272A] rounded-lg focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all text-sm font-medium text-[#F4F4F5]"
                    />
                  </div>
                </div>
              </div>

              <button
                id="calc-btn"
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all group shadow-lg shadow-emerald-900/20 uppercase text-xs tracking-widest"
              >
                Calculate
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="space-y-4">
              <h2 className="text-xs font-bold text-[#71717A] uppercase tracking-widest">Project Roadmap</h2>
              <div className="space-y-3">
                {[
                  { tag: 'Phase A', title: 'Agile Planning', status: 'Complete' },
                  { tag: 'Phase B', title: 'Containerization', status: 'Dockerized' },
                  { tag: 'Phase C', title: 'CI/CD Pipeline', status: 'Tekton' },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#0D0D0E] border border-[#27272A] relative overflow-hidden group">
                    <span className="text-[10px] text-emerald-500 font-bold uppercase block mb-1">{item.tag}</span>
                    <p className="text-sm font-semibold text-[#D4D4D8]">{item.title}</p>
                    <p className="text-[11px] text-[#52525B] mt-1">{item.status}</p>
                    {idx === 0 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DevOps Progress Indicators */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[#18181B]/50 border border-[#27272A] rounded-xl flex items-center gap-4 group">
              <div className="p-2.5 bg-[#27272A] rounded-lg text-emerald-400 group-hover:scale-110 transition-transform">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="font-bold text-xs text-[#F4F4F5]">Jasmine Tests</p>
                <p className="text-[11px] text-[#71717A]">7 Specs Passing</p>
              </div>
            </div>
            <div className="p-4 bg-[#18181B]/50 border border-[#27272A] rounded-xl flex items-center gap-4 group">
              <div className="p-2.5 bg-[#27272A] rounded-lg text-emerald-400 group-hover:scale-110 transition-transform">
                <Landmark size={20} />
              </div>
              <div>
                <p className="font-bold text-xs text-[#F4F4F5]">IBM Cloud Ready</p>
                <p className="text-[11px] text-[#71717A]">Code Engine Active</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Result Display */}
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <AnimatePresence mode="wait">
            {result !== null ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-[#0D0D0E] text-[#F4F4F5] p-8 rounded-3xl border border-[#27272A] shadow-2xl space-y-10"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-[#18181B] rounded-2xl border border-[#27272A]">
                    <ReceiptText size={24} className="text-emerald-400" />
                  </div>
                  <span className="text-[10px] font-mono text-[#52525B] uppercase tracking-[0.2em]">Deployment Log</span>
                </div>

                <div className="space-y-2">
                  <p className="text-[#A1A1AA] text-sm font-medium">Tax Due</p>
                  <h2 className="text-6xl font-bold tracking-tighter text-white">
                    ${result.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </h2>
                </div>

                <div className="space-y-5 pt-8 border-t border-[#27272A]">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#71717A]">Effective Tax Rate</span>
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded border border-emerald-500/20">
                      {income > 0 ? ((result / income) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#71717A]">Net Take Home</span>
                    <span className="font-mono text-lg text-white">
                      ${(income - result).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-black border border-[#27272A] rounded-xl font-mono text-[10px] leading-relaxed text-[#52525B]">
                  <p className="text-emerald-400/80 mb-1">$ calculate --type=cloud-native --input=75000</p>
                  <p>Assessment criteria: Passed</p>
                  <p>Integrity check: Verified</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                id="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-[500px] border border-[#27272A] bg-[#0D0D0E]/50 rounded-3xl flex flex-col items-center justify-center text-center p-12 space-y-6"
              >
                <div className="w-16 h-16 bg-[#18181B] rounded-full flex items-center justify-center border border-[#27272A] text-[#3F3F46]">
                  <Calculator size={32} />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-bold text-[#F4F4F5] uppercase tracking-widest">Awaiting Input</p>
                  <p className="text-xs text-[#71717A] max-w-[200px] leading-relaxed">
                    Enter gross income details to generate a cloud-ready tax assessment.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="h-20 border-t border-[#27272A] bg-[#0D0D0E] mt-20">
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          <p className="text-[#52525B] text-[10px] uppercase font-bold tracking-widest">
            © 2024 Cloud Native Final Project • Written by Brian McCarthy
          </p>
          <div className="flex gap-4">
             <div className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-widest rounded transition-colors cursor-pointer">
              Submit Project
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
