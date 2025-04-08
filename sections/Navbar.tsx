// app/components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { FaChild, FaCommentAlt, FaChartBar, FaUser, FaIdBadge } from "react-icons/fa";
import logoImage from "@/assets/images/logo.svg";
import Button from "@/components/Button";
import userApi, { User } from "@/app/api/user";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "#features" },
  { label: "Reviews", href: "#integrations" },
  { label: "Memberships", href: "#faqs" },
];

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userData, setUserData] = useState<Partial<User> | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const cookie = Cookies.get("user");
      if (!cookie) {
        setIsLoggedIn(false);
        return;
      }

      try {
        const parsed = JSON.parse(cookie);
        const userId = BigInt(parsed.id);
        const resp = await userApi.getUserById(userId);
        if (resp.status === "ok") {
          setUserData(resp.data);
          setUserRole(resp.data.role);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setIsLoggedIn(false);
      }
    };

    loadUser();
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
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>

              {isLoggedIn === null ? (
                <div className="hidden md:inline-flex items-center w-20 h-8 bg-gray-700 rounded animate-pulse" />
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
                    <Button variant="secondary" className="hidden md:inline-flex">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/SignUp">
                    <Button variant="primary" className="hidden md:inline-flex">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar toggle */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 p-3 bg-lime-400 text-white rounded-lg shadow-lg hover:bg-yellow-700 transition z-50"
        >
          ☰
        </button>

        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-gray-900 shadow-lg transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out z-50`}
        >
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-4 right-4 p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
          >
            ✕
          </button>

          {/* profile */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-700 pr-16">
            <Link href={isLoggedIn ? "/profile" : "/SignIn"}>
              <div className="flex items-center gap-3 cursor-pointer truncate">
                <img
                  className="w-10 h-10 rounded-full flex-shrink-0"
                  src="/neutral.png"
                  alt="Profile"
                />
                <div className="overflow-hidden">
                  <p className="font-semibold text-lg text-white truncate">
                    {isLoggedIn && userData?.username
                      ? userData.username
                      : "Guest"}
                  </p>
                  <p className="text-sm text-gray-300 truncate">
                    {isLoggedIn && userData?.email ? userData.email : "Sign In"}
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* links */}
          <nav className="flex flex-col mt-6 space-y-6 text-white px-6">
            {userRole === "ADMIN" && (
              <>
                <Link
                  href="/overview"
                  className="flex items-center gap-3 py-2 text-lg font-semibold hover:text-yellow-400 transition"
                >
                  <FaChartBar className="text-yellow-400" />
                  Report
                </Link>
                <Link
                  href="/membership"
                  className="flex items-center gap-3 py-2 text-lg font-semibold hover:text-yellow-400 transition"
                >
                  <FaIdBadge className="text-yellow-400" />
                  Membership
                </Link>
                <Link
                  href="/user"
                  className="flex items-center gap-3 py-2 text-lg font-semibold hover:text-yellow-400 transition"
                >
                  <FaUser className="text-yellow-400" />
                  User
                </Link>
                <Link
                  href="/child"
                  className="flex items-center gap-3 py-2 text-lg font-semibold hover:text-yellow-400 transition"
                >
                  <FaChild className="text-yellow-400" />
                  Child
                </Link>
              </>
            )}
            {(userRole === "ADMIN" || userRole === "MEMBER") && (
              <Link
                href="/feedback"
                className="flex items-center gap-3 py-2 text-lg font-semibold hover:text-yellow-400 transition"
              >
                <FaCommentAlt className="text-yellow-400" />
                Feedback & Rating
              </Link>
            )}
            {(userRole === "DOCTOR" || userRole === "MEMBER") && (
              <Link
                href="/child"
                className="flex items-center gap-3 py-2 text-lg font-semibold hover:text-yellow-400 transition"
              >
                <FaChild className="text-yellow-400" />
                Child
              </Link>
            )}
          </nav>
        </div>
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </section>
      <div className="pb-[86px] md:pb-[98px] lg:px-[130px]" />
    </>
  );
}
