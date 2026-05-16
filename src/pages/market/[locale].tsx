import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import { GetStaticProps, GetStaticPaths } from 'next';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useState, useEffect } from 'react';
import { getTranslations } from '@/lib/i18n';
import { generateBreadcrumbSchema } from '@/lib/seo';

interface MonthlyData {
  year: number;
  month: number;
  label: string;
  count: number;
  total_amount: number;
}

interface LastMonthData {
  year: number;
  month: number;
  mostExpensive: number;
  totalDeals: number;
  averagePrice: number;
  mostSoldArea: string;
}

interface AnalyticsData {
  lastMonth: LastMonthData;
  monthlyData: MonthlyData[];
}

interface MarketProps {
  transactionsData: AnalyticsData | null;
  rentData: AnalyticsData | null;
  locale: string;
}

const StatCard = ({ title, value }: { title: string; value: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="border border-neutral-200 p-6 bg-white"
  >
    <div className="text-sm text-neutral-500 mb-2 uppercase tracking-wider">{title}</div>
    <div className="text-2xl md:text-3xl font-light text-neutral-900">{value}</div>
  </motion.div>
);

const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(Math.round(num));
};

const formatCurrency = (num: number): string => {
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)}B AED`;
  }
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M AED`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K AED`;
  }
  return `${Math.round(num)} AED`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-neutral-200 shadow-lg">
        <p className="text-sm font-medium mb-2">{label}</p>
        <p className="text-sm text-neutral-600">
          Deals: <span className="font-medium text-neutral-900">{formatNumber(payload[0].value)}</span>
        </p>
        <p className="text-sm text-neutral-600">
          Total: <span className="font-medium text-neutral-900">{formatCurrency(payload[0].payload.total_amount)}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function Market({ transactionsData, rentData, locale }: MarketProps) {
  const t = getTranslations(locale);
  
  // Filter data from 2000 onwards (data is already filtered in the backend)
  const filteredTransactions = transactionsData?.monthlyData || [];
  const filteredRent = rentData?.monthlyData || [];

  const description = locale === 'ru'
    ? 'Комплексная аналитика продаж недвижимости и договоров аренды в Объединенных Арабских Эмиратах. Данные о сделках, средние цены, топ районы.'
    : 'Comprehensive analytics of property sales and rental contracts in the United Arab Emirates. Transaction data, average prices, top areas.';

  const structuredData = [
    generateBreadcrumbSchema([
      { name: t.nav.home, url: '/' },
      { name: t.nav.market, url: '/market/en' },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      name: 'UAE Real Estate Market Data',
      description: description,
      url: 'https://znn.today/market',
      creator: {
        '@type': 'Person',
        name: 'Nikolai Zaitsev',
      },
      keywords: ['UAE real estate', 'property sales', 'rental contracts', 'market analytics', 'Dubai real estate'],
      spatialCoverage: {
        '@type': 'Place',
        name: 'United Arab Emirates',
      },
    },
  ];

  return (
    <Layout title={t.market.title}>
      <SEO
        title={t.market.title}
        description={description}
        url={`https://znn.today/market/${locale}`}
        locale={locale}
        keywords={[
          'UAE real estate market',
          'Dubai property sales',
          'rental contracts UAE',
          'real estate analytics',
          'property market data',
          'UAE housing statistics',
          'proptech data',
        ]}
        structuredData={structuredData}
      />
      <div className="max-w-7xl mx-auto px-6 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-6 mb-6">
            {/* UAE Flag - Minimalist Style */}
            <div className="flex-shrink-0">
              <svg width="48" height="32" viewBox="0 0 48 32" className="border border-neutral-300">
                {/* Red vertical stripe */}
                <rect x="0" y="0" width="12" height="32" fill="#dc2626" />
                {/* Green horizontal stripe */}
                <rect x="12" y="0" width="36" height="10.67" fill="#16a34a" />
                {/* White horizontal stripe */}
                <rect x="12" y="10.67" width="36" height="10.67" fill="#ffffff" />
                {/* Black horizontal stripe */}
                <rect x="12" y="21.33" width="36" height="10.67" fill="#171717" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight">
              {t.market.title}
            </h1>
          </div>
          <p className="text-xl text-neutral-600 max-w-3xl">
            {t.market.subtitle}
          </p>
        </motion.div>

        {/* Sales Transactions Section */}
        {transactionsData && (
          <section className="mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-12 pb-4 border-b border-neutral-200">
                {t.market.sales.title}
              </h2>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatCard
                  title={t.market.sales.mostExpensive}
                  value={formatCurrency(transactionsData.lastMonth.mostExpensive)}
                />
                <StatCard
                  title={t.market.sales.totalDeals}
                  value={formatNumber(transactionsData.lastMonth.totalDeals)}
                />
                <StatCard
                  title={t.market.sales.averagePrice}
                  value={formatCurrency(transactionsData.lastMonth.averagePrice)}
                />
                <StatCard
                  title={t.market.sales.topArea}
                  value={transactionsData.lastMonth.mostSoldArea}
                />
              </div>

               {/* Chart */}
               <div className="bg-white border border-neutral-200 p-6">
                 <h3 className="text-lg font-light mb-6 text-neutral-700">{t.market.sales.monthlyVolume}</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={filteredTransactions}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: '#737373', fontSize: 12 }}
                      tickLine={{ stroke: '#e5e5e5' }}
                    />
                    <YAxis
                      tick={{ fill: '#737373', fontSize: 12 }}
                      tickLine={{ stroke: '#e5e5e5' }}
                      tickFormatter={(value) => formatNumber(value)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill="#171717" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </section>
        )}

        {/* Rental Contracts Section */}
        {rentData && (
          <section className="mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-12 pb-4 border-b border-neutral-200">
                {t.market.rental.title}
              </h2>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatCard
                  title={t.market.rental.highestRent}
                  value={formatCurrency(rentData.lastMonth.mostExpensive)}
                />
                <StatCard
                  title={t.market.rental.totalContracts}
                  value={formatNumber(rentData.lastMonth.totalDeals)}
                />
                <StatCard
                  title={t.market.rental.averageRent}
                  value={formatCurrency(rentData.lastMonth.averagePrice)}
                />
                <StatCard
                  title={t.market.rental.topArea}
                  value={rentData.lastMonth.mostSoldArea}
                />
              </div>

               {/* Chart */}
               <div className="bg-white border border-neutral-200 p-6">
                 <h3 className="text-lg font-light mb-6 text-neutral-700">{t.market.rental.monthlyContracts}</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={filteredRent}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: '#737373', fontSize: 12 }}
                      tickLine={{ stroke: '#e5e5e5' }}
                    />
                    <YAxis
                      tick={{ fill: '#737373', fontSize: 12 }}
                      tickLine={{ stroke: '#e5e5e5' }}
                      tickFormatter={(value) => formatNumber(value)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill="#171717" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </section>
        )}

        {/* Data Source Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-sm text-neutral-500 text-center"
        >
          {t.market.dataSource}
        </motion.div>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { locale: 'en' } },
      { params: { locale: 'ru' } }
    ],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const locale = params?.locale as string || 'en';
  const fs = require('fs');
  const path = require('path');

  let transactionsData = null;
  let rentData = null;

  try {
    const transactionsPath = path.join(process.cwd(), 'public', 'data', 'transactions_analytics.json');
    if (fs.existsSync(transactionsPath)) {
      const transactionsContent = fs.readFileSync(transactionsPath, 'utf-8');
      transactionsData = JSON.parse(transactionsContent);
    }
  } catch (error) {
    console.error('Error loading transactions data:', error);
  }

  try {
    const rentPath = path.join(process.cwd(), 'public', 'data', 'rent_analytics.json');
    if (fs.existsSync(rentPath)) {
      const rentContent = fs.readFileSync(rentPath, 'utf-8');
      rentData = JSON.parse(rentContent);
    }
  } catch (error) {
    console.error('Error loading rent data:', error);
  }

  return {
    props: {
      transactionsData,
      rentData,
      locale,
    },
  };
};
