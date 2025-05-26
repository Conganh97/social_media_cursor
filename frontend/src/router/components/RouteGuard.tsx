import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ROUTE_GUARDS, ROUTE_PATHS } from '../routes';

interface RouteGuardProps {
  children: ReactNode;
  guard?: keyof typeof ROUTE_GUARDS;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ 
  children, 
  guard = 'PUBLIC' 
}) => {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  switch (guard) {
    case 'PROTECTED':
      if (!isAuthenticated) {
        return <Navigate to={ROUTE_PATHS.AUTH.LOGIN} state={{ from: location }} replace />;
      }
      break;

    case 'GUEST_ONLY':
      if (isAuthenticated) {
        return <Navigate to={ROUTE_PATHS.DASHBOARD} replace />;
      }
      break;

    case 'ADMIN_ONLY':
      if (!isAuthenticated) {
        return <Navigate to={ROUTE_PATHS.AUTH.LOGIN} state={{ from: location }} replace />;
      }
      return <Navigate to={ROUTE_PATHS.ERROR.UNAUTHORIZED} replace />;

    case 'PUBLIC':
    default:
      break;
  }

  return <>{children}</>;
}; 