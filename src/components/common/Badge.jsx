const Badge = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '' 
}) => {
  const variants = {
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
  };
  
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };
  
  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.md;
  
  return (
    <span className={`badge ${variantClass} ${sizeClass} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;