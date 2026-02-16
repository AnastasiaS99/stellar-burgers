import authReducer, {
  loginInUser,
  registerNewUser,
  logoutUser,
  checkUserAuthentication,
  clearError,
  initialState
} from '../authenticationSlice';

import { TUser } from '@utils-types';

import * as burgerApi from '@api';
// Мок пользователя
jest.mock('@api', () => ({
  loginUserApi: jest.fn(),
  registerUserApi: jest.fn(),
  logoutApi: jest.fn(),
  getUserApi: jest.fn()
}));

jest.mock('../../../utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn(),
  getCookie: jest.fn(() => null)
}));
// Объект для теста
const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test User Name'
};
//
describe('authenticationSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });
  // Тест для сброса ошибки
  it('Очистка ошибки', () => {
    const state = authReducer(
      { ...initialState, error: 'Произошла ошибка' },
      clearError()
    );
    expect(state.error).toBeNull();
  });
  // Группа тестов на деятельность пользователя
  describe('loginUser', () => {
    // Ожидание начала процесса входа
    it('Is Loading - true', () => {
      const state = authReducer(initialState, {
        type: loginInUser.pending.type
      });
      expect(state.isLoading).toBe(true);
    });
    // Успешный вход
    it('Сохранение пользователя', () => {
      const state = authReducer(initialState, {
        type: loginInUser.fulfilled.type,
        payload: mockUser
      });
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
    });
    // Ошибки при входе
    it('Сброс авторизации в случае ошибки', () => {
      const state = authReducer(initialState, {
        type: loginInUser.rejected.type,
        error: { message: 'Произошла ошибка' }
      });
      expect(state.error).toBe('Произошла ошибка');
      expect(state.isAuthenticated).toBe(false);
    });
  });
  // Тесты для регистрации
  describe('registerUser', () => {
    // Ожидание начала регистрации
    it('isLoading в true', () => {
      const state = authReducer(initialState, {
        type: registerNewUser.pending.type
      });
      expect(state.isLoading).toBe(true);
    });
    // Успешная регистрация
    it('Сохранение и авторизация пользователя', () => {
      const state = authReducer(initialState, {
        type: registerNewUser.fulfilled.type,
        payload: mockUser
      });
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
    });
    // Ошибка регистрации
    it('Ошибка', () => {
      const state = authReducer(initialState, {
        type: registerNewUser.rejected.type,
        error: { message: 'Произошла ошибка' }
      });
      expect(state.error).toBe('Произошла ошибка');
      expect(state.isLoading).toBe(false);
    });
  });
  // Тест для выхода из системы
  describe('logoutUser', () => {
    it('Очистка пользователя', () => {
      const state = authReducer(
        { ...initialState, user: mockUser, isAuthenticated: true },
        { type: logoutUser.fulfilled.type }
      );
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });
  // Тест для проверки статуса авторизации
  describe('checkUserAuthentication', () => {
    it('isLoading в true', () => {
      const state = authReducer(initialState, {
        type: checkUserAuthentication.pending.type
      });
      expect(state.isLoading).toBe(true);
    });
    // Успешная проверка
    it('Сохранение пользователя и авторизация', () => {
      const state = authReducer(initialState, {
        type: checkUserAuthentication.fulfilled.type,
        payload: mockUser
      });
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
    });
    // Ошибка при проверке
    it('Сброс авторизации', () => {
      const state = authReducer(initialState, {
        type: checkUserAuthentication.rejected.type,
        error: { message: 'Произошла ошибка' }
      });
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });
});
