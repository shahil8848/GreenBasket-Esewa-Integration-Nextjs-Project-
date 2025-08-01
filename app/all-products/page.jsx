import { Suspense } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AllProducts from './AllProducts';

const Page = () => {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="p-16">Loading products...</div>}>
        <AllProducts />
      </Suspense>
      <Footer />
    </>
  );
};

export default Page;
