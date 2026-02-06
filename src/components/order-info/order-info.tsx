import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { fetchOrderByNumber } from '../../services/slices/ordersSlice';
// Объявление компонента
export const OrderInfo: FC = () => {
  // Получение параметра
  const { number } = useParams<{ number: string }>();
  // Получние информации
  const dispatch = useDispatch();
  // Список ингредиентов
  const ingredients = useSelector((state) => state.ingredients.ingredients);
  // Текущий заказ
  const currentOrder = useSelector((state) => state.orders.currentOrder);
  // Загрузка заказов
  const isLoading = useSelector((state) => state.orders.isLoading);
  // Дата заказа
  const orderData = currentOrder;
  // Загрузка данных по номеру заказа
  useEffect(() => {
    if (number) {
      const orderNumber = Number(number);
      if (!currentOrder || currentOrder.number !== orderNumber) {
        dispatch(fetchOrderByNumber(orderNumber));
      }
    }
  }, [dispatch, number, currentOrder]);

  // Подготовка данных для отображения
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;
    // Новая дата заказа
    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };
    // Детали ингредиентов с подсчётом
    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
