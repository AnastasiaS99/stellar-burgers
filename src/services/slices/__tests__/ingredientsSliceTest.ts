import ingredientsReducer, { fetchIngredients } from '../ingredientsSlice';
import { TIngredient } from '../../../utils/types';
// Моки ингредиентов
const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0942',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
  }
];
// Группа для теста слайса
describe('ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null
  };
  // Тесты ингредиентов
  describe('fetchIngredients', () => {
    // Старт запроса
    it('isLoading в true', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.ingredients).toEqual([]);
    });
    // Тест успешного запроса
    it('isLoading в false и сохранение данных', () => {
      const pendingAction = { type: fetchIngredients.pending.type };
      const pendingState = ingredientsReducer(initialState, pendingAction);

      const fulfilledAction = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsReducer(pendingState, fulfilledAction);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.ingredients).toHaveLength(3);
    });
    // Тест для ошибки
    it('isLoading в false и сохранение ошибки', () => {
      const pendingAction = { type: fetchIngredients.pending.type };
      const pendingState = ingredientsReducer(initialState, pendingAction);

      const errorMessage = 'Произошла ошибка';
      const rejectedAction = {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      };
      const state = ingredientsReducer(pendingState, rejectedAction);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.ingredients).toEqual([]);
    });
    // Тест ошибки без сообщения
    it('Ошибка без сообщения', () => {
      const pendingAction = { type: fetchIngredients.pending.type };
      const pendingState = ingredientsReducer(initialState, pendingAction);

      const rejectedAction = {
        type: fetchIngredients.rejected.type,
        error: {}
      };
      const state = ingredientsReducer(pendingState, rejectedAction);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Failed to fetch ingredients');
      expect(state.ingredients).toEqual([]);
    });

    it('должен очистить ошибку при новом запросе', () => {
      const stateWithError = {
        ingredients: [],
        isLoading: false,
        error: 'Previous error'
      };

      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(stateWithError, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
  });
});
