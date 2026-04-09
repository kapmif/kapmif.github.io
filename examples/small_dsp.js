/**
 * Small DSP Operation Example
 * 
 * Demonstrates ROI calculation for a small Amazon DSP operation
 * with 5 routes per day
 */

const DSPROICalculator = require('../src/calculator.js');

console.log('='.repeat(60));
console.log('Small DSP Operation - ROI Analysis');
console.log('='.repeat(60));

const calculator = new DSPROICalculator();

// Configure for small operation
calculator.updateConfig({
  baseRatePerParcel: 1.25,
  parcelsPerRoute: 180,
  workingDaysPerMonth: 26
});

const routesPerDay = 5;
const result = calculator.calculateROI(routesPerDay, true);

console.log(`\n📦 Operation Scale: ${routesPerDay} routes/day`);
console.log(`   Parcels per day: ${result.input.parcelsPerDay}`);
console.log(`   Drivers needed: ${result.input.driversNeeded}`);

console.log('\n💰 Revenue:');
console.log(`   Daily: $${result.revenue.daily.toFixed(2)}`);
console.log(`   Monthly: $${result.revenue.monthly.toFixed(2)}`);
console.log(`   Annual: $${result.revenue.annual.toFixed(2)}`);

console.log('\n💸 Costs:');
console.log(`   Daily: $${result.costs.daily.toFixed(2)}`);
console.log(`   Monthly: $${result.costs.monthly.toFixed(2)}`);
console.log(`   Annual: $${result.costs.annual.toFixed(2)}`);

console.log('\n📊 Profit:');
console.log(`   Daily: $${result.profit.daily.toFixed(2)}`);
console.log(`   Monthly: $${result.profit.monthly.toFixed(2)}`);
console.log(`   Annual: $${result.profit.annual.toFixed(2)}`);

console.log('\n⏱️ Time Savings from Automation:');
console.log(`   Hours saved per day: ${result.timeSavings.hoursSaved.toFixed(2)}`);
console.log(`   Efficiency improvement: ${result.timeSavings.percentReduction.toFixed(1)}%`);

console.log('\n📈 Margins:');
console.log(`   Gross margin: ${result.margins.grossMarginPercent.toFixed(1)}%`);
console.log(`   Profit per parcel: $${result.margins.profitPerParcel.toFixed(3)}`);
console.log(`   Profit per route: $${result.margins.profitPerRoute.toFixed(2)}`);

console.log('\n' + '='.repeat(60));
