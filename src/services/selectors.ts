import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';
// Список ингредиентов
export const listIngredients = (state: RootState) =>
  state.ingredients.ingredients;
// Загрузка ингредиентов
export const listIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;
// Данные ленты заказов
export const listFeeds = (state: RootState) => state.feed.orders;
// Загрузка ленты заказов
export const listFeedsLoading = (state: RootState) => state.feed.isLoading;
// Список заказов
export const listOrders = (state: RootState) => state.orders.orders;
// Загрузка списка заказов
export const listOrdersLoading = (state: RootState) => state.orders.isLoading;
// Загрузка пользователя
export const userLoading = (state: RootState) => state.user.isLoading;
// Текущее состояние конструктора
const getConstructorState = (state: RootState) => state.burgerConstructor;
// Возвращение элементов конструктора
export const getConstructorItems = createSelector(
  [getConstructorState],
  (constructor) => ({
    bun: constructor?.bun ?? null,
    ingredients: constructor?.ingredients ?? []
  })
);
// Получение модального окна
export const getOrderRequest = (state: RootState) =>
  state.orderModal.orderRequest;
// Получение модального окна
export const getOrderModalData = (state: RootState) =>
  state.orderModal.orderModalData;

export const getUser = (state: RootState) => state.auth.user;
export const getIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const getAuthenticationLoading = (state: RootState) =>
  state.auth.isLoading;
export const getAuthenticationError = (state: RootState) => state.auth.error;
