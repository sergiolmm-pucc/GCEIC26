import React from 'react';
export default function Campo({ label, value, onChange, step = '0.01', min = '0', hint, ...props }) {
  return (
    <label className="campo">
      <span>{label}</span>
      <input
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        {...props}
      />
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}
