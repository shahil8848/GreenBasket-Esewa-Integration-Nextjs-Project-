import connectDB from '@/config/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'You must be logged in to place an order' },
        { status: 401 }
      );
    }

    await connectDB(); // moved up

    const { address, items } = await request.json();
    const origin = request.headers.get('origin');

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

    let productData = [];
    let amount = 0;

    for (const item of items) {
      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid quantity for product ${item.product}. Quantity must be a positive whole number.`,
          },
          { status: 400 }
        );
      }

      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json(
          { success: false, message: `Product not found: ${item.product}` },
          { status: 404 }
        );
      }

      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });

      amount += product.offerPrice * item.quantity;
    }

    const taxAmount = Math.floor(amount * 0.02);
    const totalWithTax = amount + taxAmount;

    const order = await Order.create({
      userId,
      address,
      items,
      amount: totalWithTax,
      date: Date.now(),
      paymentType: 'Stripe',
    });

    const line_items = productData.map((item) => ({
      price_data: {
        currency: 'npr', // ✅ fixed
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100, // Stripe expects paisa
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: 'npr',
        product_data: {
          name: 'Tax (2%)',
        },
        unit_amount: taxAmount * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${origin}/order-placed`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });

    return NextResponse.json({ success: true, url: session.url }, { status: 200 });

  } catch (error) {
    console.error('Stripe Order Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
