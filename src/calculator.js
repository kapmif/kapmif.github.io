/**
 * DSP ROI Calculator - Core Logic
 * 
 * Open-source ROI calculator for Amazon DSPs and last-mile parcel sorting automation
 * 
 * @author SortLease LLC
 * @license MIT
 */

class DSPROICalculator {
  constructor() {
    this.defaultConfig = {
      // Revenue parameters
      baseRatePerParcel: 1.25,
      fuelSurchargePercent: 8.5,
      insuranceFeePerParcel: 0.15,
      
      // Cost parameters
      driverHourlyRate: 22.0,
      driverHoursPerDay: 10,
      vehicleCostPerDay: 75.0,
      insuranceCostPerDay: 25.0,
      
      // Sorting automation parameters
      manualSortTimeSeconds: 45,
      automatedSortTimeSeconds: 12,
      sorterCostPerDay: 150.0,
      sorterMaintenancePerDay: 15.0,
      
      // Volume parameters
      workingDaysPerMonth: 26,
      parcelsPerRoute: 180
    };
    
    this.config = { ...this.defaultConfig };
  }

  /**
   * Update configuration
   * @param {Object} newConfig - New configuration values
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Reset to default configuration
   */
  resetConfig() {
    this.config = { ...this.defaultConfig };
  }

  /**
   * Calculate daily revenue
   * @param {number} routesPerDay - Number of routes per day
   * @returns {number} Daily revenue
   */
  calculateDailyRevenue(routesPerDay) {
    const parcelsPerDay = routesPerDay * this.config.parcelsPerRoute;
    const baseRevenue = parcelsPerDay * this.config.baseRatePerParcel;
    const fuelSurcharge = baseRevenue * (this.config.fuelSurchargePercent / 100);
    const insuranceFee = parcelsPerDay * this.config.insuranceFeePerParcel;
    
    return baseRevenue + fuelSurcharge + insuranceFee;
  }

  /**
   * Calculate daily operating costs (without sorting automation)
   * @param {number} routesPerDay - Number of routes per day
   * @param {number} driversNeeded - Number of drivers needed
   * @returns {number} Daily operating costs
   */
  calculateDailyOperatingCosts(routesPerDay, driversNeeded) {
    const laborCost = driversNeeded * this.config.driverHourlyRate * this.config.driverHoursPerDay;
    const vehicleCost = routesPerDay * this.config.vehicleCostPerDay;
    const insuranceCost = routesPerDay * this.config.insuranceCostPerDay;
    
    return laborCost + vehicleCost + insuranceCost;
  }

  /**
   * Calculate time savings from automated sorting
   * @param {number} parcelsPerDay - Number of parcels per day
   * @returns {Object} Time savings breakdown
   */
  calculateSortingTimeSavings(parcelsPerDay) {
    const manualTotalSeconds = parcelsPerDay * this.config.manualSortTimeSeconds;
    const automatedTotalSeconds = parcelsPerDay * this.config.automatedSortTimeSeconds;
    const secondsSaved = manualTotalSeconds - automatedTotalSeconds;
    const hoursSaved = secondsSaved / 3600;
    
    return {
      manualTimeHours: manualTotalSeconds / 3600,
      automatedTimeHours: automatedTotalSeconds / 3600,
      hoursSaved: hoursSaved,
      percentReduction: ((manualTotalSeconds - automatedTotalSeconds) / manualTotalSeconds) * 100
    };
  }

  /**
   * Calculate daily cost with sorting automation
   * @param {number} routesPerDay - Number of routes per day
   * @param {number} driversNeeded - Number of drivers needed
   * @returns {number} Daily cost with automation
   */
  calculateDailyCostWithAutomation(routesPerDay, driversNeeded) {
    const baseCosts = this.calculateDailyOperatingCosts(routesPerDay, driversNeeded);
    const sorterCost = this.config.sorterCostPerDay;
    const maintenanceCost = this.config.sorterMaintenancePerDay;
    
    return baseCosts + sorterCost + maintenanceCost;
  }

