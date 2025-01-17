import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { startDate, endDate, type } = await request.json();

    let data;
    const start = new Date(startDate);
    const end = new Date(endDate);

    switch (type) {
      case 'clicks':
        data = await prisma.affiliateClick.findMany({
          where: {
            timestamp: {
              gte: start,
              lte: end,
            },
          },
          include: {
            affiliate: {
              select: {
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            timestamp: 'desc',
          },
        });
        break;

      case 'earnings':
        data = await prisma.affiliateEarning.findMany({
          where: {
            createdAt: {
              gte: start,
              lte: end,
            },
          },
          include: {
            affiliate: {
              select: {
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
        break;

      default:
        throw new Error('Invalid report type');
    }

    // Convert data to CSV
    const csvContent = generateCSV(data, type);
    
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=affiliate-report-${type}-${startDate}.csv`,
      },
    });
  } catch (error) {
    console.error('Failed to generate report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}

function generateCSV(data: any[], type: string): string {
  if (!data.length) return '';

  const headers = Object.keys(data[0]).filter(key => 
    !key.includes('id') && key !== 'affiliate'
  );
  
  const rows = [
    ['Affiliate Name', 'Affiliate Email', ...headers].join(','),
    ...data.map(item => [
      item.affiliate?.name || '',
      item.affiliate?.email || '',
      ...headers.map(header => item[header] || '')
    ].join(','))
  ];

  return rows.join('\n');
} 