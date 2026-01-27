import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useDispatch, useSelector } from '../../services/store';
import {
  listIngredients,
  listIngredientsLoading
} from '../../services/selectors';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
// Объявление компонента
export const IngredientDetails: FC = () => {
  // Получение ID
  const { id } = useParams<{ id: string }>();
  // Отправка действий
  const dispatch = useDispatch();
  // Список ингредиентов
  const ingredients = useSelector(listIngredients);
  // Загрузка ингредиентов
  const isLoading = useSelector(listIngredientsLoading);
  // Загрузка данных
  useEffect(() => {
    if (!ingredients.length && !isLoading) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length, isLoading]);
  // Поиск нужного ингредиента
  const ingredientData = useMemo(
    () => ingredients.find((ing) => ing._id === id),
    [ingredients, id]
  );
  // Отображение компонента
  if (isLoading || !ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
