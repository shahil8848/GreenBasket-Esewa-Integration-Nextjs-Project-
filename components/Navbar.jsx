'use client';
import React, { useState } from 'react';
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from '@/assets/assets';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';
import { useClerk, UserButton } from '@clerk/nextjs';

const Navbar = () => {
  const { isSeller, router, user } = useAppContext();
  const { openSignIn } = useClerk();

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    const trimmed = searchTerm.trim();
    if (trimmed !== '') {
      router.push(`/all-products?search=${encodeURIComponent(trimmed)}`);
      setSearchTerm('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      {/* Logo */}
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router.push('/')}
        src={assets.logo}
        alt="logo"
        priority
      />

      {/* Desktop Links */}
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">Home</Link>
        <Link href="/all-products" className="hover:text-gray-900 transition">Shop</Link>
        <Link href="/about" className="hover:text-gray-900 transition">About Us</Link>
        <Link href="/contact" className="hover:text-gray-900 transition">Contact</Link>
        {isSeller && (
          <button
            onClick={() => router.push('/seller')}
            className="text-xs border px-4 py-1.5 rounded-full"
            aria-label="Go to Seller Dashboard"
          >
            Seller Dashboard
          </button>
        )}
      </div>

      {/* Search & User Desktop */}
      <div className="hidden md:flex items-center gap-4">
        <div className="flex items-center border rounded-md overflow-hidden">
          <input
            type="search"
            placeholder="Search product..."
            className="px-2 py-1 outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Search products"
          />
          <button
            onClick={handleSearch}
            className="bg-white hover:bg-gray-100 active:bg-gray-200 px-2 flex items-center justify-center transition-colors"
            aria-label="Submit search"
            type="button"
          >
            <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
          </button>
        </div>

        {user ? (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="Cart"
                labelIcon={<CartIcon />}
                onClick={() => router.push('/cart')}
              />
              <UserButton.Action
                label="My Orders"
                labelIcon={<BagIcon />}
                onClick={() => router.push('/my-orders')}
              />
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button
            onClick={openSignIn}
            className="flex items-center gap-2 hover:text-gray-900 transition"
            aria-label="Sign in or create account"
          >
            <Image src={assets.user_icon} alt="user icon" />
            Account
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="flex items-center md:hidden gap-3">
        {isSeller && (
          <button
            onClick={() => router.push('/seller')}
            className="text-xs border px-4 py-1.5 rounded-full"
            aria-label="Go to Seller Dashboard"
          >
            Seller Dashboard
          </button>
        )}
        {user ? (
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="Home"
                labelIcon={<HomeIcon />}
                onClick={() => router.push('/')}
              />
              <UserButton.Action
                label="Products"
                labelIcon={<BoxIcon />}
                onClick={() => router.push('/all-products')}
              />
              <UserButton.Action
                label="Cart"
                labelIcon={<CartIcon />}
                onClick={() => router.push('/cart')}
              />
              <UserButton.Action
                label="My Orders"
                labelIcon={<BagIcon />}
                onClick={() => router.push('/my-orders')}
              />
            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button
            onClick={openSignIn}
            className="flex items-center gap-2 hover:text-gray-900 transition"
            aria-label="Sign in or create account"
          >
            <Image src={assets.user_icon} alt="user icon" />
            Account
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
