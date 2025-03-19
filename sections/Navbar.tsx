"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import logoImage from "@/assets/images/logo.svg";
import Button from "@/components/Button";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Features", href: "#features" },
    { label: "Integrations", href: "#integrations" },
    { label: "FAQs", href: "#faqs" },
];

export default function Navbar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // Initially null to indicate loading
    const [userRole, setUserRole] = useState<string | null>(null); // State to store user role
    const router = useRouter();

    useEffect(() => {
        const user = Cookies.get("user");
        if (user) {
            setIsLoggedIn(true);
            const parsedUser = JSON.parse(user);
            setUserRole(parsedUser.role); // Assuming the user object has a `role` property
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const handleLogout = () => {
        Cookies.remove("user");
        Cookies.remove("token");
        setIsLoggedIn(false);
        router.push("/SignIn");
    };

    return (
        <>
            <section className="py-4 lg:py-8 fixed w-full top-0 z-50">
                <div className="container">
                    <div className="grid grid-cols-2 lg:grid-cols-3 border border-white/15 rounded-full p-2 px-4 md:pr-2 items-center bg-neutral-950/70 backdrop-blur">
                        {/* Logo with Link to Home */}
                        <div>
                            <Link href="/">
                                <Image
                                    src={logoImage}
                                    alt="Layer logo"
                                    className="h-9 md:h-auto w-auto cursor-pointer"
                                />
                            </Link>
                        </div>

                        <div className="lg:flex justify-center items-center hidden">
                            <nav className="flex gap-6 font-medium">
                                {navLinks.map((link) => (
                                    <a href={link.href} key={link.label}>
                                        {link.label}
                                    </a>
                                ))}
                            </nav>
                        </div>
                        <div className="flex justify-end gap-3">
                            {/* Menu Icon in Navbar */}
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="md:hidden p-2 bg-white/10 rounded-lg"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="30"
                                    height="30"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="feather feather-menu text-white"
                                >
                                    <line x1="3" y1="12" x2="21" y2="12"></line>
                                    <line x1="3" y1="6" x2="21" y2="6"></line>
                                    <line x1="3" y1="18" x2="21" y2="18"></line>
                                </svg>
                            </button>
                            {isLoggedIn === null ? (
                                // Placeholder while determining login state
                                <div className="hidden md:inline-flex items-center w-20 h-8 bg-gray-700 rounded animate-pulse"></div>
                            ) : isLoggedIn ? (
                                <Button
                                    variant="secondary"
                                    className="hidden md:inline-flex items-center"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>
                            ) : (
                                <>
                                    <Link href="/SignIn">
                                        <Button
                                            variant="secondary"
                                            className="hidden md:inline-flex items-center"
                                        >
                                            Log In
                                        </Button>
                                    </Link>
                                    <Link href="/SignUp">
                                        <Button
                                            variant="primary"
                                            className="hidden md:inline-flex items-center"
                                        >
                                            Sign Up
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/*Top-Left Corner Menu Button */}
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="fixed top-4 left-4 p-3 bg-lime-400 text-white rounded-lg shadow-lg hover:bg-yellow-700 transition z-50"
                >
                    ☰
                </button>

                {/* Sidebar */}
                <div
                    className={`fixed top-0 left-0 h-full w-64 bg-black shadow-lg transform ${
                        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } transition-transform duration-300 ease-in-out z-50`}
                >
                    {/* Improved Close Button */}
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="absolute top-4 right-4 p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                    >
                        ✕
                    </button>
                    <nav className="flex flex-col mt-16 space-y-4 text-white px-6">
                        {userRole === "ADMIN" && (
                            <>
                                <a
                                    href="/user"
                                    className="py-2 text-lg font-semibold hover:text-gray-300"
                                >
                                    User
                                </a>
                                <a
                                    href="/child"
                                    className="py-2 text-lg font-semibold hover:text-gray-300"
                                >
                                    Child
                                </a>
                                <a
                                    href="/reports"
                                    className="py-2 text-lg font-semibold hover:text-gray-300"
                                >
                                    Reports
                                </a>
                            </>
                        )}
                        {(userRole === "DOCTOR" || userRole === "MEMBER") && (
                            <a
                                href="/child"
                                className="py-2 text-lg font-semibold hover:text-gray-300"
                            >
                                Child
                            </a>
                        )}
                    </nav>
                </div>

                {/* Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}
            </section>
            <div className="pb-[86px] md:pb-[98px] lg:px-[130px]"></div>
        </>
    );
}