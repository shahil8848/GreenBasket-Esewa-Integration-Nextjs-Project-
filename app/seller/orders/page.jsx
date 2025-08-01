'use client';
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const Orders = () => {
  const { currency, getToken, user } = useAppContext();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSellerOrders = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get("/api/order/seller-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to get the first product image or fallback to box icon
  const getOrderImage = (order) => {
    if (order.items && order.items.length > 0) {
      const firstItem = order.items[0];
      if (firstItem.product && firstItem.product.image && firstItem.product.image.length > 0) {
        return firstItem.product.image[0];
      }
    }
    return assets.box_icon;
  };

  // Function to get order status color
  const getStatusColor = (order) => {
    const status = order.status || 'Order Placed';
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-green-600';
      case 'shipped':
        return 'text-blue-600';
      case 'processing':
        return 'text-yellow-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  useEffect(() => {
    if (user) {
      fetchSellerOrders();
    }
  }, [user]);

  return (
    <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
      {loading ? (
        <Loading />
      ) : (
        <div className="md:p-10 p-4 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Orders</h2>
            <span className="text-sm text-gray-500">
              {orders.length} total orders
            </span>
          </div>
          
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Image
                src={assets.box_icon}
                alt="No orders"
                className="mx-auto mb-4 opacity-50"
                width={80}
                height={80}
              />
              <p className="text-gray-500 text-lg">No orders received yet</p>
              <p className="text-gray-400 text-sm">Customer orders will appear here</p>
            </div>
          ) : (
            <div className="max-w-4xl rounded-md bg-white shadow-sm border border-gray-200">
              {orders.map((order, index) => (
                <div
                  key={order._id || index}
                  className={`flex flex-col md:flex-row gap-5 justify-between p-5 ${
                    index !== orders.length - 1 ? 'border-b border-gray-200' : ''
                  }`}
                >
                  {/* Product Info */}
                  <div className="flex-1 flex gap-5 max-w-80">
                    <div className="relative">
                      <Image
                        className="max-w-16 max-h-16 w-16 h-16 object-cover rounded border"
                        src={getOrderImage(order)}
                        alt="Product"
                        width={64}
                        height={64}
                        onError={(e) => {
                          e.target.src = assets.box_icon;
                        }}
                      />
                      {/* Show item count badge if multiple items */}
                      {order.items.length > 1 && (
                        <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {order.items.length}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-3">
                      <span className="font-medium">
                        {order.items
                          .map((item) =>
                            item.product
                              ? `${item.product.name} x ${item.quantity}`
                              : "Product unavailable"
                          )
                          .join(", ")}
                      </span>
                      <span className="text-gray-600">Items: {order.items.length}</span>
                      
                      {/* Show multiple product images if more than one item */}
                      {order.items.length > 1 && (
                        <div className="flex gap-1 mt-2">
                          {order.items.slice(0, 4).map((item, itemIndex) => (
                            <Image
                              key={itemIndex}
                              className="w-8 h-8 object-cover rounded border"
                              src={
                                item.product?.image?.[0] || assets.box_icon
                              }
                              alt={item.product?.name || "Product"}
                              width={32}
                              height={32}
                              onError={(e) => {
                                e.target.src = assets.box_icon;
                              }}
                            />
                          ))}
                          {order.items.length > 4 && (
                            <div className="w-8 h-8 bg-gray-200 rounded border flex items-center justify-center text-xs">
                              +{order.items.length - 4}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Address Info */}
                  <div className="min-w-0">
                    <h4 className="font-medium text-gray-700 mb-1">Delivery Address</h4>
                    <p className="text-sm">
                      <span className="font-medium text-gray-900">
                        {order.address?.fullName}
                      </span>
                      <br />
                      <span className="text-gray-600">{order.address?.area}</span>
                      <br />
                      <span className="text-gray-600">
                        {order.address?.city}, {order.address?.state}
                      </span>
                      <br />
                      <span className="text-gray-600">{order.address?.phoneNumber}</span>
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="text-center md:text-left">
                    <p className="text-gray-600 text-xs mb-1">Total Amount</p>
                    <p className="font-semibold text-lg text-green-600">
                      {currency}{order.amount}
                    </p>
                  </div>

                  {/* Meta Info */}
                  <div className="min-w-0">
                    <div className="flex flex-col gap-1">
                      <div className="text-xs text-gray-500">
                        <span>Method: </span>
                        <span className="font-medium text-gray-700">
                          {order.paymentType || 'COD'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        <span>Date: </span>
                        <span className="font-medium text-gray-700">
                          {new Date(order.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-xs">
                        <span className={`font-medium ${getStatusColor(order)}`}>
                          {order.status || 'Order Placed'}
                        </span>
                      </div>
                      
                      {/* Order ID */}
                      <div className="text-xs text-gray-500 mt-2">
                        <span>ID: </span>
                        <span className="font-mono text-gray-600">
                          {order._id?.slice(-8) || `ORD${index + 1}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Orders;