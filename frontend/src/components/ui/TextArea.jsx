const TextArea = ({ 
  label, 
  error, 
  helperText, 
  className = '', 
  id, 
  required = false,
  rows = 4,
  ...props 
}) => {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-slate-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        className={`
          w-full px-4 py-2.5 rounded-xl border bg-white
          text-slate-800 placeholder-slate-400
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary/20
          disabled:bg-slate-50 disabled:text-slate-500
          resize-y
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

export default TextArea;
