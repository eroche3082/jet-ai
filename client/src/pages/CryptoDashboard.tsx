import { useState } from 'react';
import { ArrowUp, ArrowDown, Star } from 'lucide-react';

interface CryptoCoin {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  logoUrl: string;
}

export default function CryptoDashboard() {
  const [timeFrame, setTimeFrame] = useState<'24h' | '7d' | '1m'>('24h');
  
  // Sample cryptocurrency data
  const topCoins: CryptoCoin[] = [
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      price: 84391,
      change24h: 2.06,
      logoUrl: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg'
    },
    {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      price: 1638.36,
      change24h: 4.48,
      logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg'
    },
    {
      id: 'tether',
      name: 'Tether',
      symbol: 'USDT',
      price: 1,
      change24h: -0.01,
      logoUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.svg'
    },
    {
      id: 'xrp',
      name: 'XRP',
      symbol: 'XRP',
      price: 2.16,
      change24h: 7.52,
      logoUrl: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg'
    },
    {
      id: 'bnb',
      name: 'BNB',
      symbol: 'BNB',
      price: 594.8,
      change24h: 1.72,
      logoUrl: 'https://cryptologos.cc/logos/bnb-bnb-logo.svg'
    },
    {
      id: 'solana',
      name: 'Solana',
      symbol: 'SOL',
      price: 128.29,
      change24h: 6.07,
      logoUrl: 'https://cryptologos.cc/logos/solana-sol-logo.svg'
    },
    {
      id: 'usdc',
      name: 'USDC',
      symbol: 'USDC',
      price: 1,
      change24h: 0.00,
      logoUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg'
    },
    {
      id: 'dogecoin',
      name: 'Dogecoin',
      symbol: 'DOGE',
      price: 0.165,
      change24h: 4.08,
      logoUrl: 'https://cryptologos.cc/logos/dogecoin-doge-logo.svg'
    }
  ];

  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Cryptocurrency Dashboard</h1>
        <p className="text-slate-400">Track prices, trends, and news in real-time</p>
      </div>

      {/* Market Overview */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Market Overview</h2>
          <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
            <button 
              className={`px-3 py-1 rounded-md text-sm ${timeFrame === '24h' ? 'bg-indigo-600 text-white' : 'text-slate-300'}`}
              onClick={() => setTimeFrame('24h')}
            >
              24h
            </button>
            <button 
              className={`px-3 py-1 rounded-md text-sm ${timeFrame === '7d' ? 'bg-indigo-600 text-white' : 'text-slate-300'}`}
              onClick={() => setTimeFrame('7d')}
            >
              7d
            </button>
            <button 
              className={`px-3 py-1 rounded-md text-sm ${timeFrame === '1m' ? 'bg-indigo-600 text-white' : 'text-slate-300'}`}
              onClick={() => setTimeFrame('1m')}
            >
              1m
            </button>
          </div>
        </div>

        {/* Cryptocurrency Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {topCoins.map((coin) => (
            <div key={coin.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-700 mr-2 overflow-hidden">
                    {coin.logoUrl ? (
                      <img src={coin.logoUrl} alt={coin.name} className="h-6 w-6" />
                    ) : (
                      <span className="text-lg font-bold">{coin.symbol.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{coin.name}</h3>
                    <p className="text-xs text-slate-400">{coin.symbol}</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-yellow-400">
                  <Star className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-4">
                <p className="text-xl font-bold text-white">${coin.price.toLocaleString()}</p>
                <div className={`flex items-center mt-1 ${coin.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {coin.change24h >= 0 ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  <span className="text-sm font-medium">{Math.abs(coin.change24h).toFixed(2)}%</span>
                </div>
              </div>
              <div className="mt-3 h-12">
                {/* Chart would go here */}
                <div className="h-full w-full bg-slate-700 rounded overflow-hidden relative">
                  <svg viewBox="0 0 100 30" className="w-full h-full">
                    <path 
                      d={`M 0,${30 - Math.random() * 20} ${Array.from({ length: 20 }).map((_, i) => `L ${i * 5},${30 - Math.random() * 20}`).join(' ')}`} 
                      stroke={coin.change24h >= 0 ? '#10b981' : '#ef4444'} 
                      strokeWidth="2" 
                      fill="none" 
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bitcoin Details */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center">
            <div className="bg-slate-700 rounded-full p-2 mr-3">
              <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.svg" alt="Bitcoin" className="h-10 w-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Bitcoin (BTC)</h2>
              <p className="text-slate-400">$84,391.00 <span className="text-green-500">+2.06%</span></p>
            </div>
          </div>
          <div className="bg-slate-700 p-2 rounded-lg">
            <button className="text-white px-3 py-1 rounded bg-indigo-600 text-sm font-medium">Add to Portfolio</button>
          </div>
        </div>
        
        <div className="h-64 bg-slate-700 rounded-lg mb-6">
          {/* Large price chart would go here */}
          <div className="h-full w-full relative">
            <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full">
              <path 
                d={`M 0,${15 + Math.sin(0) * 10} ${Array.from({ length: 100 }).map((_, i) => `L ${i},${15 + Math.sin(i/5) * 10}`).join(' ')}`} 
                stroke="#10b981" 
                strokeWidth="0.5" 
                fill="none" 
              />
              <path 
                d={`M 0,${15 + Math.sin(0) * 10} ${Array.from({ length: 100 }).map((_, i) => `L ${i},${15 + Math.sin(i/5) * 10}`).join(' ')} L 100,30 L 0,30 Z`} 
                fill="url(#gradient)" 
                opacity="0.5"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-700 p-4 rounded-lg">
            <p className="text-slate-400 text-sm">Market Cap</p>
            <p className="text-white font-bold">$1.64T</p>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg">
            <p className="text-slate-400 text-sm">24h Volume</p>
            <p className="text-white font-bold">$48.2B</p>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg">
            <p className="text-slate-400 text-sm">Circulating Supply</p>
            <p className="text-white font-bold">19.4M BTC</p>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg">
            <p className="text-slate-400 text-sm">All-Time High</p>
            <p className="text-white font-bold">$86,243</p>
          </div>
        </div>
      </div>

      {/* Latest News */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Latest News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-slate-600 transition-colors">
              <div className="h-40 bg-slate-700"></div>
              <div className="p-4">
                <p className="text-xs text-slate-400 mb-2">Apr 12, 2025</p>
                <h3 className="text-white font-medium mb-2">Bitcoin Surges Past $84,000 As Institutional Adoption Increases</h3>
                <p className="text-slate-400 text-sm">The world's largest cryptocurrency continues its upward trend as more financial institutions add BTC to their balance sheets...</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recently Added */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Recently Added</h2>
        <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 text-left">
                <th className="p-4 text-slate-400 font-medium">#</th>
                <th className="p-4 text-slate-400 font-medium">Name</th>
                <th className="p-4 text-slate-400 font-medium">Price</th>
                <th className="p-4 text-slate-400 font-medium">24h %</th>
                <th className="p-4 text-slate-400 font-medium">Market Cap</th>
                <th className="p-4 text-slate-400 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Arbitrum', symbol: 'ARB', price: 1.26, change: 3.8, mcap: '1.7B' },
                { name: 'Optimism', symbol: 'OP', price: 3.45, change: -2.1, mcap: '1.3B' },
                { name: 'ApeCoin', symbol: 'APE', price: 1.96, change: 5.2, mcap: '864M' },
                { name: 'Render', symbol: 'RNDR', price: 9.82, change: 12.4, mcap: '723M' },
              ].map((coin, i) => (
                <tr key={i} className="border-b border-slate-700 hover:bg-slate-700/50">
                  <td className="p-4 text-white">{i + 1}</td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-slate-700 mr-2"></div>
                      <div>
                        <p className="text-white font-medium">{coin.name}</p>
                        <p className="text-slate-400 text-xs">{coin.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-white">${coin.price}</td>
                  <td className={`p-4 ${coin.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {coin.change >= 0 ? '+' : ''}{coin.change}%
                  </td>
                  <td className="p-4 text-white">${coin.mcap}</td>
                  <td className="p-4">
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm">Add</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}