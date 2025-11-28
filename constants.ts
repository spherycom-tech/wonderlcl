import { CategoryId, Category, CalculatorDef } from './types';

export const CATEGORIES: Category[] = [
  { id: CategoryId.FINANCIAL, name: 'Financial', iconName: 'Calculator', description: 'Loans, mortgages, interest, and investments.', color: 'text-lime-400' },
  { id: CategoryId.HEALTH, name: 'Health', iconName: 'Heart', description: 'BMI, BMR, calories, and body composition.', color: 'text-rose-400' },
  { id: CategoryId.MATH, name: 'Math', iconName: 'Sigma', description: 'Geometry, algebra, fractions, and statistics.', color: 'text-cyan-400' },
  { id: CategoryId.PHYSICS, name: 'Physics', iconName: 'Zap', description: 'Velocity, force, energy, and power.', color: 'text-violet-400' },
  { id: CategoryId.CHEMISTRY, name: 'Chemistry', iconName: 'FlaskConical', description: 'Molarity, pH, density, and reactions.', color: 'text-fuchsia-400' },
  { id: CategoryId.CONSTRUCTION, name: 'Construction', iconName: 'Hammer', description: 'Concrete, flooring, roofing, and paint.', color: 'text-orange-400' },
  { id: CategoryId.SPORTS, name: 'Sports', iconName: 'Trophy', description: 'Pace, scores, betting odds, and rankings.', color: 'text-yellow-400' },
  { id: CategoryId.ECOLOGY, name: 'Ecology', iconName: 'Leaf', description: 'Carbon footprint, water usage, and recycling.', color: 'text-emerald-400' },
  { id: CategoryId.EVERYDAY, name: 'Everyday', iconName: 'Coffee', description: 'Cooking, tips, fuel, and time.', color: 'text-indigo-400' },
  { id: CategoryId.CONVERSIONS, name: 'Conversions', iconName: 'ArrowLeftRight', description: 'Length, weight, temperature, and currency.', color: 'text-pink-400' },
];

// Helper to generate simple inputs
const num = (name: string, label: string, unit?: string, placeholder?: string, defaultValue?: string) => ({ 
  name, 
  label, 
  type: 'number' as const, 
  unit, 
  placeholder: placeholder || '0',
  defaultValue
});

const txt = (name: string, label: string, placeholder?: string) => ({
  name,
  label,
  type: 'text' as const,
  placeholder
});

const select = (name: string, label: string, options: string[]) => ({
  name,
  label,
  type: 'select' as const,
  options
});

