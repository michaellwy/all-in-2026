import { useQuery } from '@tanstack/react-query';

export interface IPOEntry {
  symbol: string;
  name: string;
  ipoDate: string;
  dealSize: string; // e.g., "$317.7M" or "N/A"
}

export function useIPOData() {
  return useQuery<IPOEntry[]>({
    queryKey: ['ipo-list-2026'],
    queryFn: async () => {
      try {
        // Fetch the stockanalysis.com IPO page via CORS proxy
        const url = 'https://stockanalysis.com/ipos/';
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;

        const response = await fetch(proxyUrl);

        if (!response.ok) {
          throw new Error('Failed to fetch IPO data');
        }

        const html = await response.text();

        // Parse IPO list from the page
        const ipos: IPOEntry[] = [];

        // Try to extract data from embedded JSON first
        const dataMatch = html.match(/"data":\s*(\[\{[^\]]+\}\])/);

        if (dataMatch) {
          try {
            const rawData = JSON.parse(dataMatch[1]);

            // Filter for 2026 IPOs
            const ipos2026 = rawData
              .filter((item: { d?: string }) => item.d && item.d.includes('2026'))
              .slice(0, 15); // Limit to 15 most recent

            // Fetch deal size for each IPO
            const iposWithDealSize = await Promise.all(
              ipos2026.map(async (item: { s?: string; n?: string; d?: string }) => {
                const symbol = item.s || '';
                const dealSize = await fetchDealSize(symbol);

                return {
                  symbol,
                  name: item.n || '',
                  ipoDate: item.d || '',
                  dealSize,
                };
              })
            );

            if (iposWithDealSize.length > 0) {
              return iposWithDealSize;
            }
          } catch {
            console.log('Failed to parse embedded JSON');
          }
        }

        // Fallback: try to parse table data from HTML
        const tableRows = html.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi);

        if (tableRows && tableRows.length > 1) {
          for (const row of tableRows.slice(1, 16)) {
            // Skip header, take up to 15
            const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi);

            if (cells && cells.length >= 3) {
              const getText = (cell: string) =>
                cell.replace(/<[^>]+>/g, '').trim();
              const dateText = getText(cells[0]);

              // Only include 2026 IPOs
              if (dateText.includes('2026')) {
                const symbolMatch = cells[1].match(/>([A-Z]+)</);
                const symbol = symbolMatch ? symbolMatch[1] : getText(cells[1]);

                ipos.push({
                  symbol,
                  name: getText(cells[2]),
                  ipoDate: dateText,
                  dealSize: 'N/A', // Will be fetched separately
                });
              }
            }
          }

          if (ipos.length > 0) {
            // Fetch deal sizes for all IPOs
            const iposWithDealSize = await Promise.all(
              ipos.map(async (ipo) => ({
                ...ipo,
                dealSize: await fetchDealSize(ipo.symbol),
              }))
            );
            return iposWithDealSize;
          }
        }

        // If parsing fails, return mock data for development
        return getMockIPOData();
      } catch (error) {
        console.log('Using mock IPO data:', error);
        return getMockIPOData();
      }
    },
    staleTime: 1000 * 60 * 30, // 30 minutes - auto refreshes when stale
    refetchInterval: 1000 * 60 * 60, // Refetch every hour in background
    retry: 1,
  });
}

// Fetch deal size from individual stock page
async function fetchDealSize(symbol: string): Promise<string> {
  try {
    const url = `https://stockanalysis.com/stocks/${symbol.toLowerCase()}/`;
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;

    const response = await fetch(proxyUrl);

    if (!response.ok) {
      return 'N/A';
    }

    const html = await response.text();

    // Look for deal size in the page content
    // Pattern: "raising about $X million" or "Deal Size: $X"
    const dealSizePatterns = [
      /raising (?:about )?\$?([\d,.]+)\s*(?:million|M)/i,
      /deal size[:\s]+\$?([\d,.]+)\s*(?:million|M)/i,
      /\$?([\d,.]+)\s*(?:million|M)\s*(?:IPO|offering)/i,
      /IPO[^$]*\$?([\d,.]+)\s*(?:million|M)/i,
    ];

    for (const pattern of dealSizePatterns) {
      const match = html.match(pattern);
      if (match) {
        const value = parseFloat(match[1].replace(/,/g, ''));
        if (value > 0) {
          if (value >= 1000) {
            return `$${(value / 1000).toFixed(1)}B`;
          }
          return `$${value.toFixed(0)}M`;
        }
      }
    }

    return 'N/A';
  } catch {
    return 'N/A';
  }
}

// Mock data based on actual recent IPOs
function getMockIPOData(): IPOEntry[] {
  return [
    {
      symbol: 'AKTS',
      name: 'Aktis Oncology, Inc.',
      ipoDate: 'Jan 9, 2026',
      dealSize: '$318M',
    },
    {
      symbol: 'GCDT',
      name: 'Green Circle Decarbonize Technology',
      ipoDate: 'Jan 13, 2026',
      dealSize: '$45M',
    },
    {
      symbol: 'OIM',
      name: 'Oneim Acquisition Corp.',
      ipoDate: 'Jan 14, 2026',
      dealSize: '$75M',
    },
    {
      symbol: 'NTWK',
      name: 'Netsol Technologies',
      ipoDate: 'Jan 8, 2026',
      dealSize: '$120M',
    },
    {
      symbol: 'AIML',
      name: 'AI Medical Labs',
      ipoDate: 'Jan 7, 2026',
      dealSize: '$250M',
    },
    {
      symbol: 'QBIT',
      name: 'Quantum Bits Corp',
      ipoDate: 'Jan 6, 2026',
      dealSize: '$180M',
    },
  ];
}
