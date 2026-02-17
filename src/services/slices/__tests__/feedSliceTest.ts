import { feedReducer, fetchFeed } from '../feedSlice';
import type { TOrdersData } from '@utils-types';
// Константы, чтобы убрать повторяющиеся селекторы
const request_id = 'request-id';
const error_msg = 'Произошла шибка';
// Блок тестов для тестирования ленты
describe('Лента', () => {
  const initialState = feedReducer(undefined, { type: 'UNKNOWN' });
  // Тестируем загрузку ленты
  it('is loading true', () => {
    const state = feedReducer(
      { ...initialState, error: 'prev error' },
      fetchFeed.pending(request_id, undefined)
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
      fetchFeed.fulfilled(payload as any, request_id, undefined) as any
    );

    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(payload);
  });
  // Тест обработки ошибки во время загрузки
  it('Сохранение ошибки', () => {
    const state = feedReducer(
      { ...initialState, isLoading: true },
      fetchFeed.rejected(new Error(error_msg), request_id, undefined, error_msg)
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(error_msg);
  });
});
