import { CalculationResult, ChartDataPoint, TrendDataPoint } from "../types";

// This service now performs LOCAL calculations to ensure 100% accuracy and stability
// without relying on external AI API calls for the core logic.

export async function calculateLocal(
  calculatorId: string,
  inputs: Record<string, string>
): Promise<CalculationResult> {
  
  // Simulate a short delay for UI feeling
  await new Promise(resolve => setTimeout(resolve, 300));

  const getNum = (key: string) => {
      const val = parseFloat(inputs[key]);
      return isNaN(val) ? 0 : val;
  };
  const getStr = (key: string) => inputs[key] || '';

  // High Contrast Colors for Results - Black/White theme for inside colored cards
  const COLORS = {
      primary: '#000000',    // Black
      secondary: '#ffffff',  // White
      accent1: '#404040',    // Dark Gray
      accent2: '#737373',    // Mid Gray
      accent3: '#a3a3a3',    // Light Gray
  };

  try {
    switch (calculatorId) {
      // --- FINANCIAL ---
      case 'auto-loan': {
        const price = getNum('price');
        const salesTaxRate = getNum('sales_tax');
        const fees = getNum('fees');
        const tradeIn = getNum('trade_in');
        const owedOnTrade = getNum('owed_on_trade');
        const downPayment = getNum('down_payment');
        const rate = getNum('rate');
        const term = getNum('term'); // months

        const taxableAmount = Math.max(0, price - tradeIn);
        const salesTaxAmt = taxableAmount * (salesTaxRate / 100);
        const netTradeEquity = tradeIn - owedOnTrade;
        const totalLoanAmount = price + salesTaxAmt + fees - downPayment - netTradeEquity;

        if (totalLoanAmount <= 0) {
           return {
             result: "$0.00",
             unit: "Monthly Payment",
             details: "You don't need a loan! Your down payment and trade-in cover the cost.",
             steps: ["Total cost is covered by upfront payments."]
           };
        }

        const r = rate / 1200;
        let monthlyPayment = 0;
        if (rate === 0) {
            monthlyPayment = totalLoanAmount / term;
        } else {
            monthlyPayment = (totalLoanAmount * r * Math.pow(1 + r, term)) / (Math.pow(1 + r, term) - 1);
        }

        const totalPaid = monthlyPayment * term;
        const totalInterest = totalPaid - totalLoanAmount;

        const chartData: ChartDataPoint[] = [
            { label: 'Principal', value: totalLoanAmount, color: COLORS.primary }, 
            { label: 'Interest', value: totalInterest, color: COLORS.secondary }
        ];

        const trendData: TrendDataPoint[] = [];
        let currentBalance = totalLoanAmount;
        const years = Math.ceil(term / 12);
        
        for (let y = 1; y <= years; y++) {
            let yearPrincipal = 0;
            let yearInterest = 0;
            for (let m = 0; m < 12; m++) {
                const monthIdx = (y - 1) * 12 + m;
                if (monthIdx >= term) break;
                const interestPayment = currentBalance * r;
                const principalPayment = monthlyPayment - interestPayment;
                yearPrincipal += principalPayment;
                yearInterest += interestPayment;
                currentBalance -= principalPayment;
            }
            trendData.push({ label: `Yr ${y}`, primary: yearPrincipal, secondary: yearInterest });
        }

        return {
          result: `$${monthlyPayment.toFixed(2)}`,
          unit: "Monthly Payment",
          details: `Total loan cost: $${totalPaid.toLocaleString(undefined, {maximumFractionDigits: 0})}. You will pay $${totalInterest.toLocaleString(undefined, {maximumFractionDigits: 0})} in interest.`,
          steps: [
            `Vehicle Price: $${price.toLocaleString()}`,
            `+ Sales Tax & Fees: $${(salesTaxAmt + fees).toFixed(2)}`,
            `- Down Payment & Trade: $${(downPayment + netTradeEquity).toLocaleString()}`,
            `= Loan Amount: $${totalLoanAmount.toLocaleString()}`,
            `Term: ${term} months @ ${rate}%`
          ],
          chartData,
          trendData
        };
      }
      
      case 'mortgage': {
        const price = getNum('home_price');
        const down = getNum('down_payment');
        const rate = getNum('rate');
        const years = getNum('term');
        const annualTax = getNum('property_tax');
        const annualIns = getNum('insurance');
        const monthlyHOA = getNum('hoa');

        const principal = price - down;
        const monthlyRate = rate / 100 / 12;
        const numberOfPayments = years * 12;
        let monthlyPI = 0;
        if (rate === 0) monthlyPI = principal / numberOfPayments;
        else monthlyPI = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

        const monthlyTax = annualTax / 12;
        const monthlyIns = annualIns / 12;
        const totalMonthly = monthlyPI + monthlyTax + monthlyIns + monthlyHOA;
        const totalInterest = (monthlyPI * numberOfPayments) - principal;

        const chartData: ChartDataPoint[] = [
             { label: 'Principal', value: principal, color: COLORS.primary },
             { label: 'Interest', value: totalInterest, color: COLORS.secondary },
             { label: 'Taxes', value: annualTax * years, color: COLORS.accent1 },
        ];

        const trendData: TrendDataPoint[] = [];
        let currentBalance = principal;
        for (let y = 1; y <= years; y++) {
             let yearPrincipal = 0;
             let yearInterest = 0;
             for (let m = 0; m < 12; m++) {
                 const interestPayment = currentBalance * monthlyRate;
                 const principalPayment = monthlyPI - interestPayment;
                 yearPrincipal += principalPayment;
                 yearInterest += interestPayment;
                 currentBalance -= principalPayment;
             }
             if (y % 2 === 0 || years <= 15 || y === 1 || y === years) {
                trendData.push({ label: `Yr ${y}`, primary: yearPrincipal, secondary: yearInterest });
             }
        }
        return {
          result: `$${totalMonthly.toFixed(2)}`,
          unit: "Total Monthly Payment",
          details: `Principal & Interest: $${monthlyPI.toFixed(2)}`,
          steps: [`Loan: $${principal.toLocaleString()}`, `P&I: $${monthlyPI.toFixed(2)}`, `Tax+Ins+HOA: $${(monthlyTax+monthlyIns+monthlyHOA).toFixed(2)}`],
          chartData,
          trendData
        };
      }
      
      case 'compound-interest': {
         const p = getNum('principal');
         const pmt = getNum('monthly_contribution');
         const r = getNum('rate') / 100;
         const t = getNum('years');
         const type = inputs['frequency'] || 'Annually';
         const trendData: TrendDataPoint[] = [];
         let currentPrincipal = p; 
         let currentBalance = p;
         const totalMonths = t * 12;
         for (let m = 1; m <= totalMonths; m++) {
             currentPrincipal += pmt;
             const r_mo = type === 'Monthly' ? r/12 : (Math.pow(1+r, 1/12)-1);
             currentBalance = (currentBalance + pmt) * (1 + r_mo);
             if (m % 12 === 0) {
                trendData.push({ label: `Yr ${m/12}`, primary: currentPrincipal, secondary: currentBalance - currentPrincipal });
             }
         }
         return {
             result: `$${currentBalance.toLocaleString(undefined, {maximumFractionDigits: 2})}`,
             unit: `Total Value after ${t} years`,
             details: `Interest Earned: $${(currentBalance - currentPrincipal).toLocaleString()}`,
             steps: [`Invested: $${currentPrincipal.toLocaleString()}`, `Compound: ${type}`],
             chartData: [{ label: 'Principal', value: currentPrincipal, color: COLORS.primary }, { label: 'Interest', value: currentBalance - currentPrincipal, color: COLORS.secondary }],
             trendData
         };
      }

      case 'loan': {
        const amount = getNum('amount');
        const rate = getNum('rate') / 1200;
        const months = getNum('months');
        const extra = getNum('extra');
        
        const monthly = (amount * rate * Math.pow(1+rate, months)) / (Math.pow(1+rate, months) - 1);
        const actualPayment = monthly + extra;
        
        let balance = amount;
        let totalInterest = 0;
        let actualMonths = 0;
        
        const trendData: TrendDataPoint[] = [];
        
        while(balance > 0 && actualMonths < 1000) {
            const interest = balance * rate;
            const principal = actualPayment - interest;
            totalInterest += interest;
            balance -= principal;
            actualMonths++;
            
            if (actualMonths % 12 === 0 || balance <= 0) {
                trendData.push({ label: `Mo ${actualMonths}`, primary: amount - balance > amount ? amount : amount - balance, secondary: totalInterest});
            }
        }

        return {
            result: `$${monthly.toFixed(2)}`,
            unit: extra > 0 ? `Required (Pay $${actualPayment.toFixed(2)})` : "Monthly Payment",
            details: extra > 0 
                ? `Extra payments save you time! Paid off in ${Math.ceil(actualMonths/12)} years instead of ${(months/12).toFixed(1)}.` 
                : `Total Interest: $${((monthly*months)-amount).toFixed(2)}`,
            steps: [`Loan: $${amount.toLocaleString()}`, `Base Payment: $${monthly.toFixed(2)}`, `Extra: $${extra}`],
            chartData: [{label: 'Principal', value: amount, color: COLORS.primary}, {label: 'Total Interest', value: totalInterest, color: COLORS.secondary}],
            trendData: trendData.length > 20 ? trendData.filter((_, i) => i % 2 === 0) : trendData
        };
      }

      case 'roi': {
        const initial = getNum('invested');
        const returned = getNum('returned');
        const years = getNum('years');
        const expenses = getNum('expenses');
        const taxRate = getNum('tax_rate');
        const inflation = getNum('inflation');

        const grossProfit = returned - initial - expenses;
        const taxAmount = grossProfit > 0 ? grossProfit * (taxRate / 100) : 0;
        const netProfit = grossProfit - taxAmount;
        
        // Adjust for inflation (PV of Net Profit)
        const realNetProfit = netProfit / Math.pow(1 + inflation/100, years);
        const totalROI = (netProfit / initial) * 100;
        const annualizedROI = (Math.pow((returned - expenses - taxAmount) / initial, 1 / years) - 1) * 100;

        return { 
             result: `${totalROI.toFixed(2)}%`, 
             unit: "Total ROI (Nominal)", 
             details: `Real Profit (Inf. Adj): $${realNetProfit.toLocaleString(undefined, {maximumFractionDigits: 0})}`, 
             steps: [
                 `Gross Profit: $${grossProfit.toLocaleString()}`,
                 `Tax: $${taxAmount.toFixed(2)}`,
                 `Annualized Return: ${annualizedROI.toFixed(2)}%`
             ],
             chartData: [
                 {label: 'Initial', value: initial, color: COLORS.primary},
                 {label: 'Net Profit', value: Math.max(0, netProfit), color: COLORS.secondary},
                 {label: 'Tax/Exp', value: taxAmount + expenses, color: COLORS.accent1}
             ]
        };
      }

      case 'salary': {
        const hourly = getNum('hourly');
        const hours = getNum('hours');
        const weeks = getNum('weeks');
        const otHours = getNum('overtime_hours');
        const otRate = getNum('overtime_rate');
        
        const baseWeekly = hourly * hours;
        const otWeekly = hourly * otRate * otHours;
        const totalWeekly = baseWeekly + otWeekly;
        const annual = totalWeekly * weeks;

        return { 
            result: `$${annual.toLocaleString()}`, 
            unit: "Annual Salary", 
            details: `Weekly Pay: $${totalWeekly.toLocaleString()}`, 
            steps: [
                `Base: $${baseWeekly.toLocaleString()}/wk`,
                `Overtime: $${otWeekly.toLocaleString()}/wk`,
                `Worked: ${weeks} weeks/yr`
            ],
            chartData: [
                {label: 'Base Pay', value: baseWeekly * weeks, color: COLORS.primary},
                {label: 'Overtime', value: otWeekly * weeks, color: COLORS.secondary}
            ]
        };
      }

      case 'vat': {
        const amount = getNum('amount');
        const rate = getNum('tax');
        const mode = getStr('mode'); // "Add Tax" or "Remove Tax"
        
        let net = 0, tax = 0, gross = 0;

        if (mode.includes('Remove')) {
            // Gross to Net: Gross / (1 + rate)
            gross = amount;
            net = amount / (1 + (rate / 100));
            tax = gross - net;
            return {
                result: `$${net.toFixed(2)}`,
                unit: "Net Amount (Pre-Tax)",
                details: `Tax included was $${tax.toFixed(2)}`,
                chartData: [{label:'Net', value: net, color: COLORS.primary}, {label:'Tax', value: tax, color: COLORS.secondary}]
            };
        } else {
            // Net to Gross
            net = amount;
            tax = amount * (rate / 100);
            gross = net + tax;
            return { 
                result: `$${gross.toFixed(2)}`, 
                unit: "Total (Post-Tax)", 
                details: `Tax added: $${tax.toFixed(2)}`, 
                chartData: [{label:'Net', value: net, color: COLORS.primary}, {label:'Tax', value: tax, color: COLORS.secondary}] 
            };
        }
      }

      case 'break-even': {
        const fixed = getNum('fixed');
        const variable = getNum('variable');
        const price = getNum('price');
        const expected = getNum('expected');

        if (price <= variable) return { result: "Impossible", unit: "Price too low", details: "Price must be > Variable Cost" };

        const beUnits = fixed / (price - variable);
        const beRevenue = beUnits * price;
        
        let details = `Revenue needed: $${beRevenue.toLocaleString()}`;
        if (expected > 0) {
            const profit = (expected * price) - fixed - (expected * variable);
            details = `At ${expected} units, profit is $${profit.toLocaleString()}`;
        }

        return { 
            result: `${Math.ceil(beUnits).toLocaleString()} Units`, 
            unit: "To Break Even", 
            details: details, 
            steps: [
                `Contribution Margin: $${(price-variable).toFixed(2)}/unit`,
                `Fixed Costs: $${fixed.toLocaleString()}`
            ],
            chartData: [
                {label: 'Fixed Cost', value: fixed, color: COLORS.primary},
                {label: 'Variable (at BE)', value: beUnits * variable, color: COLORS.accent1},
                {label: 'Revenue (at BE)', value: beRevenue, color: COLORS.secondary} // This overlaps visually but conceptually shows scale
            ]
        };
      }

      case 'margin': {
        const cost = getNum('cost');
        const rev = getNum('revenue');
        const margin = ((rev - cost) / rev) * 100;
        return { result: `${margin.toFixed(2)}%`, unit: "Gross Margin", details: `Profit: $${(rev-cost).toFixed(2)}`, chartData: [{label:'Cost', value: cost, color: COLORS.primary}, {label:'Profit', value: rev-cost, color: COLORS.secondary}] };
      }
      case 'rule-72': return { result: `${(72 / getNum('rate')).toFixed(1)} Years`, unit: "To Double Investment", details: "Based on Rule of 72", steps: [`72 / ${getNum('rate')}`] };
      case 'net-worth': return { result: `$${(getNum('assets') - getNum('liabilities')).toLocaleString()}`, unit: "Net Worth", details: "Assets - Liabilities" };
      case 'inflation': {
        const fv = getNum('amount') * Math.pow(1 + getNum('rate')/100, getNum('years'));
        return { result: `$${fv.toLocaleString()}`, unit: `Value in ${getNum('years')} years`, details: `Purchasing power change.` };
      }
      case 'credit-payoff': {
        const b = getNum('balance');
        const r = getNum('rate')/1200;
        const p = getNum('payment');
        if (p <= b * r) return { result: "Never", unit: "Increase Payment", details: "Payment covers less than interest." };
        const n = -Math.log(1 - (r * b) / p) / Math.log(1 + r);
        return { result: `${Math.ceil(n)} Months`, unit: "To be Debt Free", details: `Total Interest: $${(p * n - b).toFixed(2)}` };
      }
      case 'down-payment': {
          const needed = getNum('goal') - getNum('savings');
          const months = needed / getNum('monthly');
          return { result: `${Math.ceil(months/12 * 10)/10} Years`, unit: "Time to Reach Goal", details: `${Math.ceil(months)} months total` };
      }
      case 'cd-ladder': {
          const val = getNum('deposit') * Math.pow(1 + getNum('rate')/100/12, getNum('months'));
          return { result: `$${val.toFixed(2)}`, unit: "Maturity Value", details: `Profit: $${(val - getNum('deposit')).toFixed(2)}` };
      }

      // --- HEALTH ---
      case 'bmi': {
          const lbs = getNum('weight');
          const ft = getNum('height_ft');
          const inc = getNum('height_in');
          const totalInches = (ft * 12) + inc;
          if (totalInches === 0) return { result: "0", unit: "Invalid Height", details: "", steps: []};
          const bmi = 703 * (lbs / (totalInches * totalInches));
          let cat = "Normal";
          if (bmi < 18.5) cat = "Underweight"; else if (bmi >= 25) cat = "Overweight"; if (bmi >= 30) cat = "Obese";
          return { result: bmi.toFixed(1), unit: "BMI", details: `Category: ${cat}`, steps: [`703 * W / H²`] };
      }
      case 'bmr': {
          const w = getNum('weight')*0.453592; 
          const h = (getNum('height_ft')*12 + getNum('height_in'))*2.54; 
          const a = getNum('age');
          
          // Mifflin-St Jeor
          let bmr = (10*w) + (6.25*h) - (5*a) + (getStr('gender')==='Male'?5:-161);
          
          // Activity Multiplier
          const act = getStr('activity');
          let factor = 1.2;
          if (act.includes('Light')) factor = 1.375;
          if (act.includes('Mod')) factor = 1.55;
          if (act.includes('Very')) factor = 1.725;
          if (act.includes('Super')) factor = 1.9;
          
          const tdee = Math.round(bmr * factor);
          
          return { 
              result: `${tdee}`, 
              unit: "Calories/Day (TDEE)", 
              details: `BMR: ${Math.round(bmr)} calories (Resting)`,
              steps: [
                  `BMR Formula: Mifflin-St Jeor`,
                  `Activity Factor: ${factor}x`
              ],
              chartData: [
                  {label: 'BMR', value: bmr, color: COLORS.primary},
                  {label: 'Activity Burn', value: tdee - bmr, color: COLORS.secondary}
              ]
          };
      }
      case 'water-intake': return { result: `${(getNum('weight')*0.5).toFixed(1)} oz`, unit: "Daily Water", details: "Approx 0.5oz per lb body weight." };
      case 'body-fat': {
          // Navy Method simplified
          const waist = getNum('waist'); const neck = getNum('neck'); const height = getNum('height'); const hip = getNum('hip');
          let bf = 0;
          if (getStr('gender') === 'Male') {
              bf = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
          } else {
              bf = 163.205 * Math.log10(waist + hip - neck) - 97.684 * Math.log10(height) - 78.387;
          }
          return { result: `${bf.toFixed(1)}%`, unit: "Body Fat Percentage", details: "US Navy Method Estimate" };
      }
      case 'ideal-weight': {
          const h = (getNum('height_ft')*12) + getNum('height_in');
          const base = getStr('gender') === 'Male' ? 52 : 49;
          const factor = getStr('gender') === 'Male' ? 1.9 : 1.7;
          const wt = base + (factor * (h - 60));
          return { result: `${wt.toFixed(1)} kg`, unit: "Ideal Weight", details: `Approx ${(wt*2.2).toFixed(1)} lbs (Robinson Formula)` };
      }
      case 'macros': {
          const cals = getNum('cals');
          const goal = getStr('goal');
          let p = 0.3, f = 0.35, c = 0.35;
          if (goal === 'Cutting') { p=0.4; f=0.4; c=0.2; }
          else if (goal === 'Bulking') { p=0.3; f=0.25; c=0.45; }
          return { 
              result: `${Math.round(cals*p/4)}g P`, 
              unit: "Protein Target", 
              details: `${Math.round(cals*c/4)}g Carbs, ${Math.round(cals*f/9)}g Fat`,
              chartData: [{label:'Protein', value:p, color:COLORS.primary}, {label:'Carbs', value:c, color:COLORS.secondary}, {label:'Fat', value:f, color:COLORS.accent1}] 
          };
      }
      case 'hr-max': return { result: `${220 - getNum('age')} bpm`, unit: "Max Heart Rate", details: "Zone 2 (Fat Burn): " + Math.round((220-getNum('age'))*0.6) + "-" + Math.round((220-getNum('age'))*0.7) + " bpm" };
      case 'bac': {
          const alc = getNum('drinks') * 14; 
          const w = getNum('weight') * 453.592;
          const r = getStr('gender') === 'Male' ? 0.68 : 0.55;
          const bac = ((alc / (w * r)) * 100) - (0.015 * getNum('hours'));
          return { result: `${Math.max(0, bac).toFixed(3)}%`, unit: "BAC Estimate", details: bac > 0.08 ? "Legally Intoxicated (US)" : "Within Legal Limits" };
      }
      case 'calorie-deficit': {
          const def = getNum('maintenance') - getNum('intake');
          const days = (getNum('goal_loss') * 3500) / def;
          return { result: `${Math.ceil(days)} Days`, unit: "To Reach Goal", details: `Deficit: ${def} cal/day` };
      }
      case 'sleep': return { result: "Calculating...", unit: "Cycles", details: "Aim for 5-6 cycles (90m each)." }; // Simplified response for complex UI
      case 'waist-hip': { const r = getNum('waist')/getNum('hip'); return { result: r.toFixed(2), unit: "Ratio", details: r > 0.85 ? "High Risk" : "Healthy Range" }; }
      case 'protein': { const p = getNum('weight') * (getStr('activity')==='Athlete' ? 0.8 : 0.5); return { result: `${Math.round(p)}g`, unit: "Daily Protein", details: "Based on activity level" }; }
      case 'smoking-cost': { const cost = getNum('packs') * getNum('price') * 365 * getNum('years'); return { result: `$${cost.toLocaleString()}`, unit: "Total Cost", details: "Money burned." }; }
      case 'pregnancy': return { result: "Coming Soon", unit: "Date", details: "Add 280 days to LMP." };
      case 'step-convert': return { result: `${(getNum('steps') * getNum('height') * 0.413 / 63360).toFixed(2)} Miles`, unit: "Distance Walked", details: "Based on stride length estimate." };

      // --- MATH ---
      case 'percentage': return { result: (getNum('val') * getNum('percent') / 100).toLocaleString(), unit: "Result", details: "Simple Percentage" };
      case 'circle': return { result: (Math.PI * Math.pow(getNum('radius'), 2)).toFixed(2), unit: "Area", details: `Circumference: ${(2*Math.PI*getNum('radius')).toFixed(2)}` };
      case 'fraction-add': {
          const n = (getNum('n1')*getNum('d2')) + (getNum('n2')*getNum('d1'));
          const d = getNum('d1') * getNum('d2');
          return { result: `${n}/${d}`, unit: "Fraction", details: `Decimal: ${(n/d).toFixed(3)}` };
      }
      case 'gcf-lcm': {
         const gcd = (a:number,b:number):number => !b ? a : gcd(b, a % b);
         const lcm = (a:number,b:number) => (a*b)/gcd(a,b);
         const a = getNum('a'), b = getNum('b');
         return { result: `GCF: ${gcd(a,b)}`, unit: `LCM: ${lcm(a,b)}`, details: "Greatest Common Factor & Least Common Multiple" };
      }
      case 'mean-median': {
          const list = getStr('list').split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n)).sort((a,b) => a-b);
          if(!list.length) return { result:0, unit:'Empty', details:''};
          const sum = list.reduce((a,b)=>a+b,0);
          const mean = sum / list.length;
          const mid = Math.floor(list.length/2);
          const median = list.length % 2 !== 0 ? list[mid] : (list[mid-1] + list[mid]) / 2;
          return { result: mean.toFixed(2), unit: "Mean (Average)", details: `Median: ${median}` };
      }
      case 'pythagorean': return { result: Math.sqrt(Math.pow(getNum('a'),2) + Math.pow(getNum('b'),2)).toFixed(2), unit: "Hypotenuse", details: "a² + b² = c²" };
      case 'slope': return { result: ((getNum('y2')-getNum('y1')) / (getNum('x2')-getNum('x1'))).toFixed(2), unit: "Slope (m)", details: "Rise over Run" };
      case 'quadratic': {
          const a = getNum('a'), b = getNum('b'), c = getNum('c');
          const d = Math.sqrt(b*b - 4*a*c);
          if (isNaN(d)) return { result: "No Real Roots", unit: "Complex", details: "Discriminant < 0" };
          return { result: `x = ${((-b+d)/(2*a)).toFixed(2)}`, unit: `or ${((-b-d)/(2*a)).toFixed(2)}`, details: "Roots of Equation" };
      }
      case 'factorial': {
          const f = (n:number):number => n<=1 ? 1 : n*f(n-1);
          return { result: f(getNum('n')).toLocaleString(), unit: "Factorial", details: `${getNum('n')}!` };
      }
      case 'permutation': {
         const f = (n:number):number => n<=1 ? 1 : n*f(n-1);
         return { result: (f(getNum('n')) / f(getNum('n')-getNum('r'))).toLocaleString(), unit: "Permutations", details: "Order matters (nPr)" };
      }
      case 'combination': {
         const f = (n:number):number => n<=1 ? 1 : n*f(n-1);
         const r = getNum('r'), n = getNum('n');
         return { result: (f(n) / (f(r) * f(n-r))).toLocaleString(), unit: "Combinations", details: "Order doesn't matter (nCr)" };
      }
      case 'log': return { result: (Math.log(getNum('x')) / Math.log(getNum('b'))).toFixed(4), unit: "Logarithm", details: `Log base ${getNum('b')}` };
      case 'random': return { result: Math.floor(Math.random() * (getNum('max') - getNum('min') + 1) + getNum('min')), unit: "Random Number", details: "Inclusive Range" };
      case 'prime': {
          const n = getNum('n');
          const isPrime = (num: number) => { for(let i=2, s=Math.sqrt(num); i<=s; i++) if(num%i===0) return false; return num>1; };
          return { result: isPrime(n) ? "Prime" : "Not Prime", unit: "", details: "" };
      }
      case 'std-dev': {
          const list = getStr('list').split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
          const mean = list.reduce((a,b)=>a+b,0) / list.length;
          const sqDiff = list.map(n => Math.pow(n-mean, 2)).reduce((a,b)=>a+b,0);
          return { result: Math.sqrt(sqDiff/list.length).toFixed(4), unit: "Standard Deviation", details: "Population SD" };
      }
      case 'triangle-area': return { result: (0.5 * getNum('base') * getNum('height')).toFixed(2), unit: "Area", details: "" };
      case 'cone-vol': return { result: ((Math.PI * Math.pow(getNum('radius'), 2) * getNum('height')) / 3).toFixed(2), unit: "Volume", details: "" };
      case 'sphere-vol': return { result: ((4/3) * Math.PI * Math.pow(getNum('radius'), 3)).toFixed(2), unit: "Volume", details: "" };
      case 'cylinder-vol': return { result: (Math.PI * Math.pow(getNum('radius'), 2) * getNum('height')).toFixed(2), unit: "Volume", details: "" };
      case 'cube': return { result: Math.pow(getNum('side'), 3).toFixed(2), unit: "Volume", details: `Surface Area: ${6*Math.pow(getNum('side'),2)}` };

      // --- PHYSICS ---
      case 'velocity': return { result: (getNum('distance')/getNum('time')).toFixed(2), unit: "Units/s", details: "Speed" };
      case 'force': return { result: (getNum('mass')*getNum('acceleration')).toFixed(2), unit: "Newtons", details: "F = ma" };
      case 'ohms-law': {
          return { result: (getNum('i') * getNum('r')).toFixed(2), unit: "Volts", details: "V = I * R" };
      }
      case 'kinetic-energy': return { result: (0.5 * getNum('mass') * Math.pow(getNum('velocity'),2)).toFixed(2), unit: "Joules", details: "KE = ½mv²" };
      case 'potential-energy': return { result: (getNum('mass') * 9.81 * getNum('height')).toFixed(2), unit: "Joules", details: "PE = mgh" };
      case 'power': return { result: (getNum('work') / getNum('time')).toFixed(2), unit: "Watts", details: "P = W/t" };
      case 'work': return { result: (getNum('force') * getNum('distance')).toFixed(2), unit: "Joules", details: "W = Fd" };
      case 'momentum': return { result: (getNum('mass') * getNum('velocity')).toFixed(2), unit: "kg·m/s", details: "p = mv" };
      case 'pressure': return { result: (getNum('force') / getNum('area')).toFixed(2), unit: "Pascals", details: "P = F/A" };
      case 'frequency': return { result: (getNum('speed') / getNum('wavelength')).toFixed(2), unit: "Hz", details: "f = v/λ" };
      case 'torque': return { result: (getNum('force') * getNum('radius')).toFixed(2), unit: "N·m", details: "τ = rF" };
      case 'density-phys': return { result: (getNum('mass') / getNum('volume')).toFixed(2), unit: "kg/m³", details: "ρ = m/V" };

      // --- CHEMISTRY ---
      case 'molarity': return { result: ((getNum('mass')/getNum('molar_mass')) / getNum('volume')).toFixed(4), unit: "Molar", details: "Moles/Liter" };
      case 'density-chem': return { result: (getNum('mass')/getNum('volume')).toFixed(4), unit: "g/mL", details: "Density" };
      case 'boyles': return { result: ((getNum('p1')*getNum('v1'))/getNum('p2')).toFixed(2), unit: "V2", details: "P1V1 = P2V2" };
      case 'charles': return { result: ((getNum('v2')*getNum('t1'))/getNum('v1')).toFixed(2), unit: "T2 (K)", details: "V1/T1 = V2/T2" };
      case 'ideal-gas': return { result: ((getNum('p')*getNum('v')) / (0.0821 * getNum('t'))).toFixed(4), unit: "Moles (n)", details: "n = PV/RT" };
      case 'ph': return { result: (-Math.log10(getNum('h'))).toFixed(2), unit: "pH", details: "Acidity" };
      case 'dilution': return { result: ((getNum('m1')*getNum('v1'))/getNum('m2')).toFixed(2), unit: "V2", details: "M1V1 = M2V2" };
      case 'half-life': return { result: (getNum('n0') * Math.pow(0.5, getNum('t')/getNum('h'))).toFixed(4), unit: "Remaining", details: "Decay" };
      case 'molality': return { result: (getNum('moles')/getNum('kg')).toFixed(4), unit: "m", details: "mol/kg" };
      case 'percent-yield': return { result: ((getNum('actual')/getNum('theoretical'))*100).toFixed(2), unit: "% Yield", details: "" };

      // --- CONSTRUCTION ---
      case 'concrete': {
          const l = getNum('length');
          const w = getNum('width');
          const d = getNum('depth') / 12; // convert to ft
          const qty = getNum('quantity');
          const waste = 1 + (getNum('waste')/100);
          
          const volumeCF = l * w * d * qty * waste;
          const volumeCY = volumeCF / 27;
          
          const bagSize = parseInt(getStr('bag_size')) || 80;
          // Approx 0.6 cubic feet per 80lb bag, scaling for other sizes
          const bagsNeeded = Math.ceil(volumeCF / (bagSize === 80 ? 0.6 : (bagSize/80)*0.6));
          
          return { 
              result: `${bagsNeeded} Bags`, 
              unit: `(${bagSize} lb premix)`, 
              details: `Total Volume: ${volumeCY.toFixed(2)} Cu. Yards`,
              steps: [
                  `Volume (inc ${getNum('waste')}% waste): ${volumeCF.toFixed(1)} cu ft`,
                  `Area: ${l*w} sq ft`
              ]
          };
      }
      case 'paint': return { result: `${Math.ceil(getNum('sqft')/350)} Gallons`, unit: "Paint", details: "1 gal covers ~350 sq ft" };
      case 'tile': {
          const area = getNum('length')*getNum('width');
          const tileW = getNum('tile_width');
          const tileH = getNum('tile_height');
          const waste = 1 + (getNum('waste')/100);
          
          if (tileW === 0 || tileH === 0) return { result: "0", unit: "Check Inputs", details: ""};
          
          const oneTileAreaSqFt = (tileW * tileH) / 144;
          const tilesNeeded = Math.ceil((area / oneTileAreaSqFt) * waste);
          
          return { 
              result: `${tilesNeeded} Tiles`, 
              unit: `Approx ${Math.ceil(tilesNeeded * oneTileAreaSqFt)} sq ft total`, 
              details: `Room Area: ${area} sq ft`,
              steps: [`Tile Area: ${oneTileAreaSqFt.toFixed(3)} sq ft`, `Waste Factor: ${getNum('waste')}%`]
          };
      }
      case 'carpet': return { result: `${Math.ceil((getNum('length')*getNum('width'))/9)} Sq Yards`, unit: "Carpet", details: "" };
      case 'mulch': 
      case 'gravel':
        return { result: `${((getNum('length')*getNum('width')*(getNum('depth')/12))/27).toFixed(2)} Cu. Yards`, unit: "Volume", details: "" };
      case 'drywall': return { result: `${Math.ceil(getNum('sqft')/32)} Sheets`, unit: "4x8 Panels", details: "Standard 32 sq ft sheets" };
      case 'roof-pitch': return { result: (Math.atan(getNum('rise')/getNum('run')) * (180/Math.PI)).toFixed(1), unit: "Degrees", details: `Pitch: ${getNum('rise')}/${getNum('run')}` };
      case 'board-foot': return { result: ((getNum('thick')*getNum('width')*getNum('length'))/12).toFixed(2), unit: "Board Feet", details: "Volume" };
      case 'wallpaper': return { result: `${Math.ceil((getNum('width')*getNum('height'))/25)} Rolls`, unit: "Standard Rolls", details: "Approx 25 sq ft/roll usable" };
      case 'btu': return { result: `${Math.ceil(getNum('sqft')*20)} BTU`, unit: "Cooling Capacity", details: "Roughly 20 BTU per sq ft" };
      case 'stairs': return { result: `${Math.ceil(getNum('rise')/7.5)} Steps`, unit: "Estimated", details: "Based on 7.5\" rise" };

      // --- SPORTS ---
      case 'running-pace': {
        const d = getNum('distance'), m = getNum('time_min'), s = getNum('time_sec');
        const pace = (m + s/60) / d;
        const pm = Math.floor(pace), ps = Math.round((pace-pm)*60);
        return { result: `${pm}:${ps<10?'0'+ps:ps}`, unit: "/ mile", details: "Average Pace" };
      }
      case 'era': return { result: ((9*getNum('runs'))/getNum('innings')).toFixed(2), unit: "ERA", details: "" };
      case 'qb-rating': {
          const a = Math.max(0, Math.min(2.375, (getNum('comp')/getNum('att') - 0.3) * 5));
          const b = Math.max(0, Math.min(2.375, (getNum('yds')/getNum('att') - 3) * 0.25));
          const c = Math.max(0, Math.min(2.375, (getNum('td')/getNum('att')) * 20));
          const d = Math.max(0, Math.min(2.375, 2.375 - (getNum('int')/getNum('att') * 25)));
          return { result: (((a+b+c+d)/6)*100).toFixed(1), unit: "Passer Rating", details: "NFL Formula" };
      }
      case 'one-rep-max': return { result: Math.round(getNum('weight') * (1 + getNum('reps')/30)), unit: "Lbs", details: "Epley Formula" };
      case 'cricket-nrr': return { result: ((getNum('runs_scored')/getNum('overs_faced')) - (getNum('runs_conceded')/getNum('overs_bowled'))).toFixed(3), unit: "NRR", details: "Net Run Rate" };
      case 'basketball-per': return { result: ((getNum('pts') + getNum('reb') + getNum('ast') + getNum('stl') + getNum('blk') - getNum('missed_fg') - getNum('missed_ft') - getNum('to')) / getNum('gp')).toFixed(1), unit: "Eff Rating", details: "Simple Efficiency" };
      case 'slugging': return { result: ((getNum('s') + 2*getNum('d') + 3*getNum('t') + 4*getNum('hr'))/getNum('ab')).toFixed(3), unit: "SLG", details: "" };
      case 'batting-avg': return { result: (getNum('hits')/getNum('ab')).toFixed(3), unit: "AVG", details: "" };
      case 'golf-handicap': return { result: ((getNum('score') - getNum('rating')) * 113 / getNum('slope')).toFixed(1), unit: "Differential", details: "" };
      case 'field-goal': return { result: ((getNum('made')/getNum('att'))*100).toFixed(1), unit: "%", details: "Success Rate" };

      // --- ECOLOGY ---
      case 'carbon-drive': return { result: ((getNum('distance')/getNum('mpg'))*19.6).toFixed(1), unit: "lbs CO2", details: "1 gal gas = 19.6 lbs CO2" };
      case 'electricity-cost': return { result: `$${((getNum('watts')*getNum('hours')/1000) * (getNum('rate')/100) * 30).toFixed(2)}`, unit: "Cost / Month", details: "Based on 30 days" };
      case 'water-shower': return { result: `${getNum('min')*getNum('gpm')}`, unit: "Gallons", details: "" };
      case 'plastic': return { result: `${getNum('daily')*365}`, unit: "Bottles/Year", details: "" };
      case 'solar': return { result: `${Math.ceil(getNum('bill') / (getNum('sun') * 30 * 0.15))} Panels`, unit: "Estimated (300W)", details: "Rough Estimate" };
      case 'tree-offset': return { result: `${Math.ceil(getNum('co2')/48)} Trees`, unit: "Needed", details: "1 mature tree absorbs ~48lbs CO2/yr" };
      case 'meat-carbon': return { result: `${(getNum('lbs')*27).toFixed(1)} kg CO2`, unit: "Weekly Emissions", details: "Beef is high impact" };
      case 'recycling': return { result: `${getNum('cans')*0.2} kWh`, unit: "Energy Saved", details: "" };
      case 'commute-cost': return { result: `$${((getNum('miles')*2*5*50 / getNum('mpg')) * getNum('price')).toLocaleString()}`, unit: "Annual Cost", details: "5 days/wk, 50 wks/yr" };
      case 'paper-waste': return { result: `${(getNum('reams')*12 * 0.06).toFixed(1)} Trees`, unit: "Per Year", details: "1 tree ~ 16 reams" };

      // --- EVERYDAY ---
      case 'fuel-cost': return { result: `$${((getNum('distance')/getNum('mpg'))*getNum('price')).toFixed(2)}`, unit: "Trip Cost", details: "" };
      case 'tip': return { result: `$${(getNum('bill')*(1+getNum('percent')/100)/getNum('people')).toFixed(2)}`, unit: "Per Person", details: "" };
      case 'discount': return { result: `$${(getNum('price')*(1-getNum('discount')/100)).toFixed(2)}`, unit: "Final Price", details: `Savings: $${(getNum('price')*getNum('discount')/100).toFixed(2)}` };
      case 'unit-price': return { result: `$${(getNum('price')/getNum('units')).toFixed(3)}`, unit: "Per Unit", details: "" };
      
      case 'pizza-party': {
          const adults = getNum('adults');
          const children = getNum('children');
          const hunger = getStr('hunger');
          const size = getStr('size');
          
          let slicesPerAdult = 2.5;
          if (hunger.includes('Light')) slicesPerAdult = 1.5;
          if (hunger.includes('Starving')) slicesPerAdult = 3.5;
          
          const slicesPerChild = slicesPerAdult * 0.6;
          
          const totalSlices = (adults * slicesPerAdult) + (children * slicesPerChild);
          
          let slicesPerPizza = 8;
          if (size.includes('Small')) slicesPerPizza = 6;
          if (size.includes('Large')) slicesPerPizza = 10;
          if (size.includes('XL')) slicesPerPizza = 12;
          
          const pizzas = Math.ceil(totalSlices / slicesPerPizza);
          
          return { 
              result: `${pizzas} Pizzas`, 
              unit: `${size}`, 
              details: `Total Slices Needed: ${Math.ceil(totalSlices)}`,
              steps: [`Avg Slices/Adult: ${slicesPerAdult}`, `Avg Slices/Child: ${slicesPerChild.toFixed(1)}`]
          };
      }

      case 'aspect-ratio': return { result: Math.round((getNum('h1')/getNum('w1'))*getNum('w2')), unit: "New Height", details: "" };
      case 'screen-ppi': {
          const diagPx = Math.sqrt(Math.pow(getNum('width'),2) + Math.pow(getNum('height'),2));
          return { result: Math.round(diagPx/getNum('diag')), unit: "PPI", details: "Pixels Per Inch" };
      }
      case 'bandwidth': return { result: `${((getNum('size')*8000)/getNum('speed')).toFixed(1)} seconds`, unit: "Transfer Time", details: "" };
      case 'coffee': return { result: `${Math.round(getNum('water')/getNum('ratio'))}g`, unit: "Coffee Beans", details: `Ratio 1:${getNum('ratio')}` };
      case 'age': return { result: new Date().getFullYear() - getNum('year'), unit: "Years Old", details: "" };
      case 'time-duration': return { result: Math.abs(getNum('h2')-getNum('h1')), unit: "Hours", details: "" };
      case 'reading-time': return { result: `${Math.ceil(getNum('words')/200)} min`, unit: "Reading Time", details: "Avg 200 wpm" };

      // --- CONVERSIONS ---
      case 'celsius-fahrenheit': return { result: `${(getNum('celsius')*9/5 + 32).toFixed(1)} °F`, unit: "", details: "" };
      case 'fahrenheit-celsius': return { result: `${((getNum('fahrenheit')-32)*5/9).toFixed(1)} °C`, unit: "", details: "" };
      case 'kg-lbs': return { result: `${(getNum('kg')*2.20462).toFixed(2)} lbs`, unit: "", details: "" };
      case 'lbs-kg': return { result: `${(getNum('lbs')/2.20462).toFixed(2)} kg`, unit: "", details: "" };
      case 'miles-km': return { result: `${(getNum('miles')*1.60934).toFixed(2)} km`, unit: "", details: "" };
      case 'km-miles': return { result: `${(getNum('km')/1.60934).toFixed(2)} mi`, unit: "", details: "" };
      case 'inch-cm': return { result: `${(getNum('in')*2.54).toFixed(2)} cm`, unit: "", details: "" };
      case 'cm-inch': return { result: `${(getNum('cm')/2.54).toFixed(2)} in`, unit: "", details: "" };
      case 'oz-grams': return { result: `${(getNum('oz')*28.3495).toFixed(2)} g`, unit: "", details: "" };
      case 'grams-oz': return { result: `${(getNum('g')/28.3495).toFixed(2)} oz`, unit: "", details: "" };
      case 'liters-gal': return { result: `${(getNum('l')*0.264172).toFixed(2)} gal`, unit: "", details: "" };
      case 'gal-liters': return { result: `${(getNum('gal')/0.264172).toFixed(2)} L`, unit: "", details: "" };

      default:
        return {
            result: "...",
            unit: "Coming Soon",
            details: "This calculator is being updated.",
            steps: []
        };
    }
  } catch (e) {
      return {
          result: "Error",
          details: "Invalid inputs.",
          steps: []
      };
  }
}