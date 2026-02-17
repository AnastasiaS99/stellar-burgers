import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { getUserApi } from '@api';
// Определение состояния
export interface UserState {
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
}
// Начальное состояние
export const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null
};
// Данные пользователя
export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  const response = await getUserApi();

  if (response.success) {
    return response.user;
  }

  throw new Error('Ошибка получения данных пользователя');
});
// Создание слайса
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
    },
    clearUserError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Ошибка загрузки данных пользователя';
      });
  }
});

export const { clearUser, clearUserError } = userSlice.actions;
export default userSlice.reducer;
export const userReducer = userSlice.reducer;
