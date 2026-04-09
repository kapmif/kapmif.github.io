/**
 * Scaling Strategy Example
 * 
 * Demonstrates how to plan growth from small to large DSP operations
 */

const DSPROICalculator = require('../src/calculator.js');

console.log('='.repeat(70));
console.log('DSP Operation Scaling Strategy - Growth Planning');
console.log('='.repeat(70));

const calculator = new DSPROICalculator();

// Growth stages
const stages = [
  { name: 'Startup', routes: 5, description: 'Initial operation, proving concept' },
  { name: 'Early Growth', routes: 10, description: 'Established routes, optimizing operations' },
  { name: 'Expansion', routes: 20, description: 'Multiple teams, automation essential' },
  { name: 'Mature', routes: 35, description: 'Full automation, maximum efficiency' },
  { name: 'Enterprise', routes: 50, description: 'Large-scale operation, economies of scale' }
];

console.log('\n📈 Growth Stage Analysis:\n');
console.log('Stage'.padEnd(15) + 'Routes'.padEnd(8) + 'Daily Profit'.padEnd(15) + 'Monthly Profit'.padEnd(17) + 'Margin %'.padEnd(10) + 'Drivers');
console.log('-'.repeat(70));

const results = [];

for (const stage of stages) {
  const result = calculator.calculateROI(stage.routes, true);
  results.push({ stage, result });
  
  console.log(
    stage.name.padEnd(15) +
    stage.routes.toString().padEnd(8) +
    `$${result.profit.daily.toFixed(2).padStart(12)}  ` +
    `$${result.profit.monthly.toFixed(2).padStart(14)}  ` +
    `${result.margins.grossMarginPercent.toFixed(1).padStart(7)}%`.padEnd(10) +
    result.input.driversNeeded.toString()
  );
}

console.log('-'.repeat(70));

// Calculate growth metrics
console.log('\n🚀 Growth Metrics:\n');

const startup = results[0].result;
const enterprise = results[results.length - 1].result;

const profitGrowth = ((enterprise.profit.annual - startup.profit.annual) / startup.profit.annual) * 100;
const routeGrowth = ((50 - 5) / 5) * 100;

console.log(`From Startup to Enterprise:`);
console.log(`  Route increase: ${routeGrowth.toFixed(0)}% (${startup.input.routesPerDay} → ${enterprise.input.routesPerDay} routes)`);
console.log(`  Profit increase: ${profitGrowth.toFixed(0)}%`);
console.log(`  Annual profit at startup:  $${startup.profit.annual.toFixed(2)}`);
console.log(`  Annual profit at enterprise: $${enterprise.profit.annual.toFixed(2)}`);
console.log(`  Total additional annual profit: $${(enterprise.profit.annual - startup.profit.annual).toFixed(2)}`);

// Efficiency improvements at scale
console.log('\n⚡ Efficiency Improvements at Scale:\n');

console.log('Metric'.padEnd(30) + 'Startup'.padEnd(15) + 'Enterprise'.padEnd(15) + 'Improvement');
console.log('-'.repeat(70));

const startupPerRoute = startup.margins.profitPerRoute;
const enterprisePerRoute = enterprise.margins.profitPerRoute;
const perRouteImprovement = ((enterprisePerRoute - startupPerRoute) / startupPerRoute) * 100;

console.log(
  'Profit per Route'.padEnd(30) +
  `$${startupPerRoute.toFixed(2).padStart(12)}`.padEnd(15) +
  `$${enterprisePerRoute.toFixed(2).padStart(12)}`.padEnd(15) +
  `${perRouteImprovement.toFixed(1)}%`
);

const startupPerParcel = startup.margins.profitPerParcel;
const enterprisePerParcel = enterprise.margins.profitPerParcel;
const perParcelImprovement = ((enterprisePerParcel - startupPerParcel) / startupPerParcel) * 100;

console.log(
  'Profit per Parcel'.padEnd(30) +
  `$${startupPerParcel.toFixed(3).padStart(12)}`.padEnd(15) +
  `$${enterprisePerParcel.toFixed(3).padStart(12)}`.padEnd(15) +
  `${perParcelImprovement.toFixed(1)}%`
);

// Automation time savings comparison
console.log('\n⏱️ Automation Time Savings by Stage:\n');

console.log('Stage'.padEnd(15) + 'Manual Hours'.padEnd(15) + 'Auto Hours'.padEnd(15) + 'Hours Saved'.padEnd(15) + 'Efficiency');
console.log('-'.repeat(70));

for (const { stage, result } of results) {
  const manualHours = result.timeSavings.manualTimeHours;
  const autoHours = result.timeSavings.automatedTimeHours;
  const saved = result.timeSavings.hoursSaved;
  const efficiency = result.timeSavings.percentReduction;
  
  console.log(
    stage.name.padEnd(15) +
    manualHours.toFixed(1).padStart(12) + 'h  ' +
    autoHours.toFixed(1).padStart(12) + 'h  ' +
    saved.toFixed(1).padStart(12) + 'h  ' +
    `${efficiency.toFixed(1)}%`.padStart(10)
  );
}

console.log('\n' + '='.repeat(70));
console.log('\n💡 Strategic Recommendations:\n');
console.log('   1. Start with 5-10 routes to validate the business model');
console.log('   2. Invest in automation early (10+ routes) for maximum ROI');
console.log('   3. Target 20+ routes for optimal economies of scale');
console.log('   4. At 35+ routes, focus on operational excellence and margin optimization');
console.log('   5. Enterprise scale (50+ routes) enables competitive pricing advantages');
console.log('\n' + '='.repeat(70));
