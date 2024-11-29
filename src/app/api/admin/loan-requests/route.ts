import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDB from '@/lib/db';
import { getModels } from '@/lib/models';
import { RequestStatus } from '@/models/LoanRequest';
import { Types } from 'mongoose';

interface LoanRequestBase {
  _id: Types.ObjectId;
  inventoryId: number;
  userId: Types.ObjectId;
  name: string;
  kuantitas: number;
  status: string;
  isReturned: boolean;
  returnedCondition: string;
  loanId: number;
  namaUser?: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
  __v: number;
}

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token?.sub || token.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    await connectDB();
    const { LoanRequestModel, UserModel, InventoryModel } = getModels();

    // Get all requests with status 'Proses'
    const pendingRequests = await LoanRequestModel.find({ 
      status: RequestStatus.Proses,
      isReturned: false 
    }).sort({ createdAt: -1 });

    // Get borrowed and returned items
    const [borrowed, returned] = await Promise.all([
      LoanRequestModel.find({ 
        status: RequestStatus.Delivered,
        isReturned: false 
      }),
      LoanRequestModel.find({ isReturned: true })
    ]);

    const combinedRequests = [...pendingRequests, ...borrowed, ...returned];
    console.log(combinedRequests);

    const loanRequestsWithDetails = await Promise.all(
      combinedRequests.map(async (request) => {
        const loanRequest = request.toObject() as LoanRequestBase;
        const [user, inventory] = await Promise.all([
          UserModel.findById(loanRequest.userId),
          InventoryModel.findOne({ id: loanRequest.inventoryId })
        ]);

        return {
          ...loanRequest,
          imageUrl: inventory?.imageUrl || loanRequest.imageUrl || '',
          namaUser: user?.name || 'Unknown User',
          product: {
            name: loanRequest.name,
            image: inventory?.imageUrl || loanRequest.imageUrl || '/placeholder.svg'
          },
          trackingId: `LR-${loanRequest.loanId}`,
          customer: user?.name || 'Unknown User',
          date: loanRequest.createdAt?.toLocaleDateString() || new Date().toLocaleDateString(),
          amount: loanRequest.kuantitas,
          status: loanRequest.status
        };
      })
    );

    console.log('Pending requests:', loanRequestsWithDetails.filter(req => 
      req.status === RequestStatus.Proses && !req.isReturned
    ));

    return NextResponse.json({
      pending: loanRequestsWithDetails.filter(req => 
        req.status === RequestStatus.Proses && !req.isReturned
      ),
      borrowed: loanRequestsWithDetails.filter(req => 
        req.status === RequestStatus.Delivered && !req.isReturned
      ),
      returned: loanRequestsWithDetails.filter(req => 
        req.isReturned === true
      )
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
    if (!token?.sub || token.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    await connectDB();
    const { LoanRequestModel } = getModels();

    const body = await req.json();
    const { status, loanId } = body;

    console.log('Received request:', { status, loanId });

    if (!status || !loanId) {
      return NextResponse.json(
        { message: 'Status and loanId are required' },
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

    if (loanRequest.status !== RequestStatus.Proses) {
      return NextResponse.json(
        { message: 'Loan request has been processed' },
        { status: 400 }
      );
    }

    // Update status based on action
    if (status === 'Terima') {
      loanRequest.status = RequestStatus.Delivered;
    } else if (status === 'Tolak') {
      loanRequest.status = RequestStatus.Canceled;
    } else {
      return NextResponse.json(
        { message: 'Invalid status value' },
        { status: 400 }
      );
    }

    await loanRequest.save();
    return NextResponse.json(loanRequest);
  } catch (error) {
    console.error('Update loan request error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { message: 'Failed to update loan request', error: errorMessage },
      { status: 500 }
    );
  }
} 