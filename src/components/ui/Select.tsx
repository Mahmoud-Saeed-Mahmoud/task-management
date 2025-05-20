import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select an option',
  disabled = false,
  error,
  helperText,
  fullWidth = false,
  className = '',
}) => {
  const id = `select-${Math.random().toString(36).substring(2, 9)}`;
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={`
            block appearance-none rounded-md border ${error ? 'border-rose-500' : 'border-gray-300 dark:border-gray-700'}
            bg-white dark:bg-gray-800 dark:text-white
            px-3 py-2 pr-8
            shadow-sm focus:outline-none focus:ring-1 ${error ? 'focus:ring-rose-500' : 'focus:ring-indigo-500'}
            ${fullWidth ? 'w-full' : ''}
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
          <ChevronDown size={16} />
        </div>
      </div>
      
      {(helperText || error) && (
        <p className={`mt-1 text-sm ${error ? 'text-rose-600' : 'text-gray-500 dark:text-gray-400'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};