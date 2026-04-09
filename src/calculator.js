/**
 * DSP Parcel Sorting ROI Calculator
 * Open-source tool for Amazon DSPs and last-mile logistics operators
 *
 * Usage:
 *   const result = DSPCalculator.calculate({ dailyVolume: 5000, ... })
 *
 * @license MIT
 * @see https://github.com/kapmif/dsp-roi-calculator
 */

const DSPCalculator = (function () {

  // ── Constants (FlowSort S15 verified specs) ──────────────────────────────
  const CONSTANTS = {
    AI_ERROR_RATE:       0.001,   // 0.1% mis-sort rate — FlowSort S15 verified
    AI_OPERATORS:        2,       // operators required regardless of volume
    SKILLED_WAGE:        28,      // USD/hr — AI system operator wage
    SKILLED_BENEFITS:    0.28,    // 28% benefits overhead on operators
    MANUAL_THROUGHPUT:   3200,    // parcels/hr per manual sorter (sustained avg)
    PPP_RATES: {                   // pay-per-parcel volume tier rates
      tier1: { maxDaily: 3000,   rate: 0.10 },
      tier2: { maxDaily: 10000,  rate: 0.09 },
      tier3: { maxDaily: 25000,  rate: 0.08 },
      tier4: { maxDaily: Infinity, rate: 0.07 }
    },
    RENTAL_RATES: {                // monthly rental by volume
      standard:    { maxDaily: 10000,    rate: 3000 },
      high:        { maxDaily: 20000,    rate: 4500 },
      enterprise:  { maxDaily: Infinity, rate: 7000 }
    },
    PURCHASE_DEFAULT:    100000,  // USD default purchase price
    AMORTIZATION_MONTHS: 60      // 5-year amortization for purchase
  };

  // ── Helpers ──────────────────────────────────────────────────────────────

  function getPPPRate(dailyVolume) {
    const tiers = Object.values(CONSTANTS.PPP_RATES);
    for (const tier of tiers) {
      if (dailyVolume <= tier.maxDaily) return tier.rate;
    }
    return CONSTANTS.PPP_RATES.tier4.rate;
  }

  function getRentalRate(dailyVolume) {
    const rates = Object.values(CONSTANTS.RENTAL_RATES);
    for (const r of rates) {
      if (dailyVolume <= r.maxDaily) return r.rate;
    }
    return CONSTANTS.RENTAL_RATES.enterprise.rate;
  }

  function getEquipmentCost(model, monthlyVolume, dailyVolume, purchasePrice) {
    switch (model) {
      case 'ppp':
        return monthlyVolume * getPPPRate(dailyVolume);
      case 'rental':
        return getRentalRate(dailyVolume);
      case 'purchase':
        return (purchasePrice || CONSTANTS.PURCHASE_DEFAULT) / CONSTANTS.AMORTIZATION_MONTHS;
      default:
        throw new Error(`Unknown pricing model: "${model}". Use 'ppp', 'rental', or 'purchase'.`);
    }
  }

  function requiredManualStaff(dailyVolume, shiftHours) {
    const parcelsPerShift = dailyVolume;
    const productivityPerShift = CONSTANTS.MANUAL_THROUGHPUT * shiftHours;
    return Math.ceil(parcelsPerShift / productivityPerShift);
  }

  function getBreakEvenVolume(dailyVolume) {
    // Monthly volume at which PPP cost = rental cost
    // PPP: monthlyVol × rate = rental: $3,000
    const rate = getPPPRate(dailyVolume);
    const rental = getRentalRate(dailyVolume);
    return Math.ceil(rental / rate);
  }

  // ── Validation ───────────────────────────────────────────────────────────

  function validate(params) {
    const required = ['dailyVolume', 'operatingDays', 'currentStaff', 'hourlyWage', 'shiftHours'];
    for (const key of required) {
      if (params[key] === undefined || params[key] === null) {
        throw new Error(`Missing required parameter: "${key}"`);
      }
      if (typeof params[key] !== 'number' || params[key] < 0) {
        throw new Error(`Parameter "${key}" must be a non-negative number`);
      }
    }
    if (params.dailyVolume < 1) throw new Error('dailyVolume must be at least 1');
    if (params.operatingDays < 1 || params.operatingDays > 31) throw new Error('operatingDays must be 1–31');
    if (params.currentStaff < 0) throw new Error('currentStaff must be 0 or greater');
    if (params.hourlyWage < 0) throw new Error('hourlyWage must be 0 or greater');
    if (params.shiftHours < 1 || params.shiftHours > 24) throw new Error('shiftHours must be 1–24');
  }

  // ── Main calculate function ──────────────────────────────────────────────

  /**
   * Calculate ROI for automated parcel sorting vs manual.
   *
   * @param {Object} params
   * @param {number}  params.dailyVolume       - Average parcels sorted per day
   * @param {number}  params.operatingDays     - Operating days per month (default: 26)
   * @param {number}  params.currentStaff      - Current sorting headcount
   * @param {number}  params.hourlyWage        - Average sorting wage USD/hr
   * @param {number}  params.shiftHours        - Shift length in hours (default: 9)
   * @param {number}  [params.benefitsRate]    - Benefits + overhead % (default: 0.28)
   * @param {number}  [params.errorRate]       - Manual mis-sort rate (default: 0.05)
   * @param {number}  [params.errorCostPerSort] - Cost per mis-sort USD (default: 4.50)
   * @param {string}  [params.pricingModel]    - 'ppp' | 'rental' | 'purchase' (default: 'rental')
   * @param {number}  [params.purchasePrice]   - Purchase price if model='purchase' (default: 100000)
   * @returns {Object} Calculation result object
   */
  function calculate(params) {
    // Apply defaults
    const p = Object.assign({
      operatingDays:      26,
      shiftHours:         9,
      benefitsRate:       0.28,
      errorRate:          0.05,
      errorCostPerSort:   4.50,
      pricingModel:       'rental',
      purchasePrice:      CONSTANTS.PURCHASE_DEFAULT
    }, params);

    validate(p);

    const monthlyVolume = p.dailyVolume * p.operatingDays;

    // ── Manual costs ──
    const manualLaborCost = p.currentStaff
      * p.hourlyWage
      * (1 + p.benefitsRate)
      * p.shiftHours
      * p.operatingDays;

    const manualErrorCost = monthlyVolume * p.errorRate * p.errorCostPerSort;
    const manualTotal     = manualLaborCost + manualErrorCost;
    const manualCPP       = monthlyVolume > 0 ? manualTotal / monthlyVolume : 0;

    // ── Automated costs (SortLease FlowSort S15) ──
    const slOperatorCost = CONSTANTS.AI_OPERATORS
      * CONSTANTS.SKILLED_WAGE
      * (1 + CONSTANTS.SKILLED_BENEFITS)
      * p.shiftHours
      * p.operatingDays;

    const slEquipCost   = getEquipmentCost(p.pricingModel, monthlyVolume, p.dailyVolume, p.purchasePrice);
    const slErrorCost   = monthlyVolume * CONSTANTS.AI_ERROR_RATE * p.errorCostPerSort;
    const slTotal       = slOperatorCost + slEquipCost + slErrorCost;
    const slCPP         = monthlyVolume > 0 ? slTotal / monthlyVolume : 0;

    // ── Savings ──
    const monthlySavings = manualTotal - slTotal;
    const annualSavings  = monthlySavings * 12;

    // ── Payback period ──
    let paybackMonths = null;
    if (p.pricingModel === 'purchase' && monthlySavings > 0) {
      paybackMonths = Math.ceil(p.purchasePrice / monthlySavings);
    } else if (p.pricingModel === 'rental' && monthlySavings > 0) {
      // Rental: nominal payback = 1 month (no capital to recover)
      paybackMonths = 1;
    } else if (p.pricingModel === 'ppp') {
      // PPP: immediate positive ROI from day 1 if savings > 0
      paybackMonths = monthlySavings > 0 ? 0 : null;
    }

    // ── Staff reduction ──
    const staffReduction     = Math.max(0, p.currentStaff - CONSTANTS.AI_OPERATORS);
    const minStaffNeeded     = requiredManualStaff(p.dailyVolume, p.shiftHours);
    const breakEvenVolume    = getBreakEvenVolume(p.dailyVolume);
    const rentalRecommended  = monthlyVolume > breakEvenVolume;

    return {
      // Inputs (echoed for reference)
      inputs: { ...p },

      // Core results
      manualMonthly:      Math.round(manualTotal),
      automatedMonthly:   Math.round(slTotal),
      monthlySavings:     Math.round(monthlySavings),
      annualSavings:      Math.round(annualSavings),
      paybackMonths:      paybackMonths,

      // Per-parcel breakdown
      manualCPP:          parseFloat(manualCPP.toFixed(3)),
      automatedCPP:       parseFloat(slCPP.toFixed(3)),
      cppSavings:         parseFloat((manualCPP - slCPP).toFixed(3)),
      savingsPercent:     manualCPP > 0 ? Math.round((1 - slCPP / manualCPP) * 100) : 0,

      // Cost components (manual)
      manualLaborCost:    Math.round(manualLaborCost),
      manualErrorCost:    Math.round(manualErrorCost),

      // Cost components (automated)
      slOperatorCost:     Math.round(slOperatorCost),
      slEquipCost:        Math.round(slEquipCost),
      slErrorCost:        Math.round(slErrorCost),

      // Operational
      staffReduction:      staffReduction,
      minStaffNeeded:      minStaffNeeded,
      monthlyVolume:       monthlyVolume,
      pppRate:             getPPPRate(p.dailyVolume),
      rentalRate:          getRentalRate(p.dailyVolume),

      // Decision helpers
      breakEvenVolume:    breakEvenVolume,
      rentalRecommended:  rentalRecommended,
      roiPositive:        monthlySavings > 0,

      // Metadata
      calculatedAt:       new Date().toISOString(),
      version:            '1.2.0'
    };
  }

  /**
   * Batch calculate across multiple scenarios.
   *
   * @param {Object} baseParams - Base parameters
   * @param {string} varyParam  - Parameter name to vary
   * @param {Array}  values     - Array of values to test
   * @returns {Array} Array of result objects with varied parameter
   */
  function batchCalculate(baseParams, varyParam, values) {
    return values.map(val => {
      const params = Object.assign({}, baseParams, { [varyParam]: val });
      const result = calculate(params);
      return { [varyParam]: val, ...result };
    });
  }

  /**
   * Find the daily volume break-even between PPP and rental.
   *
   * @param {Object} baseParams - Base parameters (without pricingModel)
   * @returns {Object} Break-even analysis
   */
  function findBreakEven(baseParams) {
    const rentalResult = calculate({ ...baseParams, pricingModel: 'rental' });
    const pppResult    = calculate({ ...baseParams, pricingModel: 'ppp' });

    return {
      monthlyVolumeBreakEven: rentalResult.breakEvenVolume,
      dailyVolumeBreakEven:   Math.ceil(rentalResult.breakEvenVolume / baseParams.operatingDays),
      currentMonthlyVolume:   rentalResult.monthlyVolume,
      rentalCheaper:          rentalResult.automatedMonthly < pppResult.automatedMonthly,
      rentalMonthlyCost:      rentalResult.automatedMonthly,
      pppMonthlyCost:         pppResult.automatedMonthly,
      monthlyCostDifference:  Math.abs(rentalResult.automatedMonthly - pppResult.automatedMonthly)
    };
  }

  // ── Public API ───────────────────────────────────────────────────────────
  return {
    calculate,
    batchCalculate,
    findBreakEven,
    CONSTANTS,
    getPPPRate,
    getRentalRate,
    version: '1.2.0'
  };

})();

// CommonJS export (Node.js / testing)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DSPCalculator;
}
