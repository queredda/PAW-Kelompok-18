import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';
import { LoanStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token?.sub || token.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // Fetch loan requests grouped by status
    const [pending, borrowed, returned] = await Promise.all([
      prisma.loanRequest.findMany({
        where: { 
          status: LoanStatus.PROSES,
          isReturned: false 
        },
        include: {
          account: {
            select: {
              username: true,
            },
          },
          inventory: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.loanRequest.findMany({
        where: { 
          status: LoanStatus.DELIVERED,
          isReturned: false 
        },
        include: {
          account: {
            select: {
              username: true,
            },
          },
          inventory: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.loanRequest.findMany({
        where: { 
          isReturned: true 
        },
        include: {
          account: {
            select: {
              username: true,
            },
          },
          inventory: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    return NextResponse.json({
      pending: pending.map(req => ({
        loanId: req.id,
        requestNumber: req.requestNumber,
        name: req.inventory.name,
        namaUser: req.account.username,
        kuantitas: req.kuantitas,
        status: req.status,
        isReturned: req.isReturned,
        returnedCondition: req.returnedCondition,
        createdAt: req.createdAt.toISOString(),
      })),
      borrowed: borrowed.map(req => ({
        loanId: req.id,
        requestNumber: req.requestNumber,
        name: req.inventory.name,
        namaUser: req.account.username,
        kuantitas: req.kuantitas,
        status: req.status,
        isReturned: req.isReturned,
        returnedCondition: req.returnedCondition,
        createdAt: req.createdAt.toISOString(),
      })),
      returned: returned.map(req => ({
        loanId: req.id,
        requestNumber: req.requestNumber,
        name: req.inventory.name,
        namaUser: req.account.username,
        kuantitas: req.kuantitas,
        status: req.status,
        isReturned: req.isReturned,
        returnedCondition: req.returnedCondition,
        createdAt: req.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Fetch loan requests error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch loan requests' },
      { status: 500 }
    );
  }
} 