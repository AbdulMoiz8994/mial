import { useState } from "react";

interface FloatingLabelInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  type?: string;
  testId?: string;
  multiline?: boolean;
  rows?: number;
  minHeight?: string;
  maxHeight?: string;
}

export function FloatingLabelInput({
  id,
  label,
  value,
  onChange,
  required = false,
  error,
  type = "text",
  testId,
  multiline = false,
  rows = 4,
  minHeight = '120px',
  maxHeight = '240px'
}: FloatingLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.trim().length > 0;
  const isFloating = isFocused || hasValue;

  const baseInputStyles = {
    width: '100%',
    borderRadius: '4px',
    borderWidth: '1px',
    borderColor: error ? '#EF4444' : (isFocused ? '#CEA54F' : '#E8E8E8'),
    padding: '14px 16px',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    fontWeight: 400,
    color: '#202020',
    outline: 'none',
    backgroundColor: 'transparent',
    transition: 'border-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    height: '48px',
    minHeight: multiline ? '48px' : undefined,
    maxHeight: multiline ? maxHeight : undefined,
  };

  const labelStyles = {
    position: 'absolute' as const,
    left: '16px',
    top: isFloating ? '-8px' : '14px',
    fontFamily: 'Inter, sans-serif',
    fontSize: isFloating ? '12px' : '14px',
    fontWeight: 400,
    color: error ? '#EF4444' : (isFocused ? '#CEA54F' : '#484848'),
    backgroundColor: 'white',
    padding: '0 4px',
    pointerEvents: 'none' as const,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    transformOrigin: 'left top',
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative">
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          rows={rows}
          style={baseInputStyles}
          className="resize-y"
          data-testid={testId}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={baseInputStyles}
          data-testid={testId}
        />
      )}
      
      <label htmlFor={id} style={labelStyles}>
        {label}
        {required && <span style={{ color: '#EF4444', marginLeft: '2px' }}>*</span>}
      </label>

      {error && (
        <p
          className="mt-1"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '12px',
            fontWeight: 400,
            color: '#EF4444'
          }}
          data-testid={`${testId}-error`}
        >
          {error}
        </p>
      )}
    </div>
  );
}
