const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };
  
  const sizeClass = sizes[size] || sizes.md;
  
  return (
    <div className={`spinner ${sizeClass} ${className}`} />
  );
};

export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-cream-50">
    <div className="text-center">
      <Spinner size="xl" />
      <p className="mt-4 text-brown-600 font-medium">Loading...</p>
    </div>
  </div>
);

export const InlineLoader = ({ text = 'Loading...' }) => (
  <div className="flex items-center justify-center py-8">
    <Spinner size="md" />
    <span className="ml-3 text-brown-600">{text}</span>
  </div>
);

export default Spinner;