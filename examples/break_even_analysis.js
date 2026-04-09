/**
 * Break-even Analysis Example
 * 
 * Demonstrates how to find the break-even point for different route volumes
 */

const DSPROICalculator = require('../src/calculator.js');

console.log('='.repeat(60));
console.log('Break-even Analysis - Finding Optimal Route Count');
console.log('='.repeat(60));

const calculator = new DSPROICalculator();

console.log('\n📊 Analyzing profit at different route volumes:\n');
console.log('Routes | Daily Profit | Monthly Profit | Margin %');
console.log('-'.repeat(55));

const routeVolumes = [3, 5, 8, 10, 15, 20, 30, 50];

for (const routes of routeVolumes) {
  const result = calculator.calculateROI(routes, true);
  console.log(
    `${routes.toString().padStart(6)} | $${result.profit.daily.toFixed(2).padStart(12)} | ` +
    `$${result.profit.monthly.toFixed(2).padStart(14)} | ${result.margins.grossMarginPercent.toFixed(1).padStart(7)}%`
  );
}

console.log('\n' + '='.repeat(60));

// Find break-even point
console.log('\n🔍 Finding break-even point (where profit becomes positive):\n');

let breakEvenRoutes = null;
for (let routes = 1; routes <= 50; routes++) {
  const result = calculator.calculateROI(routes, true);
  if (result.profit.daily > 0 && breakEvenRoutes === null) {
    breakEvenRoutes = routes;
    console.log(`✓ Break-even achieved at ${routes} routes/day`);
    console.log(`  Daily profit: $${result.profit.daily.toFixed(2)}`);
    console.log(`  Monthly profit: $${result.profit.monthly.toFixed(2)}`);
    break;
  }
}

if (!breakEvenRoutes) {
  console.log('No break-even point found in the analyzed range.');
}

console.log('\n' + '='.repeat(60));
