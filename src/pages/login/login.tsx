import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { loginInUser } from '../../services/slices/authenticationSlice';
// Объявление компонента
export const Login: FC = () => {
  // Строки, которые хранят данные пользователя
  const [email, setEmail] = useState('');
  // Функции для обновления паролей
  const [password, setPassword] = useState('');
  // Для отправки действий
  const dispatch = useDispatch();
  // Обработчик формы
  const userSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginInUser({ email, password }));
  };

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={userSubmit}
    />
  );
};
