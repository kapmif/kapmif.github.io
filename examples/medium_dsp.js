/**
 * Medium DSP Operation Example
 * 
 * Demonstrates ROI calculation for a medium Amazon DSP operation
 * with 15 routes per day
 */

const DSPROICalculator = require('../src/calculator.js');

console.log('='.repeat(60));
console.log('Medium DSP Operation - ROI Analysis');
console.log('='.repeat(60));

const calculator = new DSPROICalculator();

// Configure for medium operation
calculator.updateConfig({
  baseRatePerParcel: 1.30,
  parcelsPerRoute: 200,
  workingDaysPerMonth: 26
});

const routesPerDay = 15;
const comparison = calculator.compareScenarios(routesPerDay);

console.log(`\n📦 Operation Scale: ${routesPerDay} routes/day`);
console.log(`   Parcels per day: ${comparison.withAutomation.input.parcelsPerDay}`);
console.log(`   Drivers needed: ${comparison.withAutomation.input.driversNeeded}`);

console.log('\n💰 Revenue (with automation):');
console.log(`   Daily: $${comparison.withAutomation.revenue.daily.toFixed(2)}`);
console.log(`   Monthly: $${comparison.withAutomation.revenue.monthly.toFixed(2)}`);
console.log(`   Annual: $${comparison.withAutomation.revenue.annual.toFixed(2)}`);

console.log('\n💸 Costs Comparison:');
console.log(`   Without automation: $${comparison.withoutAutomation.costs.daily.toFixed(2)}/day`);
console.log(`   With automation:    $${comparison.withAutomation.costs.daily.toFixed(2)}/day`);

console.log('\n📊 Profit Comparison:');
console.log(`   Without automation: $${comparison.withoutAutomation.profit.daily.toFixed(2)}/day`);
console.log(`   With automation:    $${comparison.withAutomation.profit.daily.toFixed(2)}/day`);

console.log('\n🚀 Impact of Automation:');
console.log(`   Daily profit increase: $${comparison.impact.dailyProfitIncrease.toFixed(2)}`);
console.log(`   Monthly profit increase: $${comparison.impact.monthlyProfitIncrease.toFixed(2)}`);
console.log(`   Annual profit increase: $${comparison.impact.annualProfitIncrease.toFixed(2)}`);
console.log(`   Margin improvement: ${comparison.impact.marginImprovementPercent.toFixed(1)}%`);
console.log(`   Time saved: ${comparison.impact.timeSavedHoursPerDay.toFixed(2)} hours/day`);

console.log('\n📈 Margins (with automation):');
console.log(`   Gross margin: ${comparison.withAutomation.margins.grossMarginPercent.toFixed(1)}%`);
console.log(`   Profit per parcel: $${comparison.withAutomation.margins.profitPerParcel.toFixed(3)}`);
console.log(`   Profit per route: $${comparison.withAutomation.margins.profitPerRoute.toFixed(2)}`);

console.log('\n' + '='.repeat(60));
