import connectDB from '@/config/db';
import Order from '@/models/Order';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    const { oid, amt, refId, pid, orderId } = body;

    if (!oid || !amt || !refId || !pid || !orderId) {
      return NextResponse.json(
        { success: false, message: 'Missing required payment parameters' },
        { status: 400 }
      );
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify with eSewa
    const verificationResult = await verifyPaymentWithEsewa({
      amt,
      rid: refId,
      pid,
      scd: process.env.NEXT_PUBLIC_ESEWA_MERCHANT_CODE,
    });

    if (!verificationResult.success) {
      console.error('eSewa verification failed:', verificationResult.error);
      return NextResponse.json(
        { success: false, message: 'Payment verification failed with eSewa' },
        { status: 400 }
      );
    }

    // Update order
    order.paymentId = refId;
    order.paymentVerifiedAt = new Date();
    order.status = 'Payment Confirmed';
    await order.save();

    // Clear cart of user
    if (order.userId) {
      await User.findByIdAndUpdate(order.userId, { cartItems: {} });
    }

    console.log(`eSewa payment verified and order ${orderId} marked as confirmed`);

    return NextResponse.json(
      {
        success: true,
        message: 'Payment verified successfully',
        orderId,
        paymentId: refId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('eSewa payment verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Payment verification failed' },
      { status: 500 }
    );
  }
}

async function verifyPaymentWithEsewa({ amt, rid, pid, scd }) {
  try {
    const verificationUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://epay.esewa.com.np/epay/transrec'
        : 'https://uat.esewa.com.np/epay/transrec';

    const formData = new URLSearchParams();
    formData.append('amt', amt);
    formData.append('rid', rid);
    formData.append('pid', pid);
    formData.append('scd', scd);

    const response = await fetch(verificationUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });

    const result = await response.text();

    if (result.trim().toLowerCase() === 'success') {
      return { success: true };
    } else {
      return { success: false, error: result };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}
