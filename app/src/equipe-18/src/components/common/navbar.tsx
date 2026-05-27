"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Dashboard" },
    { href: "/nf-completa", label: "NF Completa" },
    { href: "/icms", label: "ICMS" },
    { href: "/ipi", label: "IPI" },
    { href: "/pis-cofins", label: "PIS/COFINS" },
    { href: "/help", label: "Ajuda" },
    { href: "/sobre", label: "Sobre" },
  ];

  return (
    <nav className="bg-green-950 text-green-100 py-4 px-6 shadow-lg border-b border-green-900/50">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          {/* Logo icon */}
          <div className="w-9 h-9 bg-green-500 rounded-lg flex items-center justify-center shadow-md shadow-green-500/20 group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5 text-green-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold tracking-tight text-white">
              Impostos<span className="text-green-400">NF</span>
            </span>
          </div>
        </Link>

        <ul className="flex items-center flex-wrap gap-1 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-green-600 text-white font-bold shadow-sm shadow-green-600/30 hover:bg-green-500"
                      : "text-green-200/80 hover:bg-green-900/60 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
