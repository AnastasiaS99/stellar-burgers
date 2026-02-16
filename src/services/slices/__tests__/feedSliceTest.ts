import { feedReducer, fetchFeed } from '../feedSlice';
import type { TOrdersData } from '@utils-types';
// Блок тестов для тестирования ленты
describe('Лента', () => {
  const initialState = feedReducer(undefined, { type: 'UNKNOWN' });
  // Тестируем загрузку ленты
  it('is loading true', () => {
    const state = feedReducer(
      { ...initialState, error: 'prev error' },
      fetchFeed.pending('request-id', undefined)
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });
  // Тест на данные ленты
  it('Данные загрузки', () => {
    const payload: any = {
      success: true,
      orders: [
        {
          _id: 'order-1',
          status: 'done',
          name: 'Order 1',
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-01T00:00:00.000Z',
          number: 1,
          ingredients: ['ing-1']
        }
      ],
      total: 10,
      totalToday: 3
    };
    // Вызов текущего состояния
    const state = feedReducer(
      { ...initialState, isLoading: true },
      fetchFeed.fulfilled(payload as any, 'request-id', undefined) as any
    );

    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(payload);
  });
  // Тест обработки ошибки во время загрузки
  it('Сохранение ошибки', () => {
    const state = feedReducer(
      { ...initialState, isLoading: true },
      fetchFeed.rejected(new Error('Ошибка'), 'request-id', undefined, 'Ошибка')
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка');
  });
});
