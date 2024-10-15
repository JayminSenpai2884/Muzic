"use client";
import { signIn, signOut } from "next-auth/react";
import React from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const Appbar = () => {
  const { data: session } = useSession(); // Get session data

  return (
    <div className="container mx-auto px-4 py-3 flex justify-between items-center bg-white shadow-md rounded-lg">
  <Link href="/" className="text-3xl font-extrabold text-gray-800 hover:text-sky-500 transition duration-300 ease-in-out">
    Muzic🎵
  </Link>
  <div className="flex items-center space-x-6">
    
    {session?.user ? (
      <button
        className="m-2 px-4 py-2 bg-sky-500 text-white font-semibold rounded-lg shadow-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-opacity-75 transition duration-300 ease-in-out"
        onClick={() => signOut()}
      >
        Log Out
      </button>
    ) : (
      <button
        className="m-2 px-4 py-2 bg-sky-500 text-white font-semibold rounded-lg shadow-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-opacity-75 transition duration-300 ease-in-out"
        onClick={() => signIn()}
      >
        Sign In
      </button>
    )}
  </div>
</div>

  );
};

export default Appbar;
