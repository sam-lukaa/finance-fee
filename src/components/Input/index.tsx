import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Input = ({ label, ...props }: InputProps) => {
  return (
    <fieldset className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-500">
          {label}
        </label>
      )}

      <input
        className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
        {...props}
      />
    </fieldset>
  )
}
