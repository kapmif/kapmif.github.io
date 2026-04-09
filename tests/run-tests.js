/**
 * DSP ROI Calculator - Test Runner
 * 
 * Runs all tests for the calculator module
 * 
 * Usage: node tests/run-tests.js
 */

const DSPROICalculator = require('../src/calculator.js');

let passed = 0;
let failed = 0;
const results = [];

function test(name, fn) {
  try {
    fn();
    passed++;
    results.push({ name, status: 'PASS' });
    console.log(`✓ ${name}`);
  } catch (error) {
    failed++;
    results.push({ name, status: 'FAIL', error: error.message });
    console.log(`✗ ${name}`);
    console.log(`  Error: ${error.message}`);
  }
}

function assertEqual(actual, expected, message) {
  if (Math.abs(actual - expected) > 0.01) {
    throw new Error(`${message}: expected ${expected}, got ${actual}`);
  }
}

function assertTrue(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// Run tests
console.log('Running DSP ROI Calculator Tests\n');
console.log('=' .repeat(50));

// Test 1: Calculator instantiation
test('Calculator should instantiate correctly', () => {
  const calc = new DSPROICalculator();
  assertTrue(calc !== null, 'Calculator should exist');
  assertTrue(typeof calc.calculateROI === 'function', 'Should have calculateROI method');
});

// Test 2: Default configuration
test('Should have correct default configuration', () => {
  const calc = new DSPROICalculator();
  assertEqual(calc.config.baseRatePerParcel, 1.25, 'Base rate per parcel');
  assertEqual(calc.config.driverHourlyRate, 22.0, 'Driver hourly rate');
  assertEqual(calc.config.workingDaysPerMonth, 26, 'Working days per month');
});

// Test 3: Update configuration
test('Should update configuration correctly', () => {
  const calc = new DSPROICalculator();
  calc.updateConfig({ baseRatePerParcel: 1.50 });
  assertEqual(calc.config.baseRatePerParcel, 1.50, 'Updated base rate');
});

// Test 4: Reset configuration
test('Should reset configuration to defaults', () => {
  const calc = new DSPROICalculator();
  calc.updateConfig({ baseRatePerParcel: 1.50 });
  calc.resetConfig();
  assertEqual(calc.config.baseRatePerParcel, 1.25, 'Reset base rate');
});

// Test 5: Daily revenue calculation
test('Should calculate daily revenue correctly', () => {
  const calc = new DSPROICalculator();
  const revenue = calc.calculateDailyRevenue(10);
  // 10 routes * 180 parcels * $1.25 = $2250 base
  // Fuel surcharge: $2250 * 8.5% = $191.25
  // Insurance: 1800 parcels * $0.15 = $270
  // Total: $2250 + $191.25 + $270 = $2711.25
  assertEqual(revenue, 2711.25, 'Daily revenue for 10 routes');
});

// Test 6: Operating costs calculation
test('Should calculate operating costs correctly', () => {
  const calc = new DSPROICalculator();
  const costs = calc.calculateDailyOperatingCosts(10, 5);
  // Labor: 5 drivers * $22 * 10 hours = $1100
  // Vehicle: 10 routes * $75 = $750
  // Insurance: 10 routes * $25 = $250
  // Total: $2100
  assertEqual(costs, 2100, 'Daily operating costs');
});

// Test 7: Sorting time savings
test('Should calculate sorting time savings', () => {
  const calc = new DSPROICalculator();
  const savings = calc.calculateSortingTimeSavings(1800);
  assertTrue(savings.hoursSaved > 0, 'Should have positive time savings');
  assertEqual(savings.percentReduction, ((45 - 12) / 45) * 100, 'Percent reduction');
});

// Test 8: ROI calculation with automation
test('Should calculate ROI with automation', () => {
  const calc = new DSPROICalculator();
  const result = calc.calculateROI(10, true);
  assertTrue(result.revenue.daily > 0, 'Revenue should be positive');
  assertTrue(result.costs.daily > 0, 'Costs should be positive');
  assertTrue(result.profit.daily !== undefined, 'Profit should exist');
  assertTrue(result.timeSavings.hoursSaved > 0, 'Time savings should be positive');
});

// Test 9: ROI calculation without automation
test('Should calculate ROI without automation', () => {
  const calc = new DSPROICalculator();
  const result = calc.calculateROI(10, false);
  assertTrue(result.costs.breakdown.sorter === 0, 'No sorter cost');
  assertTrue(result.costs.breakdown.maintenance === 0, 'No maintenance cost');
});

// Test 10: Compare scenarios
test('Should compare automation scenarios', () => {
  const calc = new DSPROICalculator();
  const comparison = calc.compareScenarios(10);
  assertTrue(comparison.withoutAutomation !== undefined, 'Without automation data exists');
  assertTrue(comparison.withAutomation !== undefined, 'With automation data exists');
  assertTrue(comparison.impact.dailyProfitIncrease !== undefined, 'Profit impact exists');
});

// Test 11: Revenue scales with routes
test('Revenue should scale linearly with routes', () => {
  const calc = new DSPROICalculator();
  const revenue5 = calc.calculateDailyRevenue(5);
  const revenue10 = calc.calculateDailyRevenue(10);
  assertEqual(revenue10, revenue5 * 2, 'Double routes should double revenue');
});

// Test 12: Profit margin calculation
test('Should calculate profit margins correctly', () => {
  const calc = new DSPROICalculator();
  const result = calc.calculateROI(10, true);
  assertTrue(result.margins.grossMarginPercent > 0, 'Gross margin should be positive');
  assertTrue(result.margins.profitPerParcel > 0, 'Profit per parcel should be positive');
});

// Test 13: Driver calculation
test('Should calculate drivers needed correctly', () => {
  const calc = new DSPROICalculator();
  const result = calc.calculateROI(10, true);
  // 10 routes * 180 parcels = 1800 parcels
  // 1800 / 400 = 4.5, rounded up = 5 drivers
  assertEqual(result.input.driversNeeded, 5, 'Drivers needed for 10 routes');
});

// Test 14: Monthly and annual projections
test('Should calculate monthly and annual projections', () => {
  const calc = new DSPROICalculator();
  const result = calc.calculateROI(10, true);
  assertEqual(result.revenue.monthly, result.revenue.daily * 26, 'Monthly revenue');
  assertEqual(result.revenue.annual, result.revenue.monthly * 12, 'Annual revenue');
});

// Test 15: Cost breakdown
test('Should provide detailed cost breakdown', () => {
  const calc = new DSPROICalculator();
  const result = calc.calculateROI(10, true);
  assertTrue(result.costs.breakdown.labor > 0, 'Labor cost exists');
  assertTrue(result.costs.breakdown.vehicles > 0, 'Vehicle cost exists');
  assertTrue(result.costs.breakdown.insurance > 0, 'Insurance cost exists');
  assertTrue(result.costs.breakdown.sorter > 0, 'Sorter cost exists');
});

// Test 16-20: Edge cases
test('Should handle single route', () => {
  const calc = new DSPROICalculator();
  const result = calc.calculateROI(1, true);
  assertTrue(result.revenue.daily > 0, 'Single route should have revenue');
});

test('Should handle large volume (100 routes)', () => {
  const calc = new DSPROICalculator();
  const result = calc.calculateROI(100, true);
  assertTrue(result.revenue.daily > 0, 'Large volume should have revenue');
  assertTrue(result.input.driversNeeded > 10, 'Large volume needs many drivers');
});

test('Should handle zero routes gracefully', () => {
  const calc = new DSPROICalculator();
  const result = calc.calculateROI(0, true);
  assertEqual(result.revenue.daily, 0, 'Zero routes should have zero revenue');
});

test('Configuration changes should affect calculations', () => {
  const calc = new DSPROICalculator();
  const original = calc.calculateDailyRevenue(10);
  calc.updateConfig({ baseRatePerParcel: 2.0 });
  const updated = calc.calculateDailyRevenue(10);
  assertTrue(updated > original, 'Higher rate should increase revenue');
});

test('Time savings percentage should be consistent', () => {
  const calc = new DSPROICalculator();
  const savings1 = calc.calculateSortingTimeSavings(100);
  const savings2 = calc.calculateSortingTimeSavings(1000);
  assertEqual(savings1.percentReduction, savings2.percentReduction, 'Percent reduction should be constant');
});

// Test 21-26: Additional coverage tests
test('Profit per route calculation', () => {
  const calc = new DSPROICalculator();
  const result = calc.calculateROI(10, true);
  assertTrue(result.margins.profitPerRoute > 0, 'Profit per route should be positive');
});

test('Payback period calculation exists', () => {
  const calc = new DSPROICalculator();
  const result = calc.calculateROI(10, true);
  assertTrue(result.roi.paybackPeriodDays !== null, 'Payback period should exist');
});

test('ROI percent calculation', () => {
  const calc = new DSPROICalculator();
  const result = calc.calculateROI(10, true);
  assertTrue(typeof result.roi.percent === 'number', 'ROI percent should be a number');
});

test('Input parameters are recorded', () => {
  const calc = new DSPROICalculator();
  const result = calc.calculateROI(15, false);
  assertEqual(result.input.routesPerDay, 15, 'Routes per day recorded');
  assertTrue(result.input.parcelsPerDay > 0, 'Parcels per day calculated');
  assertEqual(result.input.useAutomation, false, 'Automation flag recorded');
});

test('Comparison impact calculations', () => {
  const calc = new DSPROICalculator();
  const comparison = calc.compareScenarios(20);
  // Monthly impact should be daily * 26 working days
  const expectedMonthly = comparison.impact.dailyProfitIncrease * 26;
  const expectedAnnual = expectedMonthly * 12;
  assertEqual(comparison.impact.monthlyProfitIncrease, expectedMonthly, 'Monthly = daily * 26');
  assertEqual(comparison.impact.annualProfitIncrease, expectedAnnual, 'Annual = monthly * 12');
});

test('Automation reduces manual time', () => {
  const calc = new DSPROICalculator();
  const savings = calc.calculateSortingTimeSavings(500);
  assertTrue(savings.automatedTimeHours < savings.manualTimeHours, 'Automated time < manual time');
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`\nTest Results: ${passed} passed, ${failed} failed out of ${passed + failed} total`);

if (failed > 0) {
  console.log('\nFailed tests:');
  results.filter(r => r.status === 'FAIL').forEach(r => {
    console.log(`  - ${r.name}: ${r.error}`);
  });
  process.exit(1);
} else {
  console.log('\n✓ All tests passed!');
  process.exit(0);
}
