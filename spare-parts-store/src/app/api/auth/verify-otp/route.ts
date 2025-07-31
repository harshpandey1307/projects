import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyOTP, isOTPExpired, generateJWT } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { serialNumber, mobileNumber, otp } = body;

    // Validate input
    if (!serialNumber || !mobileNumber || !otp) {
      return NextResponse.json(
        { error: 'Serial number, mobile number, and OTP are required' },
        { status: 400 }
      );
    }

    // Find the latest OTP for this mobile number
    const otpRecord = await prisma.otpVerification.findFirst({
      where: {
        mobileNumber,
        isExpired: false,
        isVerified: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        customer: true,
      },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: 'No valid OTP found. Please request a new OTP.' },
        { status: 400 }
      );
    }

    // Check if OTP is expired
    if (isOTPExpired(otpRecord.expiresAt)) {
      await prisma.otpVerification.update({
        where: { id: otpRecord.id },
        data: { isExpired: true },
      });

      return NextResponse.json(
        { error: 'OTP has expired. Please request a new OTP.' },
        { status: 400 }
      );
    }

    // Verify OTP
    if (!verifyOTP(otp, otpRecord.otp)) {
      return NextResponse.json(
        { error: 'Invalid OTP. Please try again.' },
        { status: 400 }
      );
    }

    // Mark OTP as verified
    await prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { isVerified: true },
    });

    // Get customer and product information
    const customer = otpRecord.customer;
    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { serialNumber },
      include: {
        spareParts: {
          where: { isActive: true },
          take: 5, // Limit to first 5 spare parts for initial load
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Generate JWT token
    const token = generateJWT({
      customerId: customer.id,
      mobileNumber: customer.mobileNumber,
    });

    // Return success response with customer and product info
    return NextResponse.json({
      message: 'OTP verified successfully',
      token,
      customer: {
        id: customer.id,
        name: customer.name,
        mobileNumber: customer.mobileNumber,
        email: customer.email,
      },
      product: {
        id: product.id,
        serialNumber: product.serialNumber,
        modelNumber: product.modelNumber,
        brand: product.brand,
        name: product.name,
        category: product.category,
        spareParts: product.spareParts,
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}