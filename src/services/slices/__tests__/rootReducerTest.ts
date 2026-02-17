import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../../rootReducer';
// Начало теста
describe('rootReducer', () => {
  it('должен корректно инициализировать состояние всех слайдов при неизвестном действии', () => {
    const unknownAction = { type: 'UNKMOWN_ACTION' };
    const state = rootReducer(undefined, unknownAction as any);
    // Проверка ключей
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('orders');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('user');
    // Проверяем значения для каждого слайса
    expect(state.ingredients).toEqual({
      ingredients: [],
      isLoading: false,
      error: null
    });
    // Пример бургера
    expect(state.burgerConstructor).toMatchObject({
      bun: null,
      ingredients: []
    });
    // Тест на состояние заказов
    expect(state.orders).toEqual({
      orders: [],
      currentOrder: null,
      isLoading: false,
      error: null
    });

    expect(state.feed).toEqual({ orders: null, isLoading: false, error: null });

    expect(state.user).toEqual({ user: null, isLoading: false, error: null });
  });
  // Тест на корректную сборку
  it('Должен корректно собирать состояние', () => {
    const store = configureStore({ reducer: rootReducer });
    const state = store.getState();

    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('orders');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('user');

    expect(state.ingredients).toEqual({
      ingredients: [],
      isLoading: false,
      error: null
    });
    expect(state.burgerConstructor).toMatchObject({
      bun: null,
      ingredients: []
    });
    expect(state.orders).toEqual({
      orders: [],
      currentOrder: null,
      isLoading: false,
      error: null
    });
    expect(state.feed).toEqual({ orders: null, isLoading: false, error: null });
    expect(state.user).toEqual({ user: null, isLoading: false, error: null });
  });
});
