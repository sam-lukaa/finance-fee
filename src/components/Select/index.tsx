import { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
}

export const Select = ({ label, children, ...props }: SelectProps) => {
  return (
    <fieldset className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-500">
          {label}
        </label>
      )}

      <select
        className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
        {...props}
      >
        {children}
      </select>
    </fieldset>
  )
}