  /**
   * Calculate full ROI analysis
   * @param {number} routesPerDay - Number of routes per day
   * @param {boolean} useAutomation - Whether to use sorting automation
   * @returns {Object} Complete ROI analysis
   */
  calculateROI(routesPerDay, useAutomation = true) {
    const parcelsPerDay = routesPerDay * this.config.parcelsPerRoute;
    const driversNeeded = Math.ceil(parcelsPerDay / 400); // Assuming 400 parcels per driver
    
    const dailyRevenue = this.calculateDailyRevenue(routesPerDay);
    const dailyCost = useAutomation 
      ? this.calculateDailyCostWithAutomation(routesPerDay, driversNeeded)
      : this.calculateDailyOperatingCosts(routesPerDay, driversNeeded);
    
    const dailyProfit = dailyRevenue - dailyCost;
    const monthlyProfit = dailyProfit * this.config.workingDaysPerMonth;
    const annualProfit = monthlyProfit * 12;
    
    const timeSavings = this.calculateSortingTimeSavings(parcelsPerDay);
    
    // Calculate ROI percentage
    const investmentCost = useAutomation 
      ? (this.config.sorterCostPerDay + this.config.sorterMaintenancePerDay)
      : 0;
    const roiPercent = investmentCost > 0 
      ? ((dailyProfit - (dailyRevenue - this.calculateDailyOperatingCosts(routesPerDay, driversNeeded))) / investmentCost) * 100
      : 0;
    
    return {
      input: {
        routesPerDay,
        parcelsPerDay,
        driversNeeded,
        useAutomation
      },
      revenue: {
        daily: dailyRevenue,
        monthly: dailyRevenue * this.config.workingDaysPerMonth,
        annual: dailyRevenue * this.config.workingDaysPerMonth * 12
      },
      costs: {
        daily: dailyCost,
        monthly: dailyCost * this.config.workingDaysPerMonth,
        annual: dailyCost * this.config.workingDaysPerMonth * 12,
        breakdown: {
          labor: driversNeeded * this.config.driverHourlyRate * this.config.driverHoursPerDay,
          vehicles: routesPerDay * this.config.vehicleCostPerDay,
          insurance: routesPerDay * this.config.insuranceCostPerDay,
          sorter: useAutomation ? this.config.sorterCostPerDay : 0,
          maintenance: useAutomation ? this.config.sorterMaintenancePerDay : 0
        }
      },
      profit: {
        daily: dailyProfit,
        monthly: monthlyProfit,
        annual: annualProfit
      },
      timeSavings: timeSavings,
      roi: {
        percent: roiPercent,
        paybackPeriodDays: investmentCost > 0 && dailyProfit > 0 
          ? (this.config.sorterCostPerDay * 30) / (dailyProfit - (dailyRevenue - this.calculateDailyOperatingCosts(routesPerDay, driversNeeded))) 
          : null
      },
      margins: {
        grossMarginPercent: (dailyProfit / dailyRevenue) * 100,
        profitPerParcel: dailyProfit / parcelsPerDay,
        profitPerRoute: dailyProfit / routesPerDay
      }
    };
  }

  /**
   * Compare scenarios with and without automation
   * @param {number} routesPerDay - Number of routes per day
   * @returns {Object} Comparison analysis
   */
  compareScenarios(routesPerDay) {
    const withoutAutomation = this.calculateROI(routesPerDay, false);
    const withAutomation = this.calculateROI(routesPerDay, true);
    
    const profitDifference = withAutomation.profit.daily - withoutAutomation.profit.daily;
    const roiImprovement = withAutomation.margins.grossMarginPercent - withoutAutomation.margins.grossMarginPercent;
    
    return {
      withoutAutomation,
      withAutomation,
      impact: {
        dailyProfitIncrease: profitDifference,
        monthlyProfitIncrease: profitDifference * this.config.workingDaysPerMonth,
        annualProfitIncrease: profitDifference * this.config.workingDaysPerMonth * 12,
        marginImprovementPercent: roiImprovement,
        timeSavedHoursPerDay: withAutomation.timeSavings.hoursSaved
      }
    };
  }
}

// Export for Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DSPROICalculator;
}

if (typeof window !== 'undefined') {
  window.DSPROICalculator = DSPROICalculator;
}
