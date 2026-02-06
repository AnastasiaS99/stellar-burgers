import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { orderBurgerApi } from '@api';
// Определение состояния
export interface OrderModalState {
  orderRequest: boolean;
  orderModalData: TOrder | null;
}
// Начальное состояние
export const initialState: OrderModalState = {
  orderRequest: false,
  orderModalData: null
};
// Ингредиенты
export const createNewOrder = createAsyncThunk(
  'orderModal/createOrder',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);
    if (response.success) {
      return response.order;
    }
    throw new Error('Ошибка создания заказа');
  }
);
// Создание слайса
const orderModalSlice = createSlice({
  name: 'orderModal',
  initialState,
  reducers: {
    clearOrderModal: (state) => {
      state.orderModalData = null;
    },
    resetOrderRequest: (state) => {
      state.orderRequest = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.orderRequest = false;
      });
  }
});

export const { clearOrderModal, resetOrderRequest } = orderModalSlice.actions;
export default orderModalSlice.reducer;
