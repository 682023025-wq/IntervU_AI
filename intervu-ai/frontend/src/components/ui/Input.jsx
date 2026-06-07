// Input component for form fields
const Input = ({ 
  label, 
  error, 
  className = '', 
  type = 'text',
  id,
  ...props 
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          {label}
        </label>
      )}
      <input
        type={type}
        id={inputId}
        className={`
          w-full px-4 py-2 border rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          disabled:bg-slate-100 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : 'border-slate-300'}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Input;
