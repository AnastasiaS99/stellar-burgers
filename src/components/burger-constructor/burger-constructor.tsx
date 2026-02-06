import { FC, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import {
  getConstructorItems,
  getOrderRequest,
  getOrderModalData,
  getIsAuthenticated
} from '../../services/selectors';
import {
  createNewOrder,
  clearOrderModal
} from '../../services/slices/orderModalSlice';
import { clearConstructor } from '../../services/slices/constructorSlice';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
// Объявление компонента
export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Получение данных
  const constructorItems = useSelector(getConstructorItems);
  const orderRequest = useSelector(getOrderRequest);
  const orderModalData = useSelector(getOrderModalData);
  const isAuthenticated = useSelector(getIsAuthenticated);
  // Логика формирования заказа
  const canCreateOrder = constructorItems.bun && !orderRequest;
  const orderIngredients = constructorItems.bun
    ? [
        constructorItems.bun._id,
        ...constructorItems.ingredients.map((i) => i._id),
        constructorItems.bun._id
      ]
    : [];
  // Навигация для входа
  const redirectToLogin = () =>
    navigate('/login', { state: { from: { pathname: '/' } } });
  // Обработка заказа
  const processOrderCreation = () => dispatch(createNewOrder(orderIngredients));

  const onOrderClick = () => {
    if (!canCreateOrder) return;
    isAuthenticated ? processOrderCreation() : redirectToLogin();
  };
  // Очистка конструктора
  const closeOrderModal = () => {
    dispatch(clearOrderModal());
    dispatch(clearConstructor());
  };
  // Работа с ценой
  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );
  // Изменение данных о заказе
  useEffect(() => {
    orderModalData && dispatch(clearConstructor());
  }, [orderModalData, dispatch]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
