import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  helperText,
  error,
  fullWidth = false,
  id,
  className = '',
  ...props
}) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      
      <textarea
        id={textareaId}
        className={`
          block rounded-md shadow-sm 
          ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}
          ${fullWidth ? 'w-full' : ''}
          dark:bg-gray-800 dark:border-gray-700 dark:text-white
          dark:placeholder-gray-400 dark:focus:ring-indigo-500 dark:focus:border-indigo-500
          ${className}
        `}
        {...props}
      />
      
      {(helperText || error) && (
        <p className={`mt-1 text-sm ${error ? 'text-rose-600' : 'text-gray-500 dark:text-gray-400'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};