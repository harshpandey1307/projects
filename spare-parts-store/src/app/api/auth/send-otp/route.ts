import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateOTP, hashOTP, getOTPExpiryTime } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { serialNumber, mobileNumber } = body;

    // Validate input
    if (!serialNumber || !mobileNumber) {
      return NextResponse.json(
        { error: 'Serial number and mobile number are required' },
        { status: 400 }
      );
    }

    // Validate mobile number format (Indian mobile numbers)
    if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
      return NextResponse.json(
        { error: 'Invalid mobile number format' },
        { status: 400 }
      );
    }

    // Check if product with serial number exists
    const product = await prisma.product.findUnique({
      where: { serialNumber },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product with this serial number not found' },
        { status: 404 }
      );
    }

    // Check if customer exists with this mobile number
    let customer = await prisma.customer.findUnique({
      where: { mobileNumber },
    });

    // Check if customer has access to this product
    if (customer) {
      const customerProduct = await prisma.customerProduct.findFirst({
        where: {
          customerId: customer.id,
          productId: product.id,
        },
      });

      if (!customerProduct) {
        return NextResponse.json(
          { error: 'This mobile number is not registered for this product' },
          { status: 403 }
        );
      }
    } else {
      // For demo purposes, we'll create a new customer if they don't exist
      // In production, you might want to validate this differently
      customer = await prisma.customer.create({
        data: {
          mobileNumber,
          name: 'New Customer', // You might want to collect this in registration
        },
      });

      // Link customer to product
      await prisma.customerProduct.create({
        data: {
          customerId: customer.id,
          productId: product.id,
        },
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const hashedOtp = hashOTP(otp);
    const expiresAt = getOTPExpiryTime();

    // Invalidate any existing OTPs for this mobile number
    await prisma.otpVerification.updateMany({
      where: {
        mobileNumber,
        isExpired: false,
      },
      data: {
        isExpired: true,
      },
    });

    // Store OTP in database
    await prisma.otpVerification.create({
      data: {
        customerId: customer.id,
        mobileNumber,
        otp: hashedOtp,
        expiresAt,
      },
    });

    // In production, send SMS here
    // For demo, we'll log the OTP
    console.log(`OTP for ${mobileNumber}: ${otp}`);

    return NextResponse.json({
      message: 'OTP sent successfully',
      // Don't send OTP in response in production
      ...(process.env.NODE_ENV === 'development' && { otp }),
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}