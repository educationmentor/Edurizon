import React from 'react';

interface UnreadBadgeProps {
  count: number;
  className?: string;
}

const UnreadBadge: React.FC<UnreadBadgeProps> = ({ count, className = '' }) => {
  if (count <= 0) return null;
  
  return (
    <div className={`absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold
                    rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1
                    shadow-md animate-pulse-light ${className}`}>
      {count > 99 ? '99+' : count}
    </div>
  );
};

export default UnreadBadge;