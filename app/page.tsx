import Navbar from "@/sections/Navbar";
import Hero from "@/sections/Hero";
import LogoTicker from "@/sections/LogoTicker";
import Introduction from "@/sections/Introduction";
import Footer from "@/sections/Footer";
import Integrations from "@/sections/Integrations";
import Membership from "@/sections/Membership";

export default function Home() {
    return (
        <>
            <Navbar />
            <Hero />
            <LogoTicker />
            <Introduction />
            <Integrations />
            <Membership />
            <Footer />
        </>
    );
}
