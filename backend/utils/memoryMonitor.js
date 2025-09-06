const { cache } = require('../middleware/cache');

// Memory monitoring and cleanup utility
const monitorMemory = () => {
  const usage = process.memoryUsage();
  const heapUsed = (usage.heapUsed / 1024 / 1024).toFixed(2);
  const heapTotal = (usage.heapTotal / 1024 / 1024).toFixed(2);
  const usagePercent = ((usage.heapUsed / usage.heapTotal) * 100).toFixed(2);
  
  console.log(`Memory: ${heapUsed}MB/${heapTotal}MB (${usagePercent}%)`);
  
  // If memory usage is above 85%, clear cache and force garbage collection
  if (usagePercent > 85) {
    console.log('High memory usage detected, clearing cache...');
    cache.flushAll();
    
    if (global.gc) {
      global.gc();
      console.log('Garbage collection triggered');
    }
  }
  
  return { heapUsed, heapTotal, usagePercent };
};

// Run memory monitoring every 5 minutes in production
if (process.env.NODE_ENV === 'production') {
  setInterval(monitorMemory, 5 * 60 * 1000);
}

module.exports = { monitorMemory };