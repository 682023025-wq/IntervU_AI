import React from 'react';

/**
 * Card Component - Reusable card container
 * @param {ReactNode} children - Card content
 * @param {string} className - Additional CSS classes
 * @param {boolean} hoverable - Whether card should have hover effect
 */
const Card = ({ 
  children, 
  className = '', 
  hoverable = false 
}) => {
  return (
    <div 
      className={`
        bg-white 
        rounded-xl 
        shadow-sm 
        border border-gray-100 
        p-4 sm:p-6
        ${hoverable ? 'transition-all duration-300 hover:shadow-md hover:border-primary-200' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
