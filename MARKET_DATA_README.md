# UAE Real Estate Market Analytics

## Overview
This page displays comprehensive analytics of UAE real estate market data, including property sales transactions and rental contracts.

## Data Processing

### Python Script
Location: `scripts/generate_market_analytics.py`

This script processes the large CSV files and generates JSON files for the frontend:
- Input: `data-market/UAE/Transactions.csv` (1.5M+ transactions)
- Input: `data-market/UAE/Rent_Contracts.csv` (9.3M+ contracts)
- Output: `public/data/transactions_analytics.json`
- Output: `public/data/rent_analytics.json`

### Running the Script
```bash
python scripts/generate_market_analytics.py
```

The script will:
1. Read the CSV files in chunks to handle large datasets
2. Process dates and filter invalid data
3. Calculate statistics for the last available month
4. Aggregate data by year and month
5. Generate JSON files for the frontend

## Page Features

### URL
`/market` - Main market analytics page

### Sales Section
Displays 4 key metrics for the last month:
- **Most Expensive Deal**: Highest transaction value
- **Total Deals**: Number of transactions
- **Average Price**: Mean transaction value
- **Top Area**: Most active area by transaction count

### Rental Section
Displays 4 key metrics for the last month:
- **Highest Annual Rent**: Most expensive rental contract
- **Total Contracts**: Number of rental contracts
- **Average Rent**: Mean annual rent value
- **Top Area**: Most active rental area

### Interactive Charts
- Bar charts showing monthly transaction/contract volumes
- Year filters to view specific years or all data
- Hover tooltips showing detailed information
- Clean black and white design matching the site style

## Technology Stack
- **Next.js**: Server-side rendering and static generation
- **Recharts**: Chart library for visualizations
- **Framer Motion**: Smooth animations
- **Tailwind CSS**: Styling matching site design
- **Python + Pandas**: Data processing

## Data Structure

### JSON Format
```json
{
  "lastMonth": {
    "year": 2025,
    "month": 9,
    "mostExpensive": 490600000,
    "totalDeals": 12461,
    "averagePrice": 3005392.95,
    "mostSoldArea": "Al Barsha South Fourth"
  },
  "monthlyData": [
    {
      "year": 2020,
      "month": 1,
      "label": "2020-01",
      "count": 5234,
      "total_amount": 15678900000
    }
    // ... more months
  ]
}
```

## Updating Data

To update the market data:
1. Replace the CSV files in `data-market/UAE/`
2. Run `python scripts/generate_market_analytics.py`
3. Rebuild the Next.js site: `npm run build`

The page uses `getStaticProps`, so data is loaded at build time for optimal performance.

## Styling

The page follows the site's minimalist black and white design:
- Clean typography with Inter font
- Neutral color palette (black, white, grays)
- Subtle borders and spacing
- Responsive layout for all screen sizes
- Smooth animations with Framer Motion

## Navigation

The page is accessible from:
- Main navigation header: "Market Data" / "Данные рынка"
- Direct URL: `/market`
- Available in both English and Russian locales


