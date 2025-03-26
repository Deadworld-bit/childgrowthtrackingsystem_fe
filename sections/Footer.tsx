"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FOOTER_CONTACT_INFO, FOOTER_LINKS, SOCIALS } from "../constants";
import logoImage from "@/assets/images/logo.svg";

const Footer = () => {
  return (
    <footer className="relative w-full bg-neutral-800 text-white pt-20 pb-8">
      <div className="flex flex-col gap-10 px-6 md:px-10 lg:px-16">
        {/* Brand & Navigation */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between w-full gap-8">
          {/* Left: Logo & Basic Info */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link href="/">
              <Image
                src={logoImage}
                alt="logo"
                width={74}
                height={29}
                className="h-9 w-auto md:h-auto"
              />
            </Link>
            <p className="text-sm md:text-base text-gray-300">
              Your child future is our future.
            </p>
          </div>

          {/* Center: Footer Links */}
          <div className="flex flex-wrap gap-10 justify-center">
            {FOOTER_LINKS.map((column) => (
              <FooterColumn title={column.title} key={column.title}>
                <ul className="flex flex-col gap-2">
                  {column.links.map((link) => (
                    <Link
                      href="/"
                      key={link}
                      className="hover:text-[#FFD166] transition-colors"
                    >
                      {link}
                    </Link>
                  ))}
                </ul>
              </FooterColumn>
            ))}

            {/* Contact Info */}
            <FooterColumn title={FOOTER_CONTACT_INFO.title}>
              <ul className="flex flex-col gap-2">
                {FOOTER_CONTACT_INFO.links.map((link) => (
                  <li key={link.label} className="flex gap-2">
                    <span className="whitespace-nowrap">{link.label}:</span>
                    <span className="text-[#6FCF97] whitespace-nowrap">
                      {link.value}
                    </span>
                  </li>
                ))}
              </ul>
            </FooterColumn>
          </div>

          {/* Right: Social Icons */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <h4 className="font-bold text-lg">Follow Us</h4>
            <ul className="flex items-center gap-4">
              {SOCIALS.links.map((socialLink) => (
                <Link href="/" key={socialLink}>
                  <Image
                    src={socialLink}
                    alt="social icon"
                    width={24}
                    height={24}
                    className="hover:opacity-80 transition-opacity"
                  />
                </Link>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-600" />

        {/* Bottom Section */}
        <div className="text-center">
          <p className="text-sm sm:text-base">
            2025 Deadworld &copy; All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

type FooterColumnProps = {
  title: string;
  children: React.ReactNode;
};

const FooterColumn = ({ title, children }: FooterColumnProps) => {
  return (
    <div className="flex flex-col gap-4 min-w-[120px]">
      <h4 className="font-bold text-lg">{title}</h4>
      {children}
    </div>
  );
};

export default Footer;
