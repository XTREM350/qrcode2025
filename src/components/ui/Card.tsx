import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  className = '',
  headerAction,
  footer,
}) => {
  return (
    <div className={`bg-background-600 border border-gray-700 rounded-lg shadow-custom overflow-hidden ${className}`}>
      {(title || subtitle || headerAction) && (
        <div className="px-4 py-4 sm:px-6 border-b border-gray-700 flex justify-between items-center">
          <div>
            {title && <h3 className="text-lg font-medium text-white">{title}</h3>}
            {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="px-4 py-5 sm:p-6">{children}</div>
      {footer && (
        <div className="px-4 py-4 sm:px-6 border-t border-gray-700 bg-background-500">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;