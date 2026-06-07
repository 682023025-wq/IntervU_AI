const Input = ({ 
  label, 
  error, 
  helperText, 
  className = '', 
  id, 
  required = false,
  ...props 
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-4 py-2.5 rounded-xl border bg-white
          text-slate-800 placeholder-slate-400
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary/20
          disabled:bg-slate-50 disabled:text-slate-500
          ${error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
            : 'border-slate-200 focus:border-primary focus:ring-primary/20'
          }
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-slate-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
