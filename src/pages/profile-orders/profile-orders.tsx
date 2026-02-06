import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { fetchOrders } from '../../services/slices/ordersSlice';
// Объявление компонента
export const ProfileOrders: FC = () => {
  // Инициализации компонентов
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.orders);
  const hasFetched = useRef(false);
  // Запуск загрузки заказов
  useEffect(() => {
    if (!orders.length && !isLoading && !hasFetched.current) {
      hasFetched.current = true;
      dispatch(fetchOrders());
    }
  }, [dispatch, orders.length, isLoading]);

  return <ProfileOrdersUI orders={orders} />;
};
