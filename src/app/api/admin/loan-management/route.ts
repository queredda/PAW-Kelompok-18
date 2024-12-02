import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';
import { LoanStatus } from '@prisma/client';

interface LoanRequestWithRelations {
  id: string;
  requestNumber: string;
  imageUrl?: string | null;
  status: LoanStatus;
  createdAt: Date;
  kuantitas: number;
  isReturned: boolean;
  name: string;
  account?: {
    username: string;
  };
  inventory?: {
    imageUrl?: string | null;
    name: string;
  };
}

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token?.sub || token.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const requests = await prisma.loanRequest.findMany({
      include: {
        account: {
          select: {
            username: true,
          },
        },
        inventory: {
          select: {
            imageUrl: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formatLoanRequest = (request: LoanRequestWithRelations) => ({
      ...request,
      imageUrl: request.inventory?.imageUrl || request.imageUrl || '',
      namaUser: request.account?.username || 'Unknown User',
      product: {
        name: request.name,
        image:
          request.inventory?.imageUrl || request.imageUrl || '/placeholder.svg',
      },
      trackingId: `LR-${request.requestNumber}`,
      customer: request.account?.username || 'Unknown User',
      date: request.createdAt.toLocaleDateString(),
      amount: request.kuantitas,
      status: request.status,
    });

    return NextResponse.json({
      pending: requests
        .filter((request) => request.status === LoanStatus.PROSES)
        .map(formatLoanRequest),
      borrowed: requests
        .filter((request) => request.status === LoanStatus.DELIVERED)
        .map(formatLoanRequest),
      returned: requests
        .filter((request) => request.isReturned)
        .map(formatLoanRequest),
    });
  } catch (error) {
    console.error('Fetch loan requests error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch loan requests' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token?.sub || token.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { status, requestNumber } = body;

    if (!status || !requestNumber) {
      return NextResponse.json(
        { message: 'Status and requestNumber are required' },
        { status: 400 }
      );
    }

    const loanRequest = await prisma.loanRequest.findUnique({
      where: { requestNumber },
    });

    if (!loanRequest) {
      return NextResponse.json(
        { message: 'Loan request not found' },
        { status: 404 }
      );
    }

    if (loanRequest.status !== 'PROSES') {
      return NextResponse.json(
        { message: 'Loan request has been processed' },
        { status: 400 }
      );
    }

    const updatedRequest = await prisma.loanRequest.update({
      where: { requestNumber },
      data: {
        status:
          status === 'Terima' ? LoanStatus.DELIVERED : LoanStatus.COMPLETED,
      },
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error('Update loan request error:', error);
    return NextResponse.json(
      { message: 'Failed to update loan request' },
      { status: 500 }
    );
  }
}
