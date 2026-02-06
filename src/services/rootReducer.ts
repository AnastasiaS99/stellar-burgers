import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from '../services/slices/ingredientsSlice';
import feedReducer from '../services/slices/feedSlice';
import ordersReducer from '../services/slices/ordersSlice';
import userReducer from '../services/slices/userSlice';
import constructorReducer from './slices/constructorSlice';
import orderModalReducer from '../services/slices/orderModalSlice';
import authReducer from './slices/authenticationSlice';
// Сборка нескольких редьюсеров в один
export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  feed: feedReducer,
  orders: ordersReducer,
  user: userReducer,
  burgerConstructor: constructorReducer,
  orderModal: orderModalReducer,
  auth: authReducer
});
