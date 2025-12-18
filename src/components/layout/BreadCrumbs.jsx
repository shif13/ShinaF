import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import Container from '../ui/Container';

const Breadcrumbs = () => {
  const location = useLocation();
  
  // Don't show breadcrumbs on home page
  if (location.pathname === '/') return null;
  
  const pathnames = location.pathname.split('/').filter((x) => x);
  
  // Format breadcrumb text
  const formatBreadcrumb = (str) => {
    return str
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  return (
    <div className="bg-cream-50 border-b border-brown-100 py-3">
      <Container>
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm overflow-x-auto scrollbar-hide">
            {/* Home */}
            <li>
              <Link 
                to="/" 
                className="flex items-center text-brown-600 hover:text-terracotta-600 transition-colors"
              >
                <Home className="w-4 h-4" />
              </Link>
            </li>
            
            {pathnames.map((name, index) => {
              const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
              const isLast = index === pathnames.length - 1;
              
              return (
                <li key={name} className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-brown-400 flex-shrink-0" />
                  {isLast ? (
                    <span className="text-brown-900 font-medium whitespace-nowrap">
                      {formatBreadcrumb(name)}
                    </span>
                  ) : (
                    <Link
                      to={routeTo}
                      className="text-brown-600 hover:text-terracotta-600 transition-colors whitespace-nowrap"
                    >
                      {formatBreadcrumb(name)}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </Container>
    </div>
  );
};

export default Breadcrumbs;