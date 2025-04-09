"use client";

import Navbar from "@/sections/Navbar";
import Hero from "@/sections/Hero";
import LogoTicker from "@/sections/LogoTicker";
import Introduction from "@/sections/Introduction";
import Footer from "@/sections/Footer";
import Review from "@/sections/Review";
import Membership from "@/sections/Membership";
import Features from "@/sections/Features";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe('pk_test_51RBbxhRtezEDRaKTPuFMHn8KL3RWCDxNlRxIOhvBhdXKZYXqINKXNRXL0W9IKvTfRbleQ83V2ZQfunPmAjmFHD8a00I1sMMx4m');

export default function Home() {
    return (
        <>
            <Navbar />
            <Hero />
            <LogoTicker />
            <Introduction />
            <Features />
            <Review />
            <Elements stripe={stripePromise}>
                <Membership />
            </Elements>
            <Footer />
        </>
    );
}
