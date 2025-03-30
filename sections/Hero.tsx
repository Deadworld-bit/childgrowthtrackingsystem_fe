"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Button from "@/components/Button";

export default function Hero() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoggedIn) {
      alert("You are already signed in.");
      return;
    }

    router.push(`/SIgnUp?email=${encodeURIComponent(email)}`);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-neutral-950 via-neutral-900 to-black text-white">
      <div className="container">
        <div className="flex justify-center">
          <div className="inline-flex py-1 px-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full text-neutral-950 font-semibold shadow-lg">
            1.2M children have been taken care of
          </div>
        </div>
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-medium text-center mt-6 leading-tight">
          Caring for Every Child,{" "}
          <span className="text-lime-400">Securing a Brighter Future</span>
        </h1>
        <p className="text-center text-xl text-white/50 mt-8 max-w-2xl mx-auto">
          Every child deserves a safe, nurturing environment where they can
          learn, grow, and thrive.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex border border-white/15 rounded-full p-2 mt-8 max-w-lg mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="bg-transparent px-4 md:flex-1 w-full text-white focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="primary"
            className="whitespace-nowrap px-6 py-2"
            size="sm"
          >
            Sign up
          </Button>
        </form>
      </div>
    </section>
  );
}
