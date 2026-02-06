import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { listFeeds, listFeedsLoading } from '../../services/selectors';
import { fetchFeed } from '../../services/slices/feedSlice';
// Объявление компонента
export const Feed: FC = () => {
  // Функция для отправки действий
  const dispatch = useDispatch();
  // Показывает текущую ленту заказов
  const feeds = useSelector(listFeeds);
  // Проверка загрузки
  const isLoading = useSelector(listFeedsLoading);
  // Загрузка данных
  const loadingFeedsData = () => dispatch(fetchFeed());
  // Загрузка данных
  const handleGetFeeds = loadingFeedsData;

  useEffect(() => {
    loadingFeedsData();
  }, [dispatch]);

  if (isLoading || !feeds) {
    return <Preloader />;
  }

  return <FeedUI orders={feeds.orders} handleGetFeeds={handleGetFeeds} />;
};
