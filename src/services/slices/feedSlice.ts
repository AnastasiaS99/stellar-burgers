import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import { TOrdersData } from '../../utils/types';
// Определение состояния
interface feedState {
  orders: TOrdersData | null;
  isLoading: boolean;
  error: string | null;
}
// Начальное состояние
const initialState: feedState = {
  orders: null,
  isLoading: false,
  error: null
};
// Получение ответа
export const fetchFeed = createAsyncThunk('feed/fetchFeed', async () => {
  const response = await getFeedsApi();
  return response;
});
// Создание слайса
const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch feed';
      });
  }
});

export default feedSlice.reducer;
export const feedReducer = feedSlice.reducer;
