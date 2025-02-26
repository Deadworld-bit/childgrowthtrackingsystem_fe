import Navbar from "@/sections/Navbar";
import Hero from "@/sections/Hero";
import LogoTicker from "@/sections/LogoTicker";
import Introduction from "@/sections/Introduction";
import Footer from "@/sections/Footer";
import Review from "@/sections/Review";
import Membership from "@/sections/Membership";
import Features from "@/sections/Features";

export default function Home() {
    return (
        <>
            <Navbar />
            <Hero />
            <LogoTicker />
            <Introduction />
            <Features />
            <Review />
            <Membership />
            <Footer />
        </>
    );
}
