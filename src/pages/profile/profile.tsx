import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getUser } from '../../services/selectors';
import { updateUserApi } from '@api';
import { checkUserAuthentication } from '../../services/slices/authenticationSlice';
// Объявление класса
export const Profile: FC = () => {
  // Функция для отправки действий
  const dispatch = useDispatch();
  // Текущие данные пользователя
  const user = useSelector(getUser);
  // Локальное состояние формы
  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });
  // Синхронизация с новыми данными
  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);
  // Проверка изменений данных пользователя
  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;
  // Обработка отправки форм
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      // Проверка обновлений
      const updateData = {
        ...(formValue.name !== user?.name && { name: formValue.name }),
        ...(formValue.email !== user?.email && { email: formValue.email }),
        ...(formValue.password && { password: formValue.password })
      };

      if (Object.keys(updateData).length === 0) {
        return;
      }

      await updateUserApi(updateData);
      dispatch(checkUserAuthentication());

      setFormValue((prev) => ({ ...prev, password: '' }));
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
    }
  };
  // Отмена изменений
  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };
  // Обработка изменений
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
