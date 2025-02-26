"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

const Page = () => {
  interface User {
    id: number;
    name: string;
    email: string;
  }

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("https://api.example.com/users") // Replace with your API URL
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="max-w-lg w-full p-8 bg-gray-900 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Welcome Back
        </h1>
        
        {/* Users List */}
        <div className="my-6">
          <h2 className="text-lg font-semibold">Users from API:</h2>
          <ul className="list-disc pl-5 text-gray-400">
            {users.length > 0 ? (
              users.map((user) => (
                <li key={user.id} className="p-2 border-b border-gray-700">
                  {user.name} - {user.email}
                </li>
              ))
            ) : (
              <p>Loading...</p>
            )}
          </ul>
        </div>
        
        {/* Login Form */}
        <form className="space-y-5">
          <div>
            <label className="block text-gray-400 mb-1" htmlFor="email">Email</label>
            <input id="email" type="email" className="w-full p-3 rounded-lg bg-gray-800 text-white" placeholder="Your email" />
          </div>
          <div>
            <label className="block text-gray-400 mb-1" htmlFor="password">Password</label>
            <input id="password" type="password" className="w-full p-3 rounded-lg bg-gray-800 text-white" placeholder="Your password" />
            <Link className="text-sm text-blue-400 hover:underline block text-right mt-1" href="/Reset-Password">
              Forgot password?
            </Link>
          </div>
          <button className="w-full py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold shadow">
            Sign in
          </button>
          <div className="text-center text-gray-500 text-sm">or</div>
          <button className="w-full py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold">
            Sign In with Google
          </button>
        </form>
        
        {/* Sign Up Link */}
        <div className="text-center mt-5 text-gray-400">
          Don't have an account? <Link className="text-green-400 hover:text-green-300" href="/SIgnUp">Sign Up</Link>
        </div>

        {/* Return Home Link (No underline, highlights on hover) */}
        <div className="text-center mt-5">
          <Link className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200" href="/">
            ← Return Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Page;
