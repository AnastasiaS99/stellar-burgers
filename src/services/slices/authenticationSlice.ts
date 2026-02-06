import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  loginUserApi,
  registerUserApi,
  logoutApi,
  getUserApi,
  TLoginData,
  TRegisterData
} from '@api';
import { setCookie, deleteCookie, getCookie } from '../../utils/cookie';
// Данные текущего пользователя
export interface authenticationState {
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}
// Начальные значения
export const initialState: authenticationState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: !!getCookie('accessToken')
};
// Структура при входе
interface authenticationResponse {
  success: boolean;
  user: TUser;
  accessToken: string;
  refreshToken: string;
}
// Получение данных о пользователе
interface responseFromUser {
  success: boolean;
  user: TUser;
}
// Вход в систему
export const loginInUser = createAsyncThunk(
  'authentication/login',
  async (data: TLoginData): Promise<TUser> => {
    const responseNew = await loginUserApi(data);
    if (responseNew.success) {
      const token = (
        responseNew as authenticationResponse
      ).accessToken.startsWith('Bearer ')
        ? (responseNew as authenticationResponse).accessToken.split(
            'Bearer '
          )[1]
        : (responseNew as authenticationResponse).accessToken;

      setCookie('accessToken', token, { expires: 1200 });
      localStorage.setItem(
        'refreshToken',
        (responseNew as authenticationResponse).refreshToken
      );

      return (responseNew as authenticationResponse).user;
    }
    throw new Error('Ошибка авторизации');
  }
);

export const registerNewUser = createAsyncThunk(
  'authentication/register',
  async (data: TRegisterData): Promise<TUser> => {
    const response = await registerUserApi(data);
    if (response.success) {
      const token = (response as authenticationResponse).accessToken.startsWith(
        'Bearer '
      )
        ? (response as authenticationResponse).accessToken.split('Bearer ')[1]
        : (response as authenticationResponse).accessToken;

      setCookie('accessToken', token, { expires: 1200 });
      localStorage.setItem(
        'refreshToken',
        (response as authenticationResponse).refreshToken
      );

      return (response as authenticationResponse).user;
    }
    throw new Error('Ошибка регистрации');
  }
);
// Выход
export const logoutUser = createAsyncThunk(
  'authentication/logout',
  async () => {
    await logoutApi();
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  }
);
// Проверка авторизации
export const checkUserAuthentication = createAsyncThunk(
  'authentication/checkUser',
  async (): Promise<TUser> => {
    const accessToken = getCookie('accessToken');
    if (!accessToken) {
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      throw new Error('Пользователь не авторизован');
    }

    const response = await getUserApi();
    if (response.success) {
      return (response as responseFromUser).user;
    }

    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
    throw new Error('Ошибка получения данных пользователя');
  }
);

const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    const waitingForProcessing = (state: authenticationState) => {
      state.isLoading = true;
      state.error = null;
    };

    const completedProcessing = (
      state: authenticationState,
      action: PayloadAction<TUser>
    ) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    };

    const errorProcessing = (
      state: authenticationState,
      action: { error: { message?: string } },
      defaultError: string
    ) => {
      state.isLoading = false;
      state.error = action.error.message || defaultError;
      state.isAuthenticated = false;
    };

    builder
      .addCase(loginInUser.pending, waitingForProcessing)
      .addCase(loginInUser.fulfilled, completedProcessing)
      .addCase(loginInUser.rejected, (state, action) => {
        errorProcessing(state, action, 'Ошибка авторизации');
      })
      .addCase(registerNewUser.pending, waitingForProcessing)
      .addCase(registerNewUser.fulfilled, completedProcessing)
      .addCase(registerNewUser.rejected, (state, action) => {
        errorProcessing(state, action, 'Ошибка регистрации');
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkUserAuthentication.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkUserAuthentication.fulfilled, completedProcessing)
      .addCase(checkUserAuthentication.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  }
});

export const { clearError } = authenticationSlice.actions;
export default authenticationSlice.reducer;
