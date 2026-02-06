import { forwardRef, useMemo } from 'react';
import { useSelector } from '../../services/store';
import { getConstructorItems } from '../../services/selectors';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
// Объявление компонента
export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  // Доступ к ингредиентам, которые были выбраны
  const constructorItems = useSelector(getConstructorItems);
  // Подсчёт количества, которое было выбрано
  const ingredientsCounters = useMemo(() => {
    const { bun, ingredients: constructorIngredients } = constructorItems;
    const counters: { [key: string]: number } = {};
    constructorIngredients.forEach((ingredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });
    if (bun) counters[bun._id] = 2;
    return counters;
  }, [constructorItems]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
