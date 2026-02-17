import orderReducer, {
  fetchOrders,
  createOrder,
  fetchOrderByNumber,
  clearCurrentOrder
} from '../ordersSlice';
import type { TOrder } from '../../../utils/types';
// Константы, чтобы убрать повторяющиеся селекторы
const error_msg_orders = 'Ошибка заказа';
const error_fetch_orders = 'Ошибка массива';
// Мок заказа
const mockOrder: TOrder = {
  _id: '1',
  status: 'done',
  name: 'Бургер',
  createdAt: '2026-01-20T00:00:00Z',
  updatedAt: '2026-01-20T01:00:00Z',
  number: 123,
  ingredients: ['abc', 'def']
};

describe('orderReducer', () => {
  // Начальное состояние редьюсера
  const initialState = orderReducer(undefined, { type: 'UNKNOWN' });
  // Поведение в начале заказа
  it('isLoading', () => {
    const action: any = {
      type: createOrder.pending.type,
      payload: undefined,
      meta: {}
    };
    const state = orderReducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });
  // Тест успешного оформления заказа
  it('должен сохранять заказ при', () => {
    const fulfilledAction: any = {
      type: createOrder.fulfilled.type,
      payload: mockOrder,
      meta: {}
    };
    const state = orderReducer(
      { ...initialState, isLoading: true },
      fulfilledAction
    );

    expect(state.isLoading).toBe(false);
    expect(state.currentOrder).toEqual(mockOrder);
    expect(state.error).toBeNull();
  });
  // Тест на обработку ошибки во время создания заказа
  it('должен сохранять ошибку', () => {
    const rejectedAction: any = {
      type: createOrder.rejected.type,
      error: { message: error_msg_orders },
      meta: {},
      arg: []
    };
    const state = orderReducer(
      { ...initialState, isLoading: true },
      rejectedAction
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(error_msg_orders);
  });
  // Тест на запрос списка заказов
  it('isLoading', () => {
    const action: any = {
      type: fetchOrders.pending.type,
      payload: undefined,
      meta: {}
    };
    const state = orderReducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });
  // Тест на успешное открытие заказов
  it('должен сохранять заказы при', () => {
    const payload: TOrder[] = [mockOrder];
    const fulfilledAction: any = {
      type: fetchOrders.fulfilled.type,
      payload,
      meta: {}
    };
    const state = orderReducer(
      { ...initialState, isLoading: true },
      fulfilledAction
    );

    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(payload);
    expect(state.error).toBeNull();
  });
  // Тест на ошибку при получении массива заказов
  it('должен сохранять ошибку', () => {
    const action: any = {
      type: fetchOrders.rejected.type,
      error: { message: error_fetch_orders },
      meta: {},
      arg: []
    };
    const state = orderReducer({ ...initialState, isLoading: true }, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(error_fetch_orders);
  });
  // Очистка текущего заказа
  it('должен очищать текущий заказ', () => {
    const withOrderState = { ...initialState, currentOrder: mockOrder };
    const state = orderReducer(withOrderState, clearCurrentOrder());
    expect(state.currentOrder).toBeNull();
  });
});
