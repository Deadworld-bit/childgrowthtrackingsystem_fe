"use client";

import Link from "next/link";
import { useRouter } from "next/navigation"; // Use next/navigation instead of next/router
import React, { useState } from "react";
import Cookies from "js-cookie";
import { loginUser, UserLogin } from "@/app/api/(auth)";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const userLogin: UserLogin = { email, password };

    try {
      const response = await loginUser(userLogin);
      console.log("Login successful:", response);

      // Save user information in cookies
      Cookies.set("user", JSON.stringify(response.user), { expires: 1 });
      Cookies.set("token", response.token, { expires: 1 });

      // Redirect to home page
      router.push("/");
    } catch (err) {
      setError("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="max-w-lg w-full p-8 bg-gray-900 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Welcome Back
        </h1>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {/* Login Form */}
        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-gray-400 mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="w-full p-3 rounded-lg bg-gray-800 text-white"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="w-full p-3 rounded-lg bg-gray-800 text-white"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Link className="text-sm text-blue-400 hover:underline block text-right mt-1" href="/Reset-Password">
              Forgot password?
            </Link>
          </div>
          <button className="w-full py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold shadow">
            Sign in
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