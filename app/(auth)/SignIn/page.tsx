"use client"; 

import Link from "next/link";
import React, { useEffect, useState } from "react";

const Page = () => {
  interface User {
    id: number;
    name: string;
    email: string;
  }

  const [users, setUsers] = useState<User[]>([]); // Store API data

  useEffect(() => {
    fetch("https://api.example.com/users") // Replace with your Swagger API URL
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="pb-12 text-center">
            <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Welcome back
            </h1>
          </div>

          {/* Display fetched users */}
          <div className="mb-6">
            <h2 className="text-xl font-bold">Users from API:</h2>
            <ul className="list-disc pl-5">
              {users.length > 0 ? (
                users.map((user) => (
                  <li key={user.id} className="p-2 border-b">
                    {user.name} - {user.email}
                  </li>
                ))
              ) : (
                <p>Loading...</p>
              )}
            </ul>
          </div>

          {/* Contact form */}
          <form className="mx-auto max-w-[400px]">
            <div className="space-y-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-black-200/65" htmlFor="email">
                  Email
                </label>
                <input id="email" type="email" className="form-input w-full" placeholder="Your email" />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between gap-3">
                  <label className="block text-sm font-medium text-black-200/65" htmlFor="password">
                    Password
                  </label>
                  <Link className="text-sm text-gray-600 hover:underline" href="/Reset-Password">
                    Forgot?
                  </Link>
                </div>
                <input id="password" type="password" className="form-input w-full" placeholder="Your password" />
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <button className="btn w-full bg-green-600 text-white shadow hover:bg-green-700">
                Sign in
              </button>
              <div className="flex items-center gap-3 text-center text-sm italic text-gray-600">
                <span className="flex-1 h-px bg-gray-400"></span> or <span className="flex-1 h-px bg-gray-400"></span>
              </div>
              <button className="btn w-full bg-gray-800 text-white hover:bg-gray-700">
                Sign In with Google
              </button>
            </div>
          </form>

          {/* Bottom link */}
          <div className="mt-6 text-center text-sm text-black-200/65">
            Don't have an account?{" "}
            <Link className="font-medium text-indigo-500" href="/SignUp">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
