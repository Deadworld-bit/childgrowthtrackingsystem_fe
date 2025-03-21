"use client";

import Link from "next/link";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import userApi from "@/app/api/user";
import { useRouter } from "next/navigation";

const Page = () => {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("MEMBER"); // Default role
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null); // Success message
    const [suggestedPassword, setSuggestedPassword] = useState<string | null>(
        null
    );
    const [showPassword, setShowPassword] = useState(false); // Toggle for password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle for confirm password visibility

    // Function to generate a secure random password
    const generatePassword = () => {
        const chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
        let generatedPassword = "";
        for (let i = 0; i < 12; i++) {
            generatedPassword += chars.charAt(
                Math.floor(Math.random() * chars.length)
            );
        }
        setSuggestedPassword(generatedPassword);
    };

    // Function to check password security
    const isPasswordSecure = (password: string) => {
        const minLength = 10;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return (
            password.length >= minLength &&
            hasUppercase &&
            hasLowercase &&
            hasNumber &&
            hasSpecialChar
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setSuccess(null);
  
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address.");
        return;
      }
  
      // Validate password security
      if (!isPasswordSecure(password)) {
        setError(
          "Password must be at least 10 characters long and include uppercase, lowercase, numbers, and special characters."
        );
        return;
      }
  
      // Validate password match
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
  
      // Call the Create User API
      try {
        const response = await userApi.createUser({
          username: name,
          password,
          email,
          role,
        });
  
        // Check if the backend returned a failure status
        if (response.status === "false") {
          setError(response.message || "Failed to create account. Please try again.");
          return;
        }
  
        // If successful, show success message
        setSuccess("Account created successfully!");
        console.log("Created User:", response);
  
        // Redirect to the Sign In page
        setTimeout(() => {
          router.push("/SignIn"); // Redirect after a short delay
        }, 1500); // Optional delay for user to see the success message
      } catch (err: any) {
        console.error("Error creating user:", err);
  
        // Extract error message from the backend response
        const errorMessage =
          err.response?.data?.message ||
          "Failed to create account. Please try again.";
  
        setError(errorMessage);
      }
    };

    return (
        <section
            className="h-screen flex items-center justify-between text-white relative"
            style={{
                backgroundImage: "url('/Background_Login.jpg')", // Replace with the correct path to your image
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>

            {/* Left Side: Sign Up Form */}
            <div className="w-1/2 flex items-center justify-center z-10">
                <div
                    className="max-w-lg w-full p-8 rounded-xl shadow-lg"
                    style={{
                        backdropFilter: "blur(10px)",
                        background: "rgba(0, 0, 0, 0.5)",
                    }}
                >
                    {/* Section Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                            Create an Account
                        </h1>
                        <p className="text-gray-400">
                            Join us and start your journey today.
                        </p>
                    </div>

                    {/* Display Error or Success Message */}
                    {error && (
                        <p className="text-red-500 text-center mb-4">{error}</p>
                    )}
                    {success && (
                        <p className="text-green-500 text-center mb-4">
                            {success}
                        </p>
                    )}

                    {/* Sign Up Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            {/* Name Field */}
                            <div>
                                <label
                                    className="block text-sm font-medium text-gray-300"
                                    htmlFor="name"
                                >
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Email Field */}
                            <div>
                                <label
                                    className="block text-sm font-medium text-gray-300"
                                    htmlFor="email"
                                >
                                    Email{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Password Field */}
                            <div>
                                <label
                                    className="block text-sm font-medium text-gray-300"
                                    htmlFor="password"
                                >
                                    Password{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Password (at least 10 characters)"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? (
                                            <FaEyeSlash />
                                        ) : (
                                            <FaEye />
                                        )}
                                    </button>
                                </div>
                                {/* Suggested Password */}
                                {suggestedPassword && (
                                    <p className="text-sm text-gray-400 mt-2">
                                        Suggested Password:{" "}
                                        <span
                                            className="text-green-400 cursor-pointer hover:underline"
                                            onClick={() =>
                                                setPassword(suggestedPassword)
                                            }
                                        >
                                            {suggestedPassword}
                                        </span>
                                    </p>
                                )}
                                <button
                                    type="button"
                                    className="mt-2 text-sm text-blue-400 hover:underline"
                                    onClick={generatePassword}
                                >
                                    Generate a secure password
                                </button>
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label
                                    className="block text-sm font-medium text-gray-300"
                                    htmlFor="confirmPassword"
                                >
                                    Confirm Password{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Confirm your password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <FaEyeSlash />
                                        ) : (
                                            <FaEye />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Role Dropdown */}
                            <div>
                                <label
                                    className="block text-sm font-medium text-gray-300"
                                    htmlFor="role"
                                >
                                    Role <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="role"
                                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    required
                                >
                                    <option value="MEMBER">Member</option>
                                    <option value="DOCTOR">Doctor</option>
                                </select>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-6">
                            <button className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg hover:opacity-90 transition-transform transform hover:scale-105">
                                Register
                            </button>
                        </div>
                    </form>

                    {/* Bottom Link */}
                    <div className="mt-6 text-center text-sm text-gray-400">
                        Already have an account?{" "}
                        <Link
                            className="font-medium text-green-400 hover:underline"
                            href="/SignIn"
                        >
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Side: Welcome Message */}
            <div className="w-1/2 flex flex-col items-center justify-center text-center text-white p-10 z-10">
                <h2 className="text-5xl font-bold mb-4">
                    Welcome to Our Platform
                </h2>
                <p className="text-lg text-gray-300">
                    Join us to track your child's growth and connect with
                    healthcare professionals.
                </p>
            </div>
        </section>
    );
};

export default Page;
