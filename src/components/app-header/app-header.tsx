import { FC } from 'react';
import { useSelector } from '../../services/store';
import { getUser } from '../../services/selectors';
import { AppHeaderUI } from '@ui';
// Объявление компонента
export const AppHeader: FC = () => {
  const user = useSelector(getUser);

  return <AppHeaderUI userName={user ? user.name : ''} />;
};
