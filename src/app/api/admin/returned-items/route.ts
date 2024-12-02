import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';
import { LoanStatus, ReturnCondition } from '@prisma/client';

export async function PATCH(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token?.sub || token.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const { requestNumber, returnedCondition } = await req.json();

    if (!returnedCondition) {
      return NextResponse.json(
        { message: 'Returned condition is required' },
        { status: 400 }
      );
    }

    const loanRequest = await prisma.loanRequest.findUnique({
      where: { requestNumber }
    });

    if (!loanRequest) {
      return NextResponse.json(
        { message: 'Loan request not found' },
        { status: 404 }
      );
    }

    if (loanRequest.isReturned) {
      return NextResponse.json(
        { message: 'Item has been returned' },
        { status: 400 }
      );
    }

    const updatedRequest = await prisma.loanRequest.update({
      where: { requestNumber },
      data: {
        isReturned: true,
        status: LoanStatus.COMPLETED,
        returnedCondition: returnedCondition as ReturnCondition,
      }
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error('Update returned item error:', error);
    return NextResponse.json(
      { message: 'Failed to update returned item' },
      { status: 500 }
    );
  }
}
