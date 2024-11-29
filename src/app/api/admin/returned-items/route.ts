import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDB from '@/lib/db';
import { getModels } from '@/lib/models';
import { RequestStatus, ReturnedCondition } from '@/models/LoanRequest';

export async function PATCH(req: NextRequest) {
  try {
    // Verify admin authentication
    const token = await getToken({ req });
    if (!token?.sub || token.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    await connectDB();
    const { LoanRequestModel } = getModels();

    const body = await req.json();
    const { loanId, returnedCondition } = body;

    console.log('Received request:', { loanId, returnedCondition });

    if (!returnedCondition) {
      return NextResponse.json(
        { message: 'Returned condition is required' },
        { status: 400 }
      );
    }

    const loanRequest = await LoanRequestModel.findOne({ loanId });
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

    // Update loan request
    loanRequest.isReturned = true;
    loanRequest.status = RequestStatus.Canceled;
    loanRequest.returnedCondition = returnedCondition as ReturnedCondition;
    await loanRequest.save();

    return NextResponse.json(loanRequest);
  } catch (error) {
    console.error('Update returned item error:', error);
    return NextResponse.json(
      { 
        message: error instanceof Error ? error.message : 'Failed to update returned item' 
      },
      { status: 500 }
    );
  }
} 