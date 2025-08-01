import connectDB from '@/config/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { generateEsewaSignature } from '@/lib/generateEsewaSignature';

function validateEnvironmentVariables() {
  const requiredEnvVars = [
    "NEXT_PUBLIC_BASE_URL",
    "NEXT_PUBLIC_ESEWA_MERCHANT_CODE",
    "NEXT_PUBLIC_ESEWA_SECRET_KEY",
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing environment variable: ${envVar}`);
    }
  }
}

export async function POST(request) {
  try {
    // Validate environment variables
    validateEnvironmentVariables();

    // Check authentication
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'You must be logged in to place an order' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Parse request data
    const { address, items } = await request.json();

    // Validate required fields
    if (!address) {
      return NextResponse.json(
        { success: false, message: 'Address is required' },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No items in cart' },
        { status: 400 }
      );
    }

    // Process cart items and calculate totals
    let productData = [];
    let amount = 0;

    for (const item of items) {
      // Validate quantity
      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid quantity for product ${item.product}. Quantity must be a positive whole number.`,
          },
          { status: 400 }
        );
      }

      // Find product in database
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json(
          { success: false, message: `Product not found: ${item.product}` },
          { status: 404 }
        );
      }

      // Add to product data
      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });

      // Calculate subtotal
      amount += product.offerPrice * item.quantity;
    }

    // Calculate tax (2%)
    const taxAmount = Math.floor(amount * 0.02);
    const totalWithTax = amount + taxAmount;

    // Create order in database
    const order = await Order.create({
      userId,
      address,
      items,
      amount: totalWithTax,
      date: Date.now(),
      paymentType: 'eSewa',
    });

    // Generate transaction UUID
    const transactionUuid = `${Date.now()}-${uuidv4()}`;

    // Create eSewa configuration
    const esewaConfig = {
      amount: amount.toString(),
      tax_amount: taxAmount.toString(),
      total_amount: totalWithTax.toString(),
      transaction_uuid: transactionUuid,
      product_code: process.env.NEXT_PUBLIC_ESEWA_MERCHANT_CODE,
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order-placed?orderId=${order._id.toString()}`,
      failure_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      signed_field_names: "total_amount,transaction_uuid,product_code",
    };

    // Generate signature
    const signatureString = `total_amount=${esewaConfig.total_amount},transaction_uuid=${esewaConfig.transaction_uuid},product_code=${esewaConfig.product_code}`;
    const signature = generateEsewaSignature(
      process.env.NEXT_PUBLIC_ESEWA_SECRET_KEY,
      signatureString
    );

    console.log('eSewa Order Created:', {
      orderId: order._id.toString(),
      amount: totalWithTax,
      items: productData.length,
      transactionUuid
    });

    // Return eSewa configuration
    return NextResponse.json({
      success: true,
      orderId: order._id.toString(),
      amount: amount,
      taxAmount: taxAmount,
      totalAmount: totalWithTax,
      esewaConfig: {
        ...esewaConfig,
        signature,
        product_service_charge: Number(esewaConfig.product_service_charge),
        product_delivery_charge: Number(esewaConfig.product_delivery_charge),
        tax_amount: Number(esewaConfig.tax_amount),
        total_amount: Number(esewaConfig.total_amount),
      },
    }, { status: 200 });

  } catch (error) {
    console.error('eSewa Order Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
