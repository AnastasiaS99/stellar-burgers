import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { useSelector } from '../../services/store';
import { listIngredients } from '../../services/selectors';

const maxIngredients = 6;
// Объявление компонента
export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  // Получение текущего маршрута
  const location = useLocation();
  // Получение списка ингредиентов
  const ingredients: TIngredient[] = useSelector(listIngredients);
  // Обработка данных по заказу
  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null;
    // Массив строк с ID
    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredient[], item: string) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) return [...acc, ingredient];
        return acc;
      },
      []
    );
    // Подсчёт стоимости
    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);
    // Ограничение по ингредиентам, которые видно
    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);
    // Количество скрытых ингредиентов
    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;
    // Дата
    const date = new Date(order.createdAt);
    return {
      // Все свойства заказа
      ...order,
      // Информация по ингредиентам
      ingredientsInfo,
      // Информация по тем ингредиентам, которые видно
      ingredientsToShow,
      // Скрытые ингредиенты
      remains,
      // Сумма заказа
      total,
      // Дата заказа
      date
    };
  }, [order, ingredients]);

  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});
