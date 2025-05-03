import { useState, useEffect } from 'react';
import { Clock, ArrowRightLeft, Database, Zap, Activity } from 'lucide-react';

export default function BlockchainTransactionMonitor() {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalValue: 0,
    avgGas: 0,
    blockHeight: 15432789
  });
  
  // Helper to generate random hash
  const generateHash = (length = 64) => {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < length - 2; i++) {
      hash += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return hash;
  };
  
  // Helper to generate random address
  const generateAddress = () => {
    return '0x' + Array(40).fill(0).map(() => 
      '0123456789abcdef'[Math.floor(Math.random() * 16)]
    ).join('');
  };
  
  // Generate a realistic transaction
  const generateTransaction = () => {
    const cryptos = ['ETH', 'BTC', 'USDT', 'USDC', 'BNB', 'SOL', 'ADA'];
    const networks = ['Ethereum', 'Bitcoin', 'Polygon', 'Solana', 'Avalanche', 'Binance Chain'];
    const crypto = cryptos[Math.floor(Math.random() * cryptos.length)];
    const network = networks[Math.floor(Math.random() * networks.length)];
    const value = (Math.random() * 10).toFixed(4);
    const gas = (Math.random() * 0.01).toFixed(6);
    
    return {
      id: generateHash(16),
      hash: generateHash(),
      from: generateAddress(),
      to: generateAddress(),
      value: parseFloat(value),
      gas: parseFloat(gas),
      timestamp: new Date().toISOString(),
      crypto,
      network,
      status: Math.random() > 0.05 ? 'Confirmed' : 'Pending',
      confirmations: Math.floor(Math.random() * 12)
    };
  };
  
  // Shorten hash/address display
  const shortenHash = (hash) => {
    if (!hash) return '';
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  };
  
  // Update stats based on transactions
  const updateStats = (txs) => {
    const totalValue = txs.reduce((sum, tx) => sum + tx.value, 0);
    const avgGas = txs.reduce((sum, tx) => sum + tx.gas, 0) / (txs.length || 1);
    
    setStats(prev => ({
      totalTransactions: prev.totalTransactions + 1,
      totalValue: parseFloat((prev.totalValue + totalValue).toFixed(4)),
      avgGas: parseFloat(avgGas.toFixed(6)),
      blockHeight: prev.blockHeight + (Math.random() > 0.7 ? 1 : 0)
    }));
  };
  
  // Add new transactions periodically
  useEffect(() => {
    const interval = setInterval(() => {
      // Generate between 1-3 new transactions
      const count = Math.floor(Math.random() * 3) + 1;
      const newTransactions = Array(count).fill().map(generateTransaction);
      
      setTransactions(prev => {
        // Keep only the most recent 20 transactions
        const updated = [...newTransactions, ...prev].slice(0, 20);
        updateStats(newTransactions);
        return updated;
      });
    }, 2500); // New transactions every 2.5 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Status badge color
  const getStatusColor = (status) => {
    return status === 'Confirmed' ? 'bg-green-500' : 'bg-yellow-500';
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 py-4 px-6 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="h-6 w-6 text-blue-400" />
            <h1 className="text-xl font-bold">Blockchain Transaction Monitor</h1>
          </div>
          <div className="flex items-center space-x-1 text-gray-400">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Live</span>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* Stats cards */}
          <div className="bg-gray-800 rounded-lg p-6 flex items-center">
            <div className="rounded-full bg-blue-500/20 p-3 mr-3 m-4">
              <Activity className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400 m-4 p-6">Total Transactions</p>
              <p className="text-xl font-semibold">{stats.totalTransactions.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 flex items-center">
            <div className="rounded-full bg-green-500/20 p-3 mr-3 m-6">
              <ArrowRightLeft className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Value</p>
              <p className="text-xl font-semibold">{stats.totalValue.toLocaleString()} Units</p>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 flex items-center">
            <div className="rounded-full bg-purple-500/20 p-3 mr-3">
              <Zap className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Average Gas</p>
              <p className="text-xl font-semibold">{stats.avgGas}</p>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 flex items-center">
            <div className="rounded-full bg-orange-500/20 p-3 mr-3">
              <Database className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Block Height</p>
              <p className="text-xl font-semibold p-4">{stats.blockHeight.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        {/* Transactions table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold p-4">Latest Transactions</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Hash</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">From</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Network</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {transactions.map((tx, index) => (
                  <tr key={tx.id} className={index === 0 ? "bg-blue-900/10" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {shortenHash(tx.hash)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {shortenHash(tx.from)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {shortenHash(tx.to)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="font-mono">{tx.value}</span> {tx.crypto}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {tx.network}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-400">
                      Loading transactions...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-4 px-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-400">
            Simulated blockchain data - For demonstration purposes only
          </p>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm text-gray-400">Live updating</span>
          </div>
        </div>
      </footer>
    </div>
  );
}


