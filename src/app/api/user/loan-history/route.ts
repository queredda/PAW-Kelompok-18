import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';
import { LoanStatus } from '@prisma/client';

interface LoanRequestWithInventory {
  id: string;
  requestNumber: string;
  name: string;
  kuantitas: number;
  status: LoanStatus;
  createdAt: Date;
  imageUrl?: string | null;
  isReturned: boolean;
  inventory?: {
    imageUrl?: string | null;
  };
}

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token?.sub) {
      return NextResponse.json(
        { message: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    const loanRequests = await prisma.loanRequest.findMany({
      where: {
        accountId: token.sub
      },
      include: {
        inventory: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const formatLoanRequest = (request: LoanRequestWithInventory) => ({
      ...request,
      imageUrl: request.inventory?.imageUrl || request.imageUrl || '',
      product: {
        name: request.name,
        image: request.inventory?.imageUrl || request.imageUrl || '/placeholder.svg'
      },
      trackingId: `LR-${request.requestNumber}`,
      date: request.createdAt.toLocaleDateString(),
      amount: request.kuantitas
    });

    return NextResponse.json({
      pending: loanRequests
        .filter(request => request.status === LoanStatus.PROSES)
        .map(formatLoanRequest),
      borrowed: loanRequests
        .filter(request => request.status === LoanStatus.DELIVERED)
        .map(formatLoanRequest),
      returned: loanRequests
        .filter(request => request.isReturned)
        .map(formatLoanRequest)
    });
  } catch (error) {
    console.error('Fetch user loan requests error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch loan requests' },
      { status: 500 }
    );
  }
} 