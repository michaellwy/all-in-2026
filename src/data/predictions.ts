import type { Prediction } from '@/types';

export const predictions: Prediction[] = [
  // ============================================
  // Category 1: Biggest Political Winner (12:32)
  // ============================================
  {
    id: 'friedberg-political-winner',
    hostId: 'friedberg',
    categoryId: 'political-winner',
    prediction: 'Democratic Socialists of America (DSA)',
    rationale: `Just like the MAGA movement took over the Republican party, I think the DSA is taking over the Democratic party. And I think that's the move we'll see solidified in 2026.`,
    proxies: [], // No good quantifiable measure of DSA influence within the Democratic party
  },
  {
    id: 'chamath-political-winner',
    hostId: 'chamath',
    categoryId: 'political-winner',
    prediction: 'Anyone fighting waste, fraud & abuse',
    rationale: `Whoever is going to fight waste, fraud, and abuse at the federal, state, and local level. It's an open lane. It's a political gambit that I think will work really well in '26.`,
    proxies: [],
  },
  {
    id: 'sacks-political-winner',
    hostId: 'sacks',
    categoryId: 'political-winner',
    prediction: 'The Trump Boom',
    rationale: `The good economic news started breaking out before 2025 was even over. We have 2.7% inflation. Core CPI at 2.6. Both those are 40 basis points below expectations. 4.3% GDP growth in Q3. Lowest trade deficit since 2009... S&P 500 keeps making record highs. People are paying less for gas. Mortgage costs have fallen by $3,000. Real wages are up over $1,000. And by June, I predict we will see more rate cuts, possibly 75 to 100 basis points.`,
    proxies: [
      {
        id: 'gdp-growth',
        name: 'Gross Domestic Product (Percent Change from Year Ago)',
        type: 'fred',
        fredSeries: 'GDP',
        fredTransform: 'pc1',
        unit: '%',
        baseline: { value: 5, date: '2026-01-01', label: '5%' },
      },
    ],
  },
  {
    id: 'jason-political-winner',
    hostId: 'jason',
    categoryId: 'political-winner',
    prediction: 'The Mandami Moment / JD Vance',
    rationale: `Democrats believe the easiest way to win in 2026 is to go full socialist... He is the most popular politician clearly at Turning Point USA and he is the OG in the America first, America only moment.`,
    proxies: [
      {
        id: 'vance-2028-gop-nominee',
        name: 'JD Vance 2028 GOP Nominee',
        type: 'polymarket',
        polymarketSlug: 'will-jd-vance-win-the-2028-republican-presidential-nomination',
        polymarketTitle: 'Will JD Vance win the 2028 Republican presidential nomination?',
        polymarketUrl: 'https://polymarket.com/event/2028-republican-nomination',
        baseline: { value: 54, date: '2026-01-13', label: '54%' },
      },
      {
        id: 'vance-2028-president',
        name: 'JD Vance Wins 2028 Election',
        type: 'polymarket',
        polymarketSlug: 'will-jd-vance-win-the-2028-us-presidential-election',
        polymarketTitle: 'Will JD Vance win the 2028 US Presidential Election?',
        polymarketUrl: 'https://polymarket.com/event/presidential-election-winner-2028',
        baseline: { value: 29, date: '2026-01-13', label: '29%' },
      },
    ],
  },

  // ============================================
  // Category 2: Biggest Political Loser (17:47)
  // ============================================
  {
    id: 'friedberg-political-loser',
    hostId: 'friedberg',
    categoryId: 'political-loser',
    prediction: 'The Tech Industry',
    rationale: `AI and tech wealth have become the lightning rod for populism on both sides of the aisle. The right is fracturing a bit where this alliance between tech and MAGA seems to be getting a really strong challenge from the more populist movement. The left is turning hard on tech because of tech's alignment with the right.`,
    proxies: [],
  },
  {
    id: 'chamath-political-loser',
    hostId: 'chamath',
    categoryId: 'political-loser',
    prediction: 'The Monroe Doctrine',
    rationale: `There is a clear Trump doctrine that trumped the Monroe doctrine. We view this as hemispheric dominance. We view it as proactive and in very specific cases interventionist. We intervene against drug cartels. We control immigration. We secure vital assets. We have more transactional relationships.`,
    proxies: [],
  },
  {
    id: 'sacks-political-loser',
    hostId: 'sacks',
    categoryId: 'political-loser',
    prediction: 'Democratic Centrists',
    rationale: `Fewer than two dozen House races that are genuinely competitive going into 2026. That's because of gerrymandering. So if you're a Democrat incumbent who is in one of these districts, your only real threat to losing your office is from the left.`,
    proxies: [],
  },
  {
    id: 'jason-political-loser',
    hostId: 'jason',
    categoryId: 'political-loser',
    prediction: 'Democratic Centrists',
    rationale: `Same as Sacks`,
    proxies: [],
  },

  // ============================================
  // Category 3: Biggest Business Winner (32:16)
  // ============================================
  {
    id: 'friedberg-business-winner-1',
    hostId: 'friedberg',
    categoryId: 'business-winner',
    prediction: 'Huawei',
    rationale: `Huawei's effort to partner with SMIC to go deeper in the chip stack and they're just firing on all cylinders. It's going to outperform expectations, at least the western expectations.`,
    proxies: [
      {
        id: 'huawei-news',
        name: 'Latest Huawei News',
        type: 'news',
        newsQuery: 'Huawei',
        baseline: { value: 0, date: '2026-01-01', label: 'News feed' },
      },
    ],
  },
  {
    id: 'friedberg-business-winner-2',
    hostId: 'friedberg',
    categoryId: 'business-winner',
    prediction: 'Polymarket',
    rationale: `Polymarket's evolved from being kind of this one-off quirky prediction market to actually really providing insights into current events and the news in a way that none of us anticipated. Prediction markets could become not just markets but also news.`,
    proxies: [
      {
        id: 'polymarket-news',
        name: 'Latest Polymarket News',
        type: 'news',
        newsQuery: 'Polymarket',
        baseline: { value: 0, date: '2026-01-01', label: 'News feed' },
      },
    ],
  },
  {
    id: 'chamath-business-winner',
    hostId: 'chamath',
    categoryId: 'business-winner',
    prediction: 'Copper',
    rationale: `We are still completely underestimating how short we are in terms of the global demand supply dynamics... By 2040 we will be short about 70% of the global supply. It manifests in everything from our data centers to our chips to our weapon systems.`,
    proxies: [
      {
        id: 'copper-futures',
        name: 'Copper Futures (HG=F)',
        type: 'stock',
        ticker: 'HG=F',
        baseline: { value: 4.25, date: '2026-01-01', label: '$4.25/lb' },
        description: 'Actual copper price',
      },
    ],
  },
  {
    id: 'sacks-business-winner',
    hostId: 'sacks',
    categoryId: 'business-winner',
    prediction: 'The IPO Market',
    rationale: `I think 2026 is going to be a big year for IPOs. We could see trillions of dollars of new market cap created of public companies. Big reversal of the trend of companies staying private.`,
    proxies: [], // IPO list fetched from stockanalysis.com - see custom component
  },
  {
    id: 'jason-business-winner',
    hostId: 'jason',
    categoryId: 'business-winner',
    prediction: 'Amazon',
    rationale: `Amazon is going to have a massive year as they continue to replace humans with robots. I think they'll be the first corporate singularity which is to say the first company to have more robots driving their bottom line than humans.`,
    proxies: [
      {
        id: 'amzn',
        name: 'Amazon (AMZN)',
        type: 'stock',
        ticker: 'AMZN',
        baseline: { value: 220, date: '2026-01-01', label: '$220' },
      },
    ],
  },

  // ============================================
  // Category 4: Biggest Business Loser (40:51)
  // ============================================
  {
    id: 'friedberg-business-loser',
    hostId: 'friedberg',
    categoryId: 'business-loser',
    prediction: 'State Governments',
    rationale: `State governments are going to have a real problem with finding financing because what's going on with the exposés that are underway on waste, fraud, and abuse... The other thing that's going to hit the fan this year is all of these unrealized pension liabilities.`,
    proxies: [],
  },
  {
    id: 'chamath-business-loser',
    hostId: 'chamath',
    categoryId: 'business-loser',
    prediction: 'Legacy SaaS / Software Industrial Complex',
    rationale: `These are the companies that sell licensed SaaS to corporations of America. It's about a $3 to $4 trillion a year economy. Maintenance and migration represent 90% of all the dollars. AI agents will cause that to shrink and contract aggressively.`,
    proxies: [
      {
        id: 'orcl',
        name: 'Oracle (ORCL)',
        type: 'stock',
        ticker: 'ORCL',
        baseline: { value: 170, date: '2026-01-01', label: '$170' },
      },
      {
        id: 'sap',
        name: 'SAP',
        type: 'stock',
        ticker: 'SAP',
        baseline: { value: 250, date: '2026-01-01', label: '$250' },
      },
      {
        id: 'crm',
        name: 'Salesforce (CRM)',
        type: 'stock',
        ticker: 'CRM',
        baseline: { value: 340, date: '2026-01-01', label: '$340' },
      },
    ],
  },
  {
    id: 'sacks-business-loser',
    hostId: 'sacks',
    categoryId: 'business-loser',
    prediction: 'California',
    rationale: `California because of the wealth tax and also the onerous regulations driving business and capital out of the state. There's two major refineries closing by the spring. Higher gas prices will be the result.`,
    proxies: [],
  },
  {
    id: 'jason-business-loser',
    hostId: 'jason',
    categoryId: 'business-loser',
    prediction: 'Young White-Collar Workers',
    rationale: `It's getting really hard for them to get entry level jobs. Companies are having an easier job just automating with AI than training up Gen Z graduates.`,
    proxies: [
      {
        id: 'youth-unemployment',
        name: 'Unemployment Rate - 20-24 Yrs.',
        type: 'fred',
        fredSeries: 'LNS14000036',
        unit: '%',
        baseline: { value: 7.5, date: '2026-01-01', label: '7.5%' },
      },
    ],
  },

  // ============================================
  // Category 5: Biggest Business Deal (49:34)
  // ============================================
  {
    id: 'sacks-business-deal',
    hostId: 'sacks',
    categoryId: 'business-deal',
    prediction: 'Coding Assistants & Tool Use',
    rationale: `There was a breakthrough in the last couple of months in terms of these coding assistants... This trend feels to me like chatbots did at the end of 2022 going into '23.`,
    proxies: [],
  },
  {
    id: 'friedberg-business-deal',
    hostId: 'friedberg',
    categoryId: 'business-deal',
    prediction: 'Russia-Ukraine Settlement',
    rationale: `Russia Ukraine I think it's going to settle out this year. There's a lot of motivating factors. Economic and other political factors.`,
    proxies: [
      {
        id: 'ukraine-ceasefire',
        name: 'Ukraine Ceasefire Odds',
        type: 'polymarket',
        polymarketSlug: 'russia-x-ukraine-ceasefire-before-2027',
        polymarketTitle: 'Russia x Ukraine ceasefire by end of 2026?',
        polymarketUrl: 'https://polymarket.com/event/russia-x-ukraine-ceasefire-before-2027',
        baseline: { value: 50, date: '2026-01-13', label: '50%' },
      },
    ],
  },
  {
    id: 'chamath-business-deal',
    hostId: 'chamath',
    categoryId: 'business-deal',
    prediction: 'IP License M&A Workarounds',
    rationale: `M&A cannot happen. Traditional M&A is effectively dead. You'll do what Sundar did, what Satya did, what Jensen did. These huge licensing deals that basically replace M&A.`,
    proxies: [],
  },
  {
    id: 'jason-business-deal',
    hostId: 'jason',
    categoryId: 'business-deal',
    prediction: '$50B+ Big Tech Acquisition',
    rationale: `We're going to see a 50 billion plus deal. One of the Mag 7 —an Apple, a Meta, a Microsoft or an Amazon going out and trying to buy XAI, Mistral, Perplexity, Anthropic.`,
    proxies: [],
  },

  // ============================================
  // Category 6: Most Contrarian Belief (56:15)
  // ============================================
  {
    id: 'friedberg-contrarian',
    hostId: 'friedberg',
    categoryId: 'contrarian',
    prediction: 'Increased Arab State Conflict',
    rationale: `There is already this brewing conflict amongst the other Arab states. Between UAE, Saudi, Qatar... The contrarian point may in fact be that Iran has been a stabilizing force in that region and by removing Iran... this year could end up being a little bit nastier than folks anticipate... with more conflict brewing amongst the other Gulf states as they vie for influence and power.`,
    proxies: [
      {
        id: 'uae-yemen-strike',
        name: 'Will UAE strike Yemen by Jan 31, 2026?',
        type: 'polymarket',
        polymarketSlug: 'will-uae-strike-yemen-by-january-31',
        polymarketTitle: 'Will UAE strike Yemen by Jan 31, 2026?',
        polymarketUrl: 'https://polymarket.com/event/will-uae-strike-yemen-by-january-31',
        baseline: { value: 3, date: '2026-01-16', label: '3%' },
      },
    ],
  },
  {
    id: 'sacks-contrarian',
    hostId: 'sacks',
    categoryId: 'contrarian',
    prediction: 'AI Increases Knowledge Worker Demand',
    rationale: `I would refer you to Jevons paradox for knowledge workers. As the cost of a resource goes down, the aggregate demand for it actually increases because you discover more and more use cases.`,
    proxies: [
      {
        id: 'software-jobs',
        name: 'Job Openings: Information',
        type: 'fred',
        fredSeries: 'JTU5100JOL',
        unit: 'K openings',
        baseline: { value: 400, date: '2026-01-01', label: '400K' },
      },
    ],
  },
  {
    id: 'chamath-contrarian-1',
    hostId: 'chamath',
    categoryId: 'contrarian',
    prediction: 'SpaceX/Tesla Merger',
    rationale: `I don't think SpaceX will IPO. I think that it will reverse merge into Tesla and I think Elon will use it as a moment to consolidate control.`,
    proxies: [],
  },
  {
    id: 'chamath-contrarian-2',
    hostId: 'chamath',
    categoryId: 'contrarian',
    prediction: 'New Sovereign Crypto',
    rationale: `Central banks will seek out a completely new cryptographic paradigm that they can control on their balance sheet that is fungible, tradable and completely secure and private.`,
    proxies: [],
  },
  {
    id: 'jason-contrarian',
    hostId: 'jason',
    categoryId: 'contrarian',
    prediction: 'US-China Resolution',
    rationale: `The standoff with China is going to be largely resolved. The issues around Taiwan are going to be resolved. We work out a working relationship where both China and America win.`,
    proxies: [
      {
        id: 'taiwan-invasion',
        name: 'China/Taiwan Invasion Odds',
        type: 'polymarket',
        polymarketSlug: 'will-china-invade-taiwan-before-2027',
        polymarketTitle: 'Will China invade Taiwan by end of 2026?',
        polymarketUrl: 'https://polymarket.com/event/will-china-invade-taiwan-before-2027',
        baseline: { value: 5, date: '2026-01-13', label: '5%' },
        description: 'Lower = resolution playing out',
      },
    ],
  },

  // ============================================
  // Category 7: Best Performing Asset (1:03:05)
  // ============================================
  {
    id: 'friedberg-best-asset',
    hostId: 'friedberg',
    categoryId: 'best-asset',
    prediction: 'Polymarket',
    rationale: `On a tear. Network effects. Replacing media, replacing markets.`,
    proxies: [],
  },
  {
    id: 'chamath-best-asset-1',
    hostId: 'chamath',
    categoryId: 'best-asset',
    prediction: 'Critical Metals',
    rationale: `I would pick a basket of critical metals.`,
    proxies: [
      {
        id: 'remx',
        name: 'Rare Earth ETF (REMX)',
        type: 'etf',
        ticker: 'REMX',
        baseline: { value: 38, date: '2026-01-01', label: '$38' },
      },
    ],
  },
  {
    id: 'chamath-best-asset-2',
    hostId: 'chamath',
    categoryId: 'best-asset',
    prediction: 'Gambling/Wagering',
    rationale: `If we are in a rate cut environment and people have a little bit of cash laying around. Robinhood, Polymarket, PrizePicks.`,
    proxies: [
      {
        id: 'hood',
        name: 'Robinhood (HOOD)',
        type: 'stock',
        ticker: 'HOOD',
        baseline: { value: 40, date: '2026-01-01', label: '$40' },
      },
      {
        id: 'coin',
        name: 'Coinbase (COIN)',
        type: 'stock',
        ticker: 'COIN',
        baseline: { value: 260, date: '2026-01-01', label: '$260' },
      },
    ],
  },
  {
    id: 'sacks-best-asset',
    hostId: 'sacks',
    categoryId: 'best-asset',
    prediction: 'Tech Super Cycle',
    rationale: `The expanding super cycle in tech. US productivity just surged 4.9%, the strongest reading in nearly 6 years.`,
    proxies: [
      {
        id: 'qqq',
        name: 'Nasdaq 100 (QQQ)',
        type: 'etf',
        ticker: 'QQQ',
        baseline: { value: 525, date: '2026-01-01', label: '$525' },
      },
    ],
  },

  // ============================================
  // Category 8: Worst Performing Asset (1:08:02)
  // ============================================
  {
    id: 'sacks-worst-asset',
    hostId: 'sacks',
    categoryId: 'worst-asset',
    prediction: 'California Luxury Real Estate',
    rationale: `California luxury real estate because of the overhang of the wealth tax. The 5% mansion tax has just killed LA real estate.`,
    proxies: [
      {
        id: 'ca-luxury-index',
        name: 'Home Price Index (High Tier) for Los Angeles, CA',
        type: 'fred',
        fredSeries: 'LXXRHTNSA',
        baseline: { value: 350, date: '2026-01-01', label: 'Index 350' },
      },
    ],
  },
  {
    id: 'chamath-worst-asset',
    hostId: 'chamath',
    categoryId: 'worst-asset',
    prediction: 'Hydrocarbons / Oil',
    rationale: `The trend in oil is inexorable and it's down. Electrification and energy storage are just unstoppable. More likely to see $45 than $65 per barrel.`,
    proxies: [
      {
        id: 'brent-crude',
        name: 'Brent Crude Oil (BZ=F)',
        type: 'stock',
        ticker: 'BZ=F',
        baseline: { value: 76, date: '2026-01-01', label: '$76/barrel' },
      },
    ],
  },
  {
    id: 'jason-worst-asset',
    hostId: 'jason',
    categoryId: 'worst-asset',
    prediction: 'US Dollar',
    rationale: `Our debt continues to grow unabated. We're going to add two trillion in debt this year.`,
    proxies: [
      {
        id: 'dxy',
        name: 'US Dollar Index (DXY)',
        type: 'stock',
        ticker: 'DX-Y.NYB',
        baseline: { value: 108, date: '2026-01-01', label: '108' },
      },
    ],
  },
  {
    id: 'friedberg-worst-asset',
    hostId: 'friedberg',
    categoryId: 'worst-asset',
    prediction: 'Netflix (conditional)',
    rationale: `Netflix if they don't close the Warner Brother deal. They only pay creators cost plus 10% now. Creators would prefer not to work with Netflix anymore.`,
    proxies: [
      {
        id: 'nflx',
        name: 'Netflix (NFLX)',
        type: 'stock',
        ticker: 'NFLX',
        baseline: { value: 870, date: '2026-01-01', label: '$870' },
        description: 'Conditional on no Warner Brothers deal',
      },
    ],
  },

  // ============================================
  // Category 9: Most Anticipated Trend (1:15:17)
  // ============================================
  {
    id: 'friedberg-trend',
    hostId: 'friedberg',
    categoryId: 'trend',
    prediction: 'Democratic Revolution in Iran',
    rationale: `Iran becoming an independent democratic state. There's an uprising in the streets. Demographics are destiny. There's a lot of young people in Iran and they do not want to live under the current rule.`,
    proxies: [
      {
        id: 'khamenei-out',
        name: 'Khamenei out as Supreme Leader of Iran in 2026?',
        type: 'polymarket',
        polymarketSlug: 'khamenei-out-as-supreme-leader-of-iran-by-december-31-2026',
        polymarketTitle: 'Khamenei out as Supreme Leader of Iran in 2026?',
        polymarketUrl: 'https://polymarket.com/event/khamenei-out-as-supreme-leader-of-iran-by-december-31-2026',
        baseline: { value: 50, date: '2026-01-17', label: '50%' },
      },
      {
        id: 'iran-regime-fall',
        name: 'Will the Iranian regime fall before 2027?',
        type: 'polymarket',
        polymarketSlug: 'will-the-iranian-regime-fall-by-the-end-of-2026',
        polymarketTitle: 'Will the Iranian regime fall before 2027?',
        polymarketUrl: 'https://polymarket.com/event/will-the-iranian-regime-fall-by-the-end-of-2026',
        baseline: { value: 36, date: '2026-01-17', label: '36%' },
      },
    ],
  },
  {
    id: 'sacks-trend',
    hostId: 'sacks',
    categoryId: 'trend',
    prediction: 'Decentralized DOGE / Auditing Government',
    rationale: `Auditing government spending at all levels. Decentralized Doge. Let a thousand Nick Shirleys bloom. All government spending needs to be opened up and audited by the public.`,
    proxies: [],
  },
  {
    id: 'chamath-trend',
    hostId: 'chamath',
    categoryId: 'trend',
    prediction: 'Unilateralism / Economic Resilience',
    rationale: `The expansion of this Trump doctrine. If you are an economic actor, you must understand the movements on the chessboard in 2026. The best framework is this idea of unilateralism, economic resilience.`,
    proxies: [],
  },
  {
    id: 'jason-trend',
    hostId: 'jason',
    categoryId: 'trend',
    prediction: 'Mega IPO(s)',
    rationale: `Two of SpaceX, Anduril, Stripe, Anthropic, OpenAI will file. The public wants these shares.`,
    proxies: [
      {
        id: 'spacex-ipo',
        name: 'Will SpaceX IPO in 2026?',
        type: 'polymarket',
        polymarketSlug: 'spacex-space-exploration-technologies-corp-ipo-before-2027',
        polymarketTitle: 'SpaceX (Space Exploration Technologies Corp.) IPO before 2027?',
        polymarketUrl: 'https://polymarket.com/event/ipos-before-2027',
        baseline: { value: 75, date: '2026-01-16', label: '75%' },
      },
      {
        id: 'anduril-ipo',
        name: 'Will Anduril IPO in 2026?',
        type: 'polymarket',
        polymarketSlug: 'anduril-ipo-before-2027',
        polymarketTitle: 'Anduril IPO before 2027?',
        polymarketUrl: 'https://polymarket.com/event/ipos-before-2027',
        baseline: { value: 41, date: '2026-01-16', label: '41%' },
      },
      {
        id: 'stripe-ipo',
        name: 'Will Stripe IPO in 2026?',
        type: 'polymarket',
        polymarketSlug: 'stripe-ipo-before-2027',
        polymarketTitle: 'Stripe IPO before 2027?',
        polymarketUrl: 'https://polymarket.com/event/ipos-before-2027',
        baseline: { value: 29, date: '2026-01-16', label: '29%' },
      },
      {
        id: 'anthropic-ipo',
        name: 'Will Anthropic IPO in 2026?',
        type: 'polymarket',
        polymarketSlug: 'anthropic-ipo-before-2027',
        polymarketTitle: 'Anthropic IPO before 2027?',
        polymarketUrl: 'https://polymarket.com/event/ipos-before-2027',
        baseline: { value: 49, date: '2026-01-16', label: '49%' },
      },
      {
        id: 'openai-ipo',
        name: 'Will OpenAI IPO in 2026?',
        type: 'polymarket',
        polymarketSlug: 'openai-ipo-before-2027',
        polymarketTitle: 'OpenAI IPO before 2027?',
        polymarketUrl: 'https://polymarket.com/event/ipos-before-2027',
        baseline: { value: 28, date: '2026-01-16', label: '28%' },
      },
    ],
  },

];

// Helper functions
export function getPredictionsByCategory(categoryId: string): Prediction[] {
  return predictions.filter((p) => p.categoryId === categoryId);
}

export function getPredictionsByHost(hostId: string): Prediction[] {
  return predictions.filter((p) => p.hostId === hostId);
}
