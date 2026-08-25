'use client';

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, ArrowLeftRight, Wallet, DollarSign, RefreshCw, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CryptoAsset {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  balance: number;
  color: string;
}

export default function CryptoView() {
  const [assets, setAssets] = useState<CryptoAsset[]>([
    { symbol: 'BTC', name: 'Bitcoin', price: 64850, change24h: 3.4, balance: 0.42, color: 'text-amber-400' },
    { symbol: 'ETH', name: 'Ethereum', price: 3490, change24h: -1.2, balance: 3.8, color: 'text-blue-400' },
    { symbol: 'SOL', name: 'Solana', price: 158.4, change24h: 7.8, balance: 18.5, color: 'text-purple-400' },
    { symbol: 'OMNI', name: 'OmniToken', price: 12.8, change24h: 24.5, balance: 450.0, color: 'text-cyan-400' },
  ]);

  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [swapAmount, setSwapAmount] = useState('1');
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapSuccess, setSwapSuccess] = useState(false);

  const totalValue = assets.reduce((acc, a) => acc + a.price * a.balance, 0);

  const handleSwap = () => {
    setIsSwapping(true);
    setTimeout(() => {
      setIsSwapping(false);
      setSwapSuccess(true);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
      });
      setTimeout(() => setSwapSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 no-scrollbar pb-24">
      {/* Portfolio Header */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-[#121826] to-[#1E293B] border border-white/10 relative overflow-hidden">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Wallet className="w-3.5 h-3.5" /> Web3 Decentralized Vault
          </span>
          <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            Live Stream
          </span>
        </div>

        <div className="mt-3">
          <div className="text-[11px] text-slate-400 uppercase font-mono">Portfolio Value</div>
          <div className="text-3xl font-black text-white font-mono mt-0.5">
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        {/* Mini Waveform Chart */}
        <div className="mt-4 h-16 w-full flex items-end justify-between space-x-1 pt-2">
          {[40, 55, 48, 65, 58, 80, 72, 90, 85, 100, 92, 110].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                style={{ height: `${h * 0.45}px` }}
                className={`w-full rounded-t-sm transition-all duration-500 ${
                  i === 11 ? 'bg-cyan-400 shadow-[0_0_8px_#00F0FF]' : 'bg-cyan-500/30 hover:bg-cyan-500/60'
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Asset List */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-300 font-mono tracking-wider uppercase">Market Assets</div>
        {assets.map((asset) => (
          <div
            key={asset.symbol}
            onClick={() => setSelectedAsset(asset.symbol)}
            className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
              selectedAsset === asset.symbol
                ? 'bg-[#161F33] border-cyan-400/50 shadow-lg shadow-cyan-500/5'
                : 'bg-[#121826]/80 border-white/5 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs font-mono">
                <span className={asset.color}>{asset.symbol}</span>
              </div>
              <div>
                <div className="text-xs font-bold text-white">{asset.name}</div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {asset.balance} {asset.symbol}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-bold font-mono text-white">
                ${asset.price.toLocaleString()}
              </div>
              <div
                className={`text-[10px] font-mono flex items-center justify-end gap-0.5 ${
                  asset.change24h >= 0 ? 'text-emerald-400' : 'text-pink-500'
                }`}
              >
                {asset.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {asset.change24h >= 0 ? '+' : ''}
                {asset.change24h}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Instant Swap Simulator Card */}
      <div className="p-4 rounded-2xl bg-[#121826] border border-white/10">
        <div className="flex items-center justify-between mb-3 text-xs font-bold font-mono text-cyan-400">
          <span className="flex items-center gap-1.5">
            <ArrowLeftRight className="w-3.5 h-3.5" /> Instant Swap Router
          </span>
          <span className="text-[10px] text-slate-400">Slippage: 0.1%</span>
        </div>

        <div className="space-y-2">
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[9px] text-slate-400 font-mono">PAY</span>
              <input
                type="number"
                value={swapAmount}
                onChange={(e) => setSwapAmount(e.target.value)}
                className="w-24 bg-transparent text-sm font-bold font-mono text-white focus:outline-none"
              />
            </div>
            <span className="px-2 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold">
              ETH
            </span>
          </div>

          <div className="flex justify-center -my-1">
            <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-slate-300">
              <ArrowLeftRight className="w-3 h-3" />
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[9px] text-slate-400 font-mono">RECEIVE (EST.)</span>
              <div className="text-sm font-bold font-mono text-emerald-400">
                {(Number(swapAmount || 0) * 22.03).toFixed(2)} SOL
              </div>
            </div>
            <span className="px-2 py-1 rounded-lg bg-purple-500/20 text-purple-400 font-mono text-xs font-bold">
              SOL
            </span>
          </div>
        </div>

        <button
          onClick={handleSwap}
          disabled={isSwapping}
          className="w-full mt-3 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold text-xs flex items-center justify-center space-x-1.5 hover:opacity-90 active:scale-95 transition shadow-lg shadow-cyan-400/20"
        >
          {isSwapping ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : swapSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Swap Completed!</span>
            </>
          ) : (
            <span>Execute Swap</span>
          )}
        </button>
      </div>
    </div>
  );
}
