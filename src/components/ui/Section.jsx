const Section = ({ 
  children, 
  className = '', 
  size = 'default',
  bg = 'transparent' 
}) => {
  const sizes = {
    sm: 'section-sm',
    default: 'section',
    lg: 'section-lg',
  };
  
  const backgrounds = {
    transparent: 'bg-transparent',
    white: 'bg-white',
    cream: 'bg-cream-50',
    light: 'bg-cream-100',
  };
  
  const sizeClass = sizes[size] || sizes.default;
  const bgClass = backgrounds[bg] || backgrounds.transparent;
  
  return (
    <section className={`${sizeClass} ${bgClass} ${className}`}>
      {children}
    </section>
  );
};

export default Section;