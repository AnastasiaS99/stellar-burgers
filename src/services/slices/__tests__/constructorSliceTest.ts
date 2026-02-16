import {
  constructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredient
} from '../constructorSlice';

import type { TConstructorIngredient } from '@utils-types';

const createIngredient = (
  overrides: Partial<TConstructorIngredient>
): TConstructorIngredient => ({
  _id: 'test-id',
  name: 'test-name',
  type: 'main',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 1,
  image: 'test-image',
  image_large: 'test-image-large',
  image_mobile: 'test-image-mobile',
  id: 'constructor-id',
  ...overrides
});
// Тесты для конструктора
describe('Бургер конструктор', () => {
  // Тест на добавление булки
  it('Добавление только булки', () => {
    const bun = createIngredient({
      _id: 'bun-1',
      id: 'bun-instance-1',
      type: 'bun',
      name: 'Bun'
    });

    const state = constructorReducer(undefined, addIngredient(bun));

    const { id: _removedId, ...bunWithoutId } = bun;

    expect(state.bun).toEqual(bun);
    expect(state.ingredients).toEqual([]);
  });
  // Тест на добавление начинки
  it('Добавление только начинки', () => {
    const main = createIngredient({
      _id: 'main-1',
      id: 'main-instance-1',
      type: 'main',
      name: 'Main'
    });

    const state = constructorReducer(undefined, addIngredient(main));

    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([main]);
  });
  // Тест для удаления ингредиента
  it('Удаление ингредиента', () => {
    const ing1 = createIngredient({ _id: 'main-1', id: 'id-1', name: 'A' });
    const ing2 = createIngredient({ _id: 'main-2', id: 'id-2', name: 'B' });

    const preloaded = {
      bun: null,
      ingredients: [ing1, ing2]
    };

    const state = constructorReducer(preloaded, removeIngredient('id-1'));

    expect(state.ingredients).toEqual([ing2]);
  });
  // Тест для перемещений ингредиентов
  it('Перемещение ингредиентов', () => {
    const ing1 = createIngredient({ id: 'id-1', name: '1' });
    const ing2 = createIngredient({ id: 'id-2', name: '2' });
    const ing3 = createIngredient({ id: 'id-3', name: '3' });

    const preloaded = {
      bun: null,
      ingredients: [ing1, ing2, ing3]
    };

    const state = constructorReducer(
      preloaded,
      moveIngredient({ fromIndex: 2, toIndex: 1 })
    );
    // Проверка перемещения ингредиентов
    expect(state.ingredients.map((i) => i.id)).toEqual([
      'id-1',
      'id-3',
      'id-2'
    ]);
  });
});
