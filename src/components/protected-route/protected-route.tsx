import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getIsAuthenticated } from '../../services/selectors';
// Пропсы
type TProtectedRouteProps = {
  children: ReactElement;
  onlyUnAuth?: boolean;
};
// Объявление компонента
const ProtectedRoute: FC<TProtectedRouteProps> = ({
  children,
  onlyUnAuth = false
}) =>
  onlyUnAuth ? (
    <UnauthenticatedOnlyRoute>{children}</UnauthenticatedOnlyRoute>
  ) : (
    <AuthenticatedOnlyRoute>{children}</AuthenticatedOnlyRoute>
  );
// Текущий маршрут
const AuthenticatedOnlyRoute: FC<{ children: ReactElement }> = ({
  children
}) => {
  const location = useLocation();
  const isAuthenticated = useSelector(getIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
// Проверяет авторизацию пользователя
const UnauthenticatedOnlyRoute: FC<{ children: ReactElement }> = ({
  children
}) => {
  const location = useLocation();
  const isAuthenticated = useSelector(getIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname || '/'} replace />;
  }

  return children;
};

export { ProtectedRoute };
