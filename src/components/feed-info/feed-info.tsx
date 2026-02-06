import { FC } from 'react';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';
import { listFeeds } from '../../services/selectors';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);
// Объявление основного элемента
export const FeedInfo: FC = () => {
  // Данные
  const feedData = useSelector(listFeeds); // { orders, total, totalToday } | null
  // Заказы
  const orders = feedData?.orders || [];
  // Лента
  const feed = {
    total: feedData?.total || 0,
    totalToday: feedData?.totalToday || 0
  };
  // Готовые заказы
  const readyOrders = getOrders(orders, 'done');
  // Заказы в процессе
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
