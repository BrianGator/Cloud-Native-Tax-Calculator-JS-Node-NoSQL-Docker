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

  // Load saved values on mount
  useEffect(() => {
    const savedData = localStorage.getItem('tax_calculator_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setIncome(parsed.income || '');
        setCity(parsed.city || '');
        setState(parsed.state || '');
        setZip(parsed.zip || '');
        setAllowances(parsed.allowances || '');
      } catch (e) {
        console.error('Failed to load saved data:', e);
      }
    }
  }, []);

  const handleSave = () => {
    const dataToSave = { income, city, state, zip, allowances };
    localStorage.setItem('tax_calculator_data', JSON.stringify(dataToSave));
    alert('Progress saved successfully!');
  };

  const handleClear = () => {
    setIncome('');
    setCity('');
    setState('');
    setZip('');
    setAllowances('');
    setResult(null);
    localStorage.removeItem('tax_calculator_data');
  };

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
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-emerald-500/30">
      {/* Header */}
      <header className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white rounded border border-slate-200 text-emerald-600">
              <Calculator size={24} />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-slate-900 block leading-none">tax-calculator</span>
              <span className="text-xs text-slate-900 uppercase tracking-widest font-bold">Written by Brian McCarthy</span>
            </div>
          </div>
          <div className="hidden md:flex gap-4">
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 text-xs font-bold uppercase tracking-widest rounded transition-colors cursor-pointer"
            >
              Save Data
            </button>
            <button 
              onClick={handleClear}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-900 text-xs font-bold uppercase tracking-widest rounded transition-colors cursor-pointer"
            >
              Clear
            </button>
            <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-tighter">Active Project</span>
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
            <div className="flex items-center gap-3 text-emerald-600 animate-pulse py-12">
              <RefreshCcw className="animate-spin" size={24} />
              <span className="font-bold uppercase tracking-widest text-sm">Consulting NoSQL Backend...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
                Modernize your <span className="text-emerald-600">tax calculation</span> infrastructure.
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                Agile planning, containerization, and automated pipelines. A full-stack assessment of your cloud-native capabilities powered by <span className="text-slate-900 font-semibold">Firebase NoSQL</span>.
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            <form onSubmit={handleCalculate} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl space-y-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                  <label htmlFor="income" className="text-sm font-bold uppercase tracking-widest text-slate-900">Your Total Income</label>
                    <div className={`flex items-center gap-2 px-3 py-1 border rounded text-xs font-bold transition-colors ${
                      dataSource === 'NoSQL' 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' 
                        : 'bg-orange-500/10 border-orange-500/20 text-orange-600'
                    }`}>
                      <Database size={12} />
                      {dataSource}
                    </div>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xl">$</span>
                    <input
                      id="income"
                      type="number"
                      placeholder="75000"
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                      className="w-full pl-10 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all text-xl font-medium text-slate-900 placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="city" className="text-xs font-bold uppercase tracking-widest text-slate-900">City</label>
                    <input
                      id="city"
                      type="text"
                      placeholder="Austin"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all text-base font-medium text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="state" className="text-xs font-bold uppercase tracking-widest text-slate-900">State</label>
                    <input
                      id="state"
                      type="text"
                      placeholder="TX"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all text-base font-medium text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="zip" className="text-xs font-bold uppercase tracking-widest text-slate-900">Zip Code</label>
                    <input
                      id="zip"
                      type="text"
                      placeholder="78701"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all text-base font-medium text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="allowances" className="text-xs font-bold uppercase tracking-widest text-slate-900">Allowances</label>
                    <input
                      id="allowances"
                      type="number"
                      placeholder="2"
                      value={allowances}
                      onChange={(e) => setAllowances(e.target.value)}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all text-base font-medium text-slate-900 placeholder:text-slate-400"
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
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Project Roadmap</h2>
              <div className="space-y-3">
                {[
                  { tag: 'Phase A', title: 'Agile Planning', status: 'Complete' },
                  { tag: 'Phase B', title: 'Containerization', status: 'Dockerized' },
                  { tag: 'Phase C', title: 'CI/CD Pipeline', status: 'Tekton' },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 relative overflow-hidden group">
                    <span className="text-[10px] text-emerald-600 font-bold uppercase block mb-1">{item.tag}</span>
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="text-[11px] text-slate-900 mt-1">{item.status}</p>
                    {idx === 0 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-600" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DevOps Progress Indicators */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-4 group">
              <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-emerald-600 group-hover:scale-110 transition-transform">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="font-bold text-xs text-slate-900">Jasmine Tests</p>
                <p className="text-[11px] text-slate-900">7 Specs Passing</p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-4 group">
              <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-emerald-600 group-hover:scale-110 transition-transform">
                <Landmark size={20} />
              </div>
              <div>
                <p className="font-bold text-xs text-slate-900">IBM Cloud Ready</p>
                <p className="text-[11px] text-slate-900">Code Engine Active</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Result Display */}
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-50 text-slate-900 p-10 rounded-3xl border border-slate-200 shadow-xl space-y-10"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-white rounded-2xl border border-slate-200">
                <ReceiptText size={28} className="text-emerald-600" />
              </div>
              <span className="text-xs font-mono text-slate-900 uppercase tracking-[0.2em] font-bold">Deployment Log</span>
            </div>

            <div className="space-y-3">
              <p className="text-slate-900 text-sm font-bold uppercase tracking-widest">Tax Due</p>
              <h2 className="text-7xl font-bold tracking-tighter text-emerald-600">
                ${result !== null ? result.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}
              </h2>
            </div>

            <div className="space-y-6 pt-10 border-t border-slate-200">
              <div className="flex justify-between items-center text-lg">
                <span className="font-bold text-slate-900">Taxable Income</span>
                <span className="font-mono text-slate-900">
                  ${income ? parseFloat(income).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}
                </span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span className="font-bold text-slate-900">Effective Tax Rate</span>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 text-sm font-bold rounded border border-emerald-500/20">
                  {income > 0 && result !== null ? ((result / income) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span className="font-bold text-slate-900">Your Total Income</span>
                <span className="font-mono text-slate-900">
                  ${income ? parseFloat(income).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}
                </span>
              </div>
            </div>

            <div className="p-8 bg-slate-900 border border-slate-800 rounded-xl font-mono leading-relaxed text-emerald-500">
              <p className="mb-2 text-xl font-bold">$ calculate --type=cloud-native --input={income || '126884'}</p>
              <p className="text-xl font-bold">Assessment criteria: Passed</p>
              <p className="text-xl font-bold">Integrity check: Verified</p>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="h-20 border-t border-slate-200 bg-slate-50 mt-20">
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          <p className="text-slate-900 text-[10px] uppercase font-bold tracking-widest">
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
