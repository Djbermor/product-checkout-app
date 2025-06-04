import React from "react"

type InputProps = {
  label: string
  value: string
  onChange: (value: string) => void
} & React.InputHTMLAttributes<HTMLInputElement>

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  className = '',
  ...rest
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2 border rounded shadow-sm ${className}`}
      {...rest}
    />
  </div>
)

export default Input