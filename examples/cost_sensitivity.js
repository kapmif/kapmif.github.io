/**
 * Cost Sensitivity Analysis Example
 * 
 * Demonstrates how changes in key cost parameters affect profitability
 */

const DSPROICalculator = require('../src/calculator.js');

console.log('='.repeat(60));
console.log('Cost Sensitivity Analysis');
console.log('='.repeat(60));

const baseCalculator = new DSPROICalculator();
const routesPerDay = 15;

console.log(`\n📊 Baseline: ${routesPerDay} routes/day\n`);

const baseline = baseCalculator.calculateROI(routesPerDay, true);
console.log('Baseline Metrics:');
console.log(`  Daily Profit: $${baseline.profit.daily.toFixed(2)}`);
console.log(`  Gross Margin: ${baseline.margins.grossMarginPercent.toFixed(1)}%`);
console.log(`  Profit per Parcel: $${baseline.margins.profitPerParcel.toFixed(3)}`);

// Test driver rate sensitivity
console.log('\n' + '-'.repeat(60));
console.log('Driver Hourly Rate Sensitivity:');
console.log('-'.repeat(60));

const driverRates = [18, 20, 22, 24, 26, 28];
console.log('Rate/Hr | Daily Profit | Change | Margin %');
console.log('-'.repeat(50));

for (const rate of driverRates) {
  const calc = new DSPROICalculator();
  calc.updateConfig({ driverHourlyRate: rate });
  const result = calc.calculateROI(routesPerDay, true);
  const change = result.profit.daily - baseline.profit.daily;
  const changeStr = change >= 0 ? `+$${change.toFixed(2)}` : `-$${Math.abs(change).toFixed(2)}`;
  console.log(
    `$${rate.toString().padStart(7)} | $${result.profit.daily.toFixed(2).padStart(12)} | ` +
    `${changeStr.padStart(8)} | ${result.margins.grossMarginPercent.toFixed(1).padStart(7)}%`
  );
}

// Test parcel rate sensitivity
console.log('\n' + '-'.repeat(60));
console.log('Base Rate Per Parcel Sensitivity:');
console.log('-'.repeat(60));

const parcelRates = [1.10, 1.20, 1.25, 1.30, 1.40, 1.50];
console.log('Rate/Parcel | Daily Profit | Change | Margin %');
console.log('-'.repeat(55));

for (const rate of parcelRates) {
  const calc = new DSPROICalculator();
  calc.updateConfig({ baseRatePerParcel: rate });
  const result = calc.calculateROI(routesPerDay, true);
  const change = result.profit.daily - baseline.profit.daily;
  const changeStr = change >= 0 ? `+$${change.toFixed(2)}` : `-$${Math.abs(change).toFixed(2)}`;
  console.log(
    `$${rate.toFixed(2).padStart(11)} | $${result.profit.daily.toFixed(2).padStart(12)} | ` +
    `${changeStr.padStart(8)} | ${result.margins.grossMarginPercent.toFixed(1).padStart(7)}%`
  );
}

// Test sorter cost sensitivity
console.log('\n' + '-'.repeat(60));
console.log('Sorter Daily Cost Sensitivity:');
console.log('-'.repeat(60));

const sorterCosts = [100, 125, 150, 175, 200, 250];
console.log('Sorter Cost | Daily Profit | Change | ROI %');
console.log('-'.repeat(55));

for (const cost of sorterCosts) {
  const calc = new DSPROICalculator();
  calc.updateConfig({ sorterCostPerDay: cost });
  const result = calc.calculateROI(routesPerDay, true);
  const change = result.profit.daily - baseline.profit.daily;
  const changeStr = change >= 0 ? `+$${change.toFixed(2)}` : `-$${Math.abs(change).toFixed(2)}`;
  console.log(
    `$${cost.toString().padStart(11)} | $${result.profit.daily.toFixed(2).padStart(12)} | ` +
    `${changeStr.padStart(8)} | ${result.roi.percent.toFixed(1).padStart(7)}%`
  );
}

console.log('\n' + '='.repeat(60));
console.log('\n💡 Key Insights:');
console.log('   - Driver rates have the largest impact on profitability');
console.log('   - Parcel rate increases directly improve margins');
console.log('   - Sorter costs are relatively small compared to labor savings');
console.log('=' .repeat(60));
