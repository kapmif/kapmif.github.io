# Hi, I'm Wei — building AI parcel sorting infrastructure for last-mile logistics

## 🔧 What I'm building

**[SortLease](https://www.sortlease.com)** — AI-powered parcel sorting equipment for Amazon DSPs and last-mile logistics operators.

- FlowSort S15: **21,000 parcels/hour · 99.9% AI accuracy · 2 operators**
- Pricing: **$0.10/parcel pay-per-parcel** · rental from $3,000/month
- Target market: **5,000+ US Amazon Delivery Service Partners**
- Seed round open: **$5M target · 83% gross margin**

## 📦 Open source tools

### [DSP Parcel Sorting ROI Calculator](https://kapmif.github.io)

**→ [Live calculator](https://kapmif.github.io) · [Source](https://github.com/kapmif/kapmif.github.io)**

Free tool for Amazon DSPs and last-mile operators to calculate ROI of automated sorting vs manual. Enter your daily volume, staff count, wages — see exact monthly savings and payback period.

```js
const DSPCalculator = require('./src/calculator.js');

const result = DSPCalculator.calculate({
  dailyVolume:   5000,   // parcels/day
  currentStaff:  6,      // sorting headcount
  hourlyWage:    22,     // USD/hr
  pricingModel:  'rental'
});

console.log(result.monthlySavings);  // $52,400
console.log(result.annualSavings);   // $628,800
console.log(result.paybackMonths);   // 7 months
```

**Key benchmarks in the calculator:**

| Method | Cost/parcel | Throughput | Accuracy |
|---|---|---|---|
| Manual sorting | $0.22–$0.30 | 3,500/hr per operator | 94–96% |
| FlowSort S15 AI | $0.07–$0.10 | 21,000/hr (2 operators) | 99.9% |

---

## 📬 Contact

- **SortLease:** [sortlease.com](https://www.sortlease.com) · (406) 479-0215
- **Invest:** [Seed round open](https://www.sortlease.com/angel-investment/)
- **WhatsApp:** [+1 (406) 479-0215](https://wa.me/14064790215)
