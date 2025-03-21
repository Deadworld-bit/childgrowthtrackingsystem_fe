"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { loginUser, UserLogin } from "@/app/api/(auth)";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const userLogin: UserLogin = { email, password };

    try {
      const response = await loginUser(userLogin);
      console.log("Login successful:", response);

      Cookies.set("user", JSON.stringify(response.user), { expires: 1 });
      Cookies.set("token", response.token, { expires: 1 });

      router.push("/");
    } catch (err) {
      setError("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <section
      className="h-screen flex items-center justify-between text-white relative"
      style={{
        backgroundImage: "url('/Background_Login.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      {/* Left Side: Login Form */}
      <div className="w-1/2 flex items-center justify-center z-10">
        <div
          className="max-w-lg w-full p-8 rounded-xl shadow-lg"
          style={{ backdropFilter: "blur(10px)", background: "rgba(0, 0, 0, 0.5)" }}
        >
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Welcome Back
          </h1>

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}

          <form className="space-y-6 mt-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-gray-400 mb-2" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <FaEnvelope />
                </span>
                <input
                  id="email"
                  type="email"
                  className="w-full pl-10 p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-400 mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <FaLock />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <Link
                className="text-sm text-blue-400 hover:underline block text-right mt-2"
                href="/Reset-Password"
              >
                Forgot password?
              </Link>
            </div>
            <button className="w-full py-3 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold shadow-lg transition-transform transform hover:scale-105">
              Sign in
            </button>
          </form>

          <div className="text-center mt-6 text-gray-400">
            Don't have an account?{" "}
            <Link
              className="text-green-400 hover:text-green-300 font-semibold"
              href="/SIgnUp"
            >
              Sign Up
            </Link>
          </div>

          <div className="text-center mt-6">
            <Link
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200"
              href="/"
            >
              ← Return Home
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side: Welcome Message */}
      <div className="w-1/2 flex flex-col items-center justify-center text-center text-white p-10 z-10">
        <h2 className="text-5xl font-bold mb-4">Welcome to Our Platform</h2>
        <p className="text-lg text-gray-300">
          Join us to track your child's growth and connect with healthcare professionals.
        </p>
      </div>
    </section>
  );
};

export default Page;