import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export default function Card({ title, children, className = "", ...props }: CardProps) {
  return (
    <div className={`bg-white shadow-sm border border-slate-200 rounded-lg p-5 ${className}`} {...props}>
      {title && (
        <div className="border-b pb-3 mb-4">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
}
