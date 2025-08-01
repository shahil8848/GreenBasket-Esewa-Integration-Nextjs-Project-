import connectDB from '@/config/db';
import Product from '@/models/Product';
import { getAuth } from '@clerk/nextjs/server';
import authSeller from '@/lib/authSeller';
import { NextResponse } from 'next/server';

export async function DELETE(req) {
  try {
    // Parse ID from query string
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }

    const { userId } = getAuth(req);
    const isSeller = authSeller(userId);

    if (!isSeller) {
      return NextResponse.json({ success: false, message: "Not authorized" }, { status: 401 });
    }

    await connectDB();

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" });

  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
