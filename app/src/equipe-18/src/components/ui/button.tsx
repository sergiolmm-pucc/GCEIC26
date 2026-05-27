import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

export default function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {

  return (
    <button
      className={`px-4 py-2 rounded-md font-medium text-sm transition-all focus:outline-none focus:ring-2 disabled:opacity-50 ${className}`}
      {...props}
    >
      {}
      {children}
    </button>
  );
}