const generateCalculators = (): CalculatorDef[] => {
  const list: CalculatorDef[] = [];

  // --- 1. FINANCIAL (15) ---
  list.push(
    { 
      id: 'auto-loan', 
      categoryId: CategoryId.FINANCIAL, 
      name: 'Auto Loan Calculator', 
      description: 'Comprehensive car payment estimator including trade-in equity, sales tax, and dealer fees.', 
      popular: true, 
      inputs: [
        num('price', 'Vehicle Price', '$', '35000', '35000'),
        num('sales_tax', 'Sales Tax', '%', '7', '7'),
        num('fees', 'Title, Reg & Fees', '$', '350', '350'),
        num('trade_in', 'Trade-in Value', '$', '0', '0'),
        num('owed_on_trade', 'Amount Owed on Trade', '$', '0', '0'),
        num('down_payment', 'Down Payment (Cash)', '$', '5000', '5000'),
        num('rate', 'Interest Rate', '%', '5.5', '5.5'),
        num('term', 'Loan Term', 'months', '60', '60'),
      ] 
    },
    { 
      id: 'mortgage', 
      categoryId: CategoryId.FINANCIAL, 
      name: 'Mortgage Calculator', 
      description: 'Calculate monthly mortgage payments with property tax, home insurance, and HOA fees.', 
      popular: true, 
      inputs: [
        num('home_price', 'Home Price', '$', '400000', '400000'),
        num('down_payment', 'Down Payment', '$', '80000', '80000'),
        num('rate', 'Interest Rate', '%', '6.5', '6.5'),
        num('term', 'Loan Term', 'years', '30', '30'),
        num('property_tax', 'Property Tax / Year', '$', '5000', '5000'),
        num('insurance', 'Home Insurance / Year', '$', '1200', '1200'),
        num('hoa', 'HOA Fees / Month', '$', '0', '0')
      ] 
    },
    { 
      id: 'compound-interest', 
      categoryId: CategoryId.FINANCIAL, 
      name: 'Investment Calculator', 
      description: 'Project investment growth with monthly contributions and compound frequency.', 
      popular: true,
      inputs: [
        num('principal', 'Initial Investment', '$', '10000', '10000'),
        num('monthly_contribution', 'Monthly Contribution', '$', '500', '500'),
        num('rate', 'Annual Return Rate', '%', '8', '8'),
        num('years', 'Growth Period', 'years', '20', '20'),
        select('frequency', 'Compound Frequency', ['Annually', 'Monthly'])
      ]
    },
    { 
      id: 'loan', 
      categoryId: CategoryId.FINANCIAL, 
      name: 'Advanced Loan', 
      description: 'Amortization schedule with extra payments.', 
      inputs: [
        num('amount', 'Loan Amount', '$'), 
        num('rate', 'Interest Rate', '%'), 
        num('months', 'Loan Term', 'months'),
        num('extra', 'Extra Monthly Payment', '$', '0'),
        select('start_month', 'Start Month', ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'])
      ] 
    },
    { 
      id: 'roi', 
      categoryId: CategoryId.FINANCIAL, 
      name: 'ROI Calculator', 
      description: 'Return on Investment with tax and inflation.', 
      inputs: [
        num('invested', 'Initial Investment', '$'), 
        num('returned', 'Final Returned Value', '$'),
        num('years', 'Investment Duration', 'years', '1'),
        num('expenses', 'Investment Costs/Fees', '$', '0'),
        num('tax_rate', 'Tax Rate on Profit', '%', '0'),
        num('inflation', 'Inflation Rate', '%', '0')
      ] 
    },
    { 
      id: 'salary', 
      categoryId: CategoryId.FINANCIAL, 
      name: 'Hourly to Salary', 
      description: 'Convert hourly wage to annual income including overtime.', 
      inputs: [
        num('hourly', 'Hourly Rate', '$'), 
        num('hours', 'Regular Hours / Week', 'hrs', '40'),
        num('weeks', 'Weeks Worked / Year', 'wks', '52'),
        num('overtime_hours', 'Overtime Hours / Week', 'hrs', '0'),
        num('overtime_rate', 'Overtime Multiplier', 'x', '1.5', '1.5')
      ] 
    },
    { 
      id: 'vat', 
      categoryId: CategoryId.FINANCIAL, 
      name: 'VAT / Sales Tax', 
      description: 'Add or remove tax from a price.', 
      inputs: [
        num('amount', 'Amount', '$'), 
        num('tax', 'Tax Rate', '%'),
        select('mode', 'Calculation Mode', ['Add Tax (Net to Gross)', 'Remove Tax (Gross to Net)'])
      ] 
    },
    { 
      id: 'break-even', 
      categoryId: CategoryId.FINANCIAL, 
      name: 'Break-Even Analysis', 
      description: 'Determine units needed to cover costs.', 
      inputs: [
        num('fixed', 'Total Fixed Costs', '$'), 
        num('variable', 'Variable Cost / Unit', '$'), 
        num('price', 'Selling Price / Unit', '$'),
        num('expected', 'Expected Sales', 'units', '0')
      ] 
    },
    { id: 'margin', categoryId: CategoryId.FINANCIAL, name: 'Profit Margin', description: 'Calculate gross and net margin.', inputs: [num('cost', 'Cost', '$'), num('revenue', 'Revenue', '$')] },
    { id: 'rule-72', categoryId: CategoryId.FINANCIAL, name: 'Rule of 72', description: 'Years to double your money.', inputs: [num('rate', 'Interest Rate', '%')] },
    { id: 'credit-payoff', categoryId: CategoryId.FINANCIAL, name: 'Credit Card Payoff', description: 'Months to clear debt.', inputs: [num('balance', 'Balance', '$'), num('rate', 'APR', '%'), num('payment', 'Monthly Payment', '$')] },
    { id: 'net-worth', categoryId: CategoryId.FINANCIAL, name: 'Net Worth', description: 'Assets minus liabilities.', inputs: [num('assets', 'Total Assets', '$'), num('liabilities', 'Total Liabilities', '$')] },
    { id: 'inflation', categoryId: CategoryId.FINANCIAL, name: 'Inflation Calculator', description: 'Future value of money.', inputs: [num('amount', 'Present Amount', '$'), num('rate', 'Inflation Rate', '%'), num('years', 'Years', 'yrs')] },
    { id: 'down-payment', categoryId: CategoryId.FINANCIAL, name: 'Down Payment Goal', description: 'Time to save for a house.', inputs: [num('goal', 'Target Amount', '$'), num('savings', 'Current Savings', '$'), num('monthly', 'Monthly Savings', '$')] },
    { id: 'cd-ladder', categoryId: CategoryId.FINANCIAL, name: 'CD Calculator', description: 'Certificate of Deposit returns.', inputs: [num('deposit', 'Deposit Amount', '$'), num('rate', 'APY', '%'), num('months', 'Term', 'months')] },
  );

  // --- 2. HEALTH (15) ---
  list.push(
    { 
      id: 'bmi', 
      categoryId: CategoryId.HEALTH, 
      name: 'BMI Calculator', 
      description: 'Body Mass Index with category.', 
      popular: true, 
      inputs: [
        num('weight', 'Weight', 'lbs', '160'), 
        num('height_ft', 'Height (Feet)', 'ft', '5'),
        num('height_in', 'Height (Inches)', 'in', '9')
      ] 
    },
    { 
      id: 'bmr', 
      categoryId: CategoryId.HEALTH, 
      name: 'BMR & TDEE', 
      description: 'Basal Metabolic Rate & Total Energy Expenditure.', 
      inputs: [
        num('weight', 'Weight', 'lbs'), 
        num('height_ft', 'Height (Feet)', 'ft'),
        num('height_in', 'Height (Inches)', 'in'), 
        num('age', 'Age', 'years'), 
        select('gender', 'Gender', ['Male', 'Female']),
        select('activity', 'Activity Level', ['Sedentary (Office Job)', 'Lightly Active (1-3 days)', 'Moderately Active (3-5 days)', 'Very Active (6-7 days)', 'Super Active (Physical Job)'])
      ] 
    },
    { id: 'water-intake', categoryId: CategoryId.HEALTH, name: 'Water Intake', description: 'Daily hydration needs.', inputs: [num('weight', 'Weight', 'lbs')] },
    { id: 'body-fat', categoryId: CategoryId.HEALTH, name: 'Body Fat (Navy)', description: 'Estimate body fat percentage.', inputs: [select('gender', 'Gender', ['Male', 'Female']), num('waist', 'Waist', 'in'), num('neck', 'Neck', 'in'), num('height', 'Height', 'in'), num('hip', 'Hip (Women only)', 'in', '0')] },
    { id: 'ideal-weight', categoryId: CategoryId.HEALTH, name: 'Ideal Weight', description: 'Based on Robinson formula.', inputs: [select('gender', 'Gender', ['Male', 'Female']), num('height_ft', 'Height (Feet)', 'ft'), num('height_in', 'Height (Inches)', 'in')] },
    { id: 'macros', categoryId: CategoryId.HEALTH, name: 'Macro Split', description: 'Daily protein, carbs, fats.', inputs: [num('cals', 'Daily Calories', 'kcal'), select('goal', 'Goal', ['Maintenance', 'Cutting', 'Bulking'])] },
    { id: 'hr-max', categoryId: CategoryId.HEALTH, name: 'Max Heart Rate', description: 'Target zones for training.', inputs: [num('age', 'Age', 'years')] },
    { id: 'bac', categoryId: CategoryId.HEALTH, name: 'BAC Estimator', description: 'Blood Alcohol Content.', inputs: [num('drinks', 'Drinks', 'count'), num('weight', 'Weight', 'lbs'), num('hours', 'Hours Since First Drink', 'hrs'), select('gender', 'Gender', ['Male', 'Female'])] },
    { id: 'calorie-deficit', categoryId: CategoryId.HEALTH, name: 'Calorie Deficit', description: 'Time to lose weight.', inputs: [num('maintenance', 'Maintenance Cals', 'kcal'), num('intake', 'Daily Intake', 'kcal'), num('goal_loss', 'Goal Loss', 'lbs')] },
    { id: 'sleep', categoryId: CategoryId.HEALTH, name: 'Sleep Calculator', description: 'Wake up times based on cycles.', inputs: [select('wake_hour', 'Wake Hour', ['6', '7', '8', '9']), select('wake_min', 'Wake Minute', ['00', '15', '30', '45']), select('ampm', 'AM/PM', ['AM', 'PM'])] },
    { id: 'waist-hip', categoryId: CategoryId.HEALTH, name: 'Waist-to-Hip Ratio', description: 'Health risk indicator.', inputs: [num('waist', 'Waist', 'in'), num('hip', 'Hip', 'in')] },
    { id: 'protein', categoryId: CategoryId.HEALTH, name: 'Protein Intake', description: 'Daily protein needs.', inputs: [num('weight', 'Weight', 'lbs'), select('activity', 'Activity', ['Sedentary', 'Active', 'Athlete'])] },
    { id: 'smoking-cost', categoryId: CategoryId.HEALTH, name: 'Smoking Cost', description: 'Financial cost of smoking.', inputs: [num('packs', 'Packs per Day', 'count'), num('price', 'Price per Pack', '$'), num('years', 'Years', 'yrs')] },
    { id: 'pregnancy', categoryId: CategoryId.HEALTH, name: 'Due Date', description: 'Estimated delivery date.', inputs: [num('month', 'Last Period Month', '1-12'), num('day', 'Last Period Day', '1-31'), num('year', 'Last Period Year', 'YYYY')] },
    { id: 'step-convert', categoryId: CategoryId.HEALTH, name: 'Steps to Miles', description: 'Distance from steps.', inputs: [num('steps', 'Steps', 'count'), num('height', 'Height', 'in')] },
  );

  // --- 3. MATH (20) ---
  list.push(
    { id: 'percentage', categoryId: CategoryId.MATH, name: 'Percentage', description: 'Simple percentage calculations.', popular: true, inputs: [num('val', 'Value'), num('percent', 'Percentage', '%')] },
    { id: 'circle', categoryId: CategoryId.MATH, name: 'Circle', description: 'Area and circumference.', inputs: [num('radius', 'Radius', 'units')] },
    { id: 'fraction-add', categoryId: CategoryId.MATH, name: 'Add Fractions', description: 'Add two fractions.', inputs: [num('n1', 'Num 1'), num('d1', 'Denom 1'), num('n2', 'Num 2'), num('d2', 'Denom 2')] },
    { id: 'gcf-lcm', categoryId: CategoryId.MATH, name: 'GCF & LCM', description: 'Greatest Common Factor.', inputs: [num('a', 'Number A'), num('b', 'Number B')] },
    { id: 'mean-median', categoryId: CategoryId.MATH, name: 'Mean Median Mode', description: 'Stats for a list of numbers.', inputs: [txt('list', 'Numbers (comma separated)', '1, 2, 3...')] },
    { id: 'pythagorean', categoryId: CategoryId.MATH, name: 'Pythagorean Thm', description: 'Find hypotenuse.', inputs: [num('a', 'Side A'), num('b', 'Side B')] },
    { id: 'slope', categoryId: CategoryId.MATH, name: 'Slope Calculator', description: 'Slope between two points.', inputs: [num('x1', 'X1'), num('y1', 'Y1'), num('x2', 'X2'), num('y2', 'Y2')] },
    { id: 'quadratic', categoryId: CategoryId.MATH, name: 'Quadratic Formula', description: 'Solve ax² + bx + c = 0.', inputs: [num('a', 'a'), num('b', 'b'), num('c', 'c')] },
    { id: 'factorial', categoryId: CategoryId.MATH, name: 'Factorial', description: 'Calculate n!', inputs: [num('n', 'Number (n)')] },
    { id: 'permutation', categoryId: CategoryId.MATH, name: 'Permutations (nPr)', description: 'Ordered arrangements.', inputs: [num('n', 'n'), num('r', 'r')] },
    { id: 'combination', categoryId: CategoryId.MATH, name: 'Combinations (nCr)', description: 'Unordered selections.', inputs: [num('n', 'n'), num('r', 'r')] },
    { id: 'log', categoryId: CategoryId.MATH, name: 'Logarithm', description: 'Log base b of x.', inputs: [num('x', 'Value (x)'), num('b', 'Base (b)', '', '10')] },
    { id: 'random', categoryId: CategoryId.MATH, name: 'Random Number', description: 'Generate number in range.', inputs: [num('min', 'Min'), num('max', 'Max')] },
    { id: 'prime', categoryId: CategoryId.MATH, name: 'Prime Checker', description: 'Is it prime?', inputs: [num('n', 'Number')] },
    { id: 'std-dev', categoryId: CategoryId.MATH, name: 'Standard Deviation', description: 'Population SD.', inputs: [txt('list', 'Numbers (comma separated)')] },
    { id: 'triangle-area', categoryId: CategoryId.MATH, name: 'Triangle Area', description: 'Base and Height.', inputs: [num('base', 'Base'), num('height', 'Height')] },
    { id: 'cone-vol', categoryId: CategoryId.MATH, name: 'Cone Volume', description: 'Volume of a cone.', inputs: [num('radius', 'Radius'), num('height', 'Height')] },
    { id: 'sphere-vol', categoryId: CategoryId.MATH, name: 'Sphere Volume', description: 'Volume of a sphere.', inputs: [num('radius', 'Radius')] },
    { id: 'cylinder-vol', categoryId: CategoryId.MATH, name: 'Cylinder Volume', description: 'Volume of a cylinder.', inputs: [num('radius', 'Radius'), num('height', 'Height')] },
    { id: 'cube', categoryId: CategoryId.MATH, name: 'Cube Calculator', description: 'Surface area and volume.', inputs: [num('side', 'Side Length')] },
  );

  // --- 4. PHYSICS (12) ---
  list.push(
    { id: 'velocity', categoryId: CategoryId.PHYSICS, name: 'Velocity', description: 'Speed, distance, time.', inputs: [num('distance', 'Distance'), num('time', 'Time')] },
    { id: 'force', categoryId: CategoryId.PHYSICS, name: 'Force (F=ma)', description: 'Newton\'s Second Law.', inputs: [num('mass', 'Mass', 'kg'), num('acceleration', 'Acceleration', 'm/s²')] },
    { id: 'ohms-law', categoryId: CategoryId.PHYSICS, name: 'Ohm\'s Law', description: 'Voltage, Current, Resistance.', inputs: [num('i', 'Current (I)', 'Amps'), num('r', 'Resistance (R)', 'Ω')] },
    { id: 'kinetic-energy', categoryId: CategoryId.PHYSICS, name: 'Kinetic Energy', description: 'Energy of motion.', inputs: [num('mass', 'Mass', 'kg'), num('velocity', 'Velocity', 'm/s')] },
    { id: 'potential-energy', categoryId: CategoryId.PHYSICS, name: 'Potential Energy', description: 'Gravitational PE.', inputs: [num('mass', 'Mass', 'kg'), num('height', 'Height', 'm')] },
    { id: 'power', categoryId: CategoryId.PHYSICS, name: 'Power', description: 'Work over time.', inputs: [num('work', 'Work', 'J'), num('time', 'Time', 's')] },
    { id: 'work', categoryId: CategoryId.PHYSICS, name: 'Work', description: 'Force x Distance.', inputs: [num('force', 'Force', 'N'), num('distance', 'Distance', 'm')] },
    { id: 'momentum', categoryId: CategoryId.PHYSICS, name: 'Momentum', description: 'Mass x Velocity.', inputs: [num('mass', 'Mass', 'kg'), num('velocity', 'Velocity', 'm/s')] },
    { id: 'pressure', categoryId: CategoryId.PHYSICS, name: 'Pressure', description: 'Force per Area.', inputs: [num('force', 'Force', 'N'), num('area', 'Area', 'm²')] },
    { id: 'frequency', categoryId: CategoryId.PHYSICS, name: 'Frequency', description: 'From Wavelength.', inputs: [num('wavelength', 'Wavelength', 'm'), num('speed', 'Speed', 'm/s', '343')] },
    { id: 'torque', categoryId: CategoryId.PHYSICS, name: 'Torque', description: 'Rotational force.', inputs: [num('force', 'Force', 'N'), num('radius', 'Radius', 'm')] },
    { id: 'density-phys', categoryId: CategoryId.PHYSICS, name: 'Density', description: 'Material density.', inputs: [num('mass', 'Mass', 'kg'), num('volume', 'Volume', 'm³')] },
  );

  // --- 5. CHEMISTRY (10) ---
  list.push(
    { id: 'molarity', categoryId: CategoryId.CHEMISTRY, name: 'Molarity', description: 'Calculate molar concentration.', inputs: [num('mass', 'Mass of Solute', 'g'), num('molar_mass', 'Molar Mass', 'g/mol'), num('volume', 'Volume of Solution', 'L')] },
    { id: 'density-chem', categoryId: CategoryId.CHEMISTRY, name: 'Density', description: 'Mass and volume.', inputs: [num('mass', 'Mass', 'g'), num('volume', 'Volume', 'mL')] },
    { id: 'boyles', categoryId: CategoryId.CHEMISTRY, name: 'Boyle\'s Law', description: 'P1V1 = P2V2', inputs: [num('p1', 'P1'), num('v1', 'V1'), num('p2', 'P2')] },
    { id: 'charles', categoryId: CategoryId.CHEMISTRY, name: 'Charles\'s Law', description: 'V1/T1 = V2/T2', inputs: [num('v1', 'V1'), num('t1', 'T1 (K)'), num('v2', 'V2')] },
    { id: 'ideal-gas', categoryId: CategoryId.CHEMISTRY, name: 'Ideal Gas Law', description: 'PV = nRT (Calc n)', inputs: [num('p', 'Pressure (atm)'), num('v', 'Volume (L)'), num('t', 'Temp (K)')] },
    { id: 'ph', categoryId: CategoryId.CHEMISTRY, name: 'pH Calculator', description: 'From H+ concentration.', inputs: [num('h', 'H+ Concentration', 'M')] },
    { id: 'dilution', categoryId: CategoryId.CHEMISTRY, name: 'Dilution', description: 'M1V1 = M2V2', inputs: [num('m1', 'M1'), num('v1', 'V1'), num('m2', 'M2')] },
    { id: 'half-life', categoryId: CategoryId.CHEMISTRY, name: 'Half Life', description: 'Remaining quantity.', inputs: [num('n0', 'Initial Amount'), num('t', 'Time Elapsed'), num('h', 'Half Life')] },
    { id: 'molality', categoryId: CategoryId.CHEMISTRY, name: 'Molality', description: 'Moles per kg solvent.', inputs: [num('moles', 'Moles Solute'), num('kg', 'Kg Solvent')] },
    { id: 'percent-yield', categoryId: CategoryId.CHEMISTRY, name: 'Percent Yield', description: 'Actual vs Theoretical.', inputs: [num('actual', 'Actual Yield'), num('theoretical', 'Theoretical Yield')] },
  );

  // --- 6. CONSTRUCTION (12) ---
  list.push(
    { 
      id: 'concrete', 
      categoryId: CategoryId.CONSTRUCTION, 
      name: 'Concrete Calculator', 
      description: 'Calculate concrete bags and cubic yards with waste factor.', 
      popular: true, 
      inputs: [
        num('length', 'Length', 'ft'), 
        num('width', 'Width', 'ft'), 
        num('depth', 'Depth', 'in'),
        num('quantity', 'Quantity', 'slabs', '1'),
        num('waste', 'Waste Margin', '%', '10', '10'),
        select('bag_size', 'Premix Bag Size', ['40 lb', '50 lb', '60 lb', '80 lb'])
      ] 
    },
    { id: 'paint', categoryId: CategoryId.CONSTRUCTION, name: 'Paint', description: 'Gallons for walls.', inputs: [num('sqft', 'Wall Area', 'sq ft')] },
    { 
      id: 'tile', 
      categoryId: CategoryId.CONSTRUCTION, 
      name: 'Tile Calculator', 
      description: 'Tiles needed for floor including grout spacing.', 
      inputs: [
        num('length', 'Room Length', 'ft'), 
        num('width', 'Room Width', 'ft'), 
        num('tile_width', 'Tile Width', 'in'),
        num('tile_height', 'Tile Height', 'in'),
        num('waste', 'Waste Margin', '%', '15', '15')
      ] 
    },
    { id: 'carpet', categoryId: CategoryId.CONSTRUCTION, name: 'Carpet', description: 'Sq yards needed.', inputs: [num('length', 'Length', 'ft'), num('width', 'Width', 'ft')] },
    { id: 'mulch', categoryId: CategoryId.CONSTRUCTION, name: 'Mulch / Soil', description: 'Cubic yards for garden.', inputs: [num('length', 'Length', 'ft'), num('width', 'Width', 'ft'), num('depth', 'Depth', 'in')] },
    { id: 'gravel', categoryId: CategoryId.CONSTRUCTION, name: 'Gravel', description: 'Tons of gravel needed.', inputs: [num('length', 'Length', 'ft'), num('width', 'Width', 'ft'), num('depth', 'Depth', 'in')] },
    { id: 'drywall', categoryId: CategoryId.CONSTRUCTION, name: 'Drywall Sheets', description: '4x8 sheets needed.', inputs: [num('sqft', 'Wall/Ceiling Area', 'sq ft')] },
    { id: 'roof-pitch', categoryId: CategoryId.CONSTRUCTION, name: 'Roof Pitch', description: 'Angle of roof.', inputs: [num('rise', 'Rise'), num('run', 'Run')] },
    { id: 'board-foot', categoryId: CategoryId.CONSTRUCTION, name: 'Board Foot', description: 'Lumber volume.', inputs: [num('thick', 'Thickness', 'in'), num('width', 'Width', 'in'), num('length', 'Length', 'ft')] },
    { id: 'wallpaper', categoryId: CategoryId.CONSTRUCTION, name: 'Wallpaper', description: 'Rolls needed.', inputs: [num('width', 'Wall Width', 'ft'), num('height', 'Wall Height', 'ft')] },
    { id: 'btu', categoryId: CategoryId.CONSTRUCTION, name: 'AC BTU', description: 'Cooling power needed.', inputs: [num('sqft', 'Room Area', 'sq ft')] },
    { id: 'stairs', categoryId: CategoryId.CONSTRUCTION, name: 'Stairs', description: 'Steps count.', inputs: [num('rise', 'Total Rise', 'in'), num('run', 'Step Run', 'in', '10')] },
  );

  // --- 7. SPORTS (10) ---
  list.push(
    { id: 'running-pace', categoryId: CategoryId.SPORTS, name: 'Running Pace', description: 'Calculate pace per mile/km.', inputs: [num('distance', 'Distance', 'miles'), num('time_min', 'Time (Minutes)', 'min'), num('time_sec', 'Time (Seconds)', 'sec')] },
    { id: 'era', categoryId: CategoryId.SPORTS, name: 'Baseball ERA', description: 'Earned Run Average.', inputs: [num('runs', 'Earned Runs'), num('innings', 'Innings Pitched')] },
    { id: 'qb-rating', categoryId: CategoryId.SPORTS, name: 'QB Rating', description: 'NFL Passer Rating.', inputs: [num('att', 'Attempts'), num('comp', 'Completions'), num('yds', 'Yards'), num('td', 'Touchdowns'), num('int', 'Interceptions')] },
    { id: 'one-rep-max', categoryId: CategoryId.SPORTS, name: '1 Rep Max', description: 'Max weight estimate.', inputs: [num('weight', 'Weight Lifted', 'lbs'), num('reps', 'Reps Performed')] },
    { id: 'cricket-nrr', categoryId: CategoryId.SPORTS, name: 'Net Run Rate', description: 'Cricket ranking stat.', inputs: [num('runs_scored', 'Runs Scored'), num('overs_faced', 'Overs Faced'), num('runs_conceded', 'Runs Conceded'), num('overs_bowled', 'Overs Bowled')] },
    { id: 'basketball-per', categoryId: CategoryId.SPORTS, name: 'Efficiency (PER)', description: 'Simple efficiency.', inputs: [num('pts', 'Points'), num('reb', 'Rebounds'), num('ast', 'Assists'), num('stl', 'Steals'), num('blk', 'Blocks'), num('missed_fg', 'Missed FG'), num('missed_ft', 'Missed FT'), num('to', 'Turnovers'), num('gp', 'Games')] },
    { id: 'slugging', categoryId: CategoryId.SPORTS, name: 'Slugging %', description: 'Baseball power stat.', inputs: [num('s', 'Singles'), num('d', 'Doubles'), num('t', 'Triples'), num('hr', 'Home Runs'), num('ab', 'At Bats')] },
    { id: 'batting-avg', categoryId: CategoryId.SPORTS, name: 'Batting Avg', description: 'Hits / At Bats.', inputs: [num('hits', 'Hits'), num('ab', 'At Bats')] },
    { id: 'golf-handicap', categoryId: CategoryId.SPORTS, name: 'Golf Handicap', description: 'Course diff.', inputs: [num('score', 'Score'), num('rating', 'Course Rating'), num('slope', 'Slope Rating')] },
    { id: 'field-goal', categoryId: CategoryId.SPORTS, name: 'Field Goal %', description: 'Success rate.', inputs: [num('made', 'Made'), num('att', 'Attempted')] },
  );

  // --- 8. ECOLOGY (10) ---
  list.push(
    { id: 'carbon-drive', categoryId: CategoryId.ECOLOGY, name: 'Driving Carbon', description: 'CO2 from driving.', inputs: [num('distance', 'Miles Driven', 'miles'), num('mpg', 'Vehicle MPG', 'mpg')] },
    { id: 'electricity-cost', categoryId: CategoryId.ECOLOGY, name: 'Electricity Cost', description: 'Cost to run device.', inputs: [num('watts', 'Watts'), num('hours', 'Hours/Day'), num('rate', 'Cost (cents/kWh)', '¢')] },
    { id: 'water-shower', categoryId: CategoryId.ECOLOGY, name: 'Shower Water', description: 'Gallons used.', inputs: [num('min', 'Minutes'), num('gpm', 'Flow Rate (GPM)', 'gpm', '2.5')] },
    { id: 'plastic', categoryId: CategoryId.ECOLOGY, name: 'Plastic Waste', description: 'Bottles per year.', inputs: [num('daily', 'Bottles per Day')] },
    { id: 'solar', categoryId: CategoryId.ECOLOGY, name: 'Solar Potential', description: 'Panels needed.', inputs: [num('bill', 'Monthly Bill', '$'), num('sun', 'Peak Sun Hours', 'hrs', '5')] },
    { id: 'tree-offset', categoryId: CategoryId.ECOLOGY, name: 'Tree Offset', description: 'Trees to absorb CO2.', inputs: [num('co2', 'CO2 Emissions', 'lbs')] },
    { id: 'meat-carbon', categoryId: CategoryId.ECOLOGY, name: 'Meat Footprint', description: 'CO2 from beef.', inputs: [num('lbs', 'Lbs per Week')] },
    { id: 'recycling', categoryId: CategoryId.ECOLOGY, name: 'Recycling Impact', description: 'Energy saved (cans).', inputs: [num('cans', 'Aluminum Cans')] },
    { id: 'commute-cost', categoryId: CategoryId.ECOLOGY, name: 'Commute Cost', description: 'Yearly cost.', inputs: [num('miles', 'Miles One Way'), num('mpg', 'MPG'), num('price', 'Gas Price')] },
    { id: 'paper-waste', categoryId: CategoryId.ECOLOGY, name: 'Paper Waste', description: 'Trees consumed.', inputs: [num('reams', 'Reams per Month')] },
  );

  // --- 9. EVERYDAY (12) ---
  list.push(
    { id: 'fuel-cost', categoryId: CategoryId.EVERYDAY, name: 'Fuel Cost', description: 'Trip cost.', inputs: [num('distance', 'Distance', 'miles'), num('mpg', 'Vehicle MPG', 'mpg'), num('price', 'Gas Price', '$')] },
    { id: 'tip', categoryId: CategoryId.EVERYDAY, name: 'Tip Calculator', description: 'Gratuity split.', inputs: [num('bill', 'Bill Amount', '$'), num('percent', 'Tip Percentage', '%', '20', '20'), num('people', 'Split Among', 'people', '1', '1')] },
    { id: 'discount', categoryId: CategoryId.EVERYDAY, name: 'Discount', description: 'Sale savings.', inputs: [num('price', 'Original Price', '$'), num('discount', 'Discount', '%')] },
    { id: 'unit-price', categoryId: CategoryId.EVERYDAY, name: 'Unit Price', description: 'Best value.', inputs: [num('price', 'Price', '$'), num('units', 'Quantity/Weight')] },
    { 
      id: 'pizza-party', 
      categoryId: CategoryId.EVERYDAY, 
      name: 'Pizza Party', 
      description: 'Pizzas needed for a group.', 
      inputs: [
        num('adults', 'Number of Adults'), 
        num('children', 'Number of Children'),
        select('hunger', 'Hunger Level', ['Light Snack (1-2 slices)', 'Average (2-3 slices)', 'Starving (3-4 slices)']),
        select('size', 'Pizza Size', ['Small (6 slices)', 'Medium (8 slices)', 'Large (10 slices)', 'XL (12 slices)'])
      ] 
    },
    { id: 'aspect-ratio', categoryId: CategoryId.EVERYDAY, name: 'Aspect Ratio', description: 'Resize dimensions.', inputs: [num('w1', 'Original Width'), num('h1', 'Original Height'), num('w2', 'New Width')] },
    { id: 'screen-ppi', categoryId: CategoryId.EVERYDAY, name: 'Screen PPI', description: 'Pixel density.', inputs: [num('width', 'Width (px)'), num('height', 'Height (px)'), num('diag', 'Diagonal (in)')] },
    { id: 'bandwidth', categoryId: CategoryId.EVERYDAY, name: 'Download Time', description: 'Time to transfer.', inputs: [num('size', 'File Size (GB)'), num('speed', 'Speed (Mbps)')] },
    { id: 'coffee', categoryId: CategoryId.EVERYDAY, name: 'Coffee Ratio', description: 'Water to beans.', inputs: [num('water', 'Water (g/ml)'), num('ratio', 'Ratio (1:x)', '', '16')] },
    { id: 'age', categoryId: CategoryId.EVERYDAY, name: 'Age Calculator', description: 'Years alive.', inputs: [num('year', 'Birth Year')] },
    { id: 'time-duration', categoryId: CategoryId.EVERYDAY, name: 'Time Duration', description: 'Hours between.', inputs: [num('h1', 'Start Hour (24h)'), num('h2', 'End Hour (24h)')] },
    { id: 'reading-time', categoryId: CategoryId.EVERYDAY, name: 'Reading Time', description: 'Minutes to read.', inputs: [num('words', 'Word Count')] },
  );

  // --- 10. CONVERSIONS (12) ---
  list.push(
    { id: 'celsius-fahrenheit', categoryId: CategoryId.CONVERSIONS, name: 'C to F', description: 'Temp convert.', inputs: [num('celsius', 'Celsius', '°C')] },
    { id: 'fahrenheit-celsius', categoryId: CategoryId.CONVERSIONS, name: 'F to C', description: 'Temp convert.', inputs: [num('fahrenheit', 'Fahrenheit', '°F')] },
    { id: 'kg-lbs', categoryId: CategoryId.CONVERSIONS, name: 'Kg to Lbs', description: 'Weight.', inputs: [num('kg', 'Kilograms', 'kg')] },
    { id: 'lbs-kg', categoryId: CategoryId.CONVERSIONS, name: 'Lbs to Kg', description: 'Weight.', inputs: [num('lbs', 'Pounds', 'lbs')] },
    { id: 'miles-km', categoryId: CategoryId.CONVERSIONS, name: 'Miles to Km', description: 'Distance.', inputs: [num('miles', 'Miles')] },
    { id: 'km-miles', categoryId: CategoryId.CONVERSIONS, name: 'Km to Miles', description: 'Distance.', inputs: [num('km', 'Kilometers')] },
    { id: 'inch-cm', categoryId: CategoryId.CONVERSIONS, name: 'Inches to cm', description: 'Length.', inputs: [num('in', 'Inches')] },
    { id: 'cm-inch', categoryId: CategoryId.CONVERSIONS, name: 'cm to Inches', description: 'Length.', inputs: [num('cm', 'Centimeters')] },
    { id: 'oz-grams', categoryId: CategoryId.CONVERSIONS, name: 'Oz to Grams', description: 'Weight.', inputs: [num('oz', 'Ounces')] },
    { id: 'grams-oz', categoryId: CategoryId.CONVERSIONS, name: 'Grams to Oz', description: 'Weight.', inputs: [num('g', 'Grams')] },
    { id: 'liters-gal', categoryId: CategoryId.CONVERSIONS, name: 'Liters to Gal', description: 'Volume.', inputs: [num('l', 'Liters')] },
    { id: 'gal-liters', categoryId: CategoryId.CONVERSIONS, name: 'Gal to Liters', description: 'Volume.', inputs: [num('gal', 'Gallons')] },
  );

  return list;
};

export const CALCULATORS = generateCalculators();