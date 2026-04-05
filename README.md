# Hi, I'm building SortLease 📦

**The first pay-per-parcel sorting network for US Delivery Service Partners.**

5,000+ small DSPs are stuck sorting parcels manually. Large carriers (FedEx, UPS, Amazon) have automated their hubs. Small operators have no affordable option — until now.

**The model:** We install AI sorting systems at zero capital cost. DSPs pay $0.10 per sorted parcel (vs $0.22–$0.30 manual). 83% gross margin. ~6-month payback per station.

---

## 🔧 What's in this repo

### [`dsp-roi-calculator`](https://github.com/kapmif/dsp-roi-calculator)

Open-source ROI calculator for last-mile delivery companies evaluating automated sorting.

- Pure Python, zero dependencies
- Interactive CLI + standalone browser app
- Real unit economics from actual deployments
- Models small / medium / large DSP operations

```bash
git clone https://github.com/kapmif/dsp-roi-calculator
python calculator.py
```

---

## 🏗️ What we're building

| | |
|---|---|
| 🤖 AI Engine | Computer vision parcel recognition + real-time routing |
| 📡 IoT Layer | QR scanner → MQTT → AWS IoT Core |
| 💳 Billing | $0.10/parcel metered → carrier payment API |
| 📊 Analytics | Real-time throughput dashboard |
| ⚡ Throughput | 3,500–21,000 parcels/hour per station |

**Interesting problems:**
- Sub-100ms routing decisions at scale
- QR-based driver lane assignment in < 10 seconds
- Metered billing integrated with FedEx / UPS / Amazon APIs
- Multi-tenant analytics across shared hubs

---

## 💜 Seed Round Open

- **$5M target** · 83% gross margin · 6-month payback/station
- **50-station network** → $45M annual gross profit
- → [Angel Investment Details](https://www.sortlease.com/angel-investment/)

**Hiring:** CEO · Backend Engineer · IoT Engineer
- → [Join the Mission](https://www.sortlease.com/join-the-mission/)

---

## 📬 Get in touch

- 🌐 [sortlease.com](https://www.sortlease.com)
- 📧 [info@sortlease.com](mailto:info@sortlease.com)
- 📞 [(406) 479-0215](tel:+14064790215)
- 💬 [WhatsApp](https://wa.me/14064790215?text=Hi!%20Found%20your%20GitHub.)
