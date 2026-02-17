import orderModalReducer, {
  createNewOrder,
  clearOrderModal,
  initialState
} from '../orderModalSlice';
import { TOrder } from '@utils-types';
// Константы, чтобы убрать повторяющиеся селекторы
const error_msg = 'Произошла ошибка';
// Мок апи для заказа
jest.mock('@api', () => ({
  orderBurgerApi: jest.fn()
}));
// Фиктивный заказ для теста
const mockOrder: TOrder = {
  _id: '1',
  ingredients: [],
  status: 'done',
  name: 'Бургер',
  createdAt: '2023-01-01',
  updatedAt: '2023-01-01',
  number: 1
};
//Тестирование модального окна
describe('Тест слайса', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  // Тест создания заказа
  describe('createOrder', () => {
    // Начало создания заказа
    it('Request в true', () => {
      const state = orderModalReducer(initialState, {
        type: createNewOrder.pending.type
      });
      expect(state.orderRequest).toBe(true);
    });
    // Тест для сохранения заказа
    it('Сохранение заказа', () => {
      const state = orderModalReducer(initialState, {
        type: createNewOrder.fulfilled.type,
        payload: mockOrder
      });
      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual(mockOrder);
    });
    // Тест для очистки данных выбранных товаров
    it('Очистка данных заказа в случае ошибки', () => {
      const state = orderModalReducer(initialState, {
        type: createNewOrder.rejected.type,
        error: { message: error_msg }
      });
      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toBeNull();
    });
  });
  // Тест для очистки модального окна
  it('Очистка', () => {
    const state = orderModalReducer(
      { ...initialState, orderModalData: mockOrder },
      clearOrderModal()
    );
    expect(state.orderModalData).toBeNull();
  });
});
