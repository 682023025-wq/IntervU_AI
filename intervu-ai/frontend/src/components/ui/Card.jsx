// Card component for content containers
const Card = ({ 
  children, 
  className = '', 
  padding = 'md',
  ...props 
}) => {
  const baseStyles = 'bg-white rounded-lg shadow-sm border border-slate-200';
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div 
      className={`${baseStyles} ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
