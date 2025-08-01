'use client';
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const MyOrders = () => {
  const { currency, getToken, user } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/order/list", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setOrders(data.orders.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  // Function to get the first product image or fallback to box icon
  const getOrderImage = (order) => {
    // Try to get the first item's product image
    if (order.items && order.items.length > 0) {
      const firstItem = order.items[0];
      if (firstItem.product && firstItem.product.image && firstItem.product.image.length > 0) {
        return firstItem.product.image[0];
      }
    }
    return assets.box_icon;
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen">
        <div className="space-y-5">
          <h2 className="text-lg font-medium mt-6">My Orders</h2>
          {loading ? (
            <Loading />
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <Image
                src={assets.box_icon}
                alt="No orders"
                className="mx-auto mb-4 opacity-50"
                width={64}
                height={64}
              />
              <p className="text-gray-500">No orders found</p>
            </div>
          ) : (
            <div className="max-w-5xl border-t border-gray-300 text-sm">
              {orders.map((order, index) => (
                <div
                  key={order._id || index}
                  className="flex flex-col md:flex-row gap-5 justify-between p-5 border-b border-gray-300"
                >
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
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {order.items.length}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-3">
                      <span className="font-medium text-base">
                        {order.items
                          .map((item) =>
                            item.product
                              ? `${item.product.name} x ${item.quantity}`
                              : "Product unavailable"
                          )
                          .join(", ")}
                      </span>
                      <span>Items: {order.items.length}</span>
                      
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

                  <div>
                    <p>
                      <span className="font-medium">{order.address?.fullName}</span>
                      <br />
                      <span>{order.address?.area}</span>
                      <br />
                      <span>{order.address?.city}, {order.address?.state}</span>
                      <br />
                      <span>{order.address?.phoneNumber}</span>
                    </p>
                  </div>

                  <p className="font-medium my-auto">
                    {currency}{order.amount}
                  </p>

                  <div>
                    <p className="flex flex-col">
                      <span>Method : {order.paymentType || 'COD'}</span>
                      <span>Date : {new Date(order.date).toLocaleDateString()}</span>
                      <span className="text-green-600 font-medium">Order Placed</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyOrders;