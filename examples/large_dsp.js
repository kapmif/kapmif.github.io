/**
 * Large DSP Operation Example
 * 
 * Demonstrates ROI calculation for a large Amazon DSP operation
 * with 50 routes per day
 */

const DSPROICalculator = require('../src/calculator.js');

console.log('='.repeat(60));
console.log('Large DSP Operation - ROI Analysis');
console.log('='.repeat(60));

const calculator = new DSPROICalculator();

// Configure for large operation
calculator.updateConfig({
  baseRatePerParcel: 1.35,
  parcelsPerRoute: 220,
  workingDaysPerMonth: 26,
  driverHourlyRate: 24.0,
  sorterCostPerDay: 200.0
});

const routesPerDay = 50;
const result = calculator.calculateROI(routesPerDay, true);
const comparison = calculator.compareScenarios(routesPerDay);

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

console.log('\n🚀 Automation Impact:');
console.log(`   Daily profit increase: $${comparison.impact.dailyProfitIncrease.toFixed(2)}`);
console.log(`   Monthly profit increase: $${comparison.impact.monthlyProfitIncrease.toFixed(2)}`);
console.log(`   Annual profit increase: $${comparison.impact.annualProfitIncrease.toFixed(2)}`);

console.log('\n⏱️ Time Savings:');
console.log(`   Hours saved per day: ${result.timeSavings.hoursSaved.toFixed(2)}`);
console.log(`   Efficiency improvement: ${result.timeSavings.percentReduction.toFixed(1)}%`);

console.log('\n📈 Margins:');
console.log(`   Gross margin: ${result.margins.grossMarginPercent.toFixed(1)}%`);
console.log(`   Profit per parcel: $${result.margins.profitPerParcel.toFixed(3)}`);
console.log(`   Profit per route: $${result.margins.profitPerRoute.toFixed(2)}`);

console.log('\n💡 ROI Metrics:');
console.log(`   ROI percentage: ${result.roi.percent.toFixed(1)}%`);
if (result.roi.paybackPeriodDays) {
  console.log(`   Payback period: ${result.roi.paybackPeriodDays.toFixed(1)} days`);
}

console.log('\n' + '='.repeat(60));
