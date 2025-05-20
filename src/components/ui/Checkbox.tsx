import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  helperText?: string;
  error?: string;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  helperText,
  error,
  className = '',
}) => {
  const id = `checkbox-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <div className="relative">
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="sr-only"
          />
          <div
            className={`
              w-5 h-5 border rounded transition-colors
              ${checked ? 'bg-indigo-600 border-indigo-600' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'}
              ${error ? 'border-rose-500' : ''}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            onClick={() => !disabled && onChange(!checked)}
          >
            {checked && (
              <Check size={16} className="text-white" />
            )}
          </div>
        </div>
      </div>
      
      {(label || helperText || error) && (
        <div className="ml-2 text-sm">
          {label && (
            <label
              htmlFor={id}
              className={`
                font-medium 
                ${disabled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}
                ${error ? 'text-rose-600' : ''}
              `}
            >
              {label}
            </label>
          )}
          
          {(helperText || error) && (
            <p className={`mt-1 ${error ? 'text-rose-600' : 'text-gray-500 dark:text-gray-400'}`}>
              {error || helperText}
            </p>
          )}
        </div>
      )}
    </div>
  );
};