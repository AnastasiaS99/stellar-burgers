import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { logoutUser } from '../../services/slices/authenticationSlice';
import { ProfileMenuUI } from '@ui';
// Объявление компонента
export const ProfileMenu: FC = () => {
  // Получение информации о маршруте
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Выход из аккаунта
  const logout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return <ProfileMenuUI handleLogout={logout} pathname={pathname} />;
};
