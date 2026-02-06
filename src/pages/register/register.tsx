import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { registerNewUser } from '../../services/slices/authenticationSlice';
import { RegisterUI } from '@ui-pages';
// Объявление компонента
export const Register: FC = () => {
  // Локальное состояние формы
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Функция для отправки действий
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector((state) => state.user.error);
  // Обработка отправки формы
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(registerNewUser({ name: userName, email, password })).then(
      (result) => {
        if (registerNewUser.fulfilled.match(result)) {
          navigate('/');
        }
      }
    );
  };

  return (
    <RegisterUI
      errorText={error || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
