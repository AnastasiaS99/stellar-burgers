import { userReducer } from '../userSlice';
import type { TUser } from '@utils-types';
// Мок пользователя
const mockUser: TUser = {
  email: 'test@example.com',
  name: 'Test'
};
// Тесты
describe('Начальное состояние', () => {
  const initialState = userReducer(undefined, { type: 'UNKNOWN' });
  // Тест на загрузку
  it('loading', () => {
    const action: any = { type: 'user/fetchUser/pending' };
    const state = userReducer({ ...initialState, error: 'prev error' }, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });
  // Состояние после входа пользователя и успешной загрузки
  it('должен сохранять пользователя, выключать loading и помечать успешную загрузку', () => {
    const fulfilledAction: any = {
      type: 'user/fetchUser/fulfilled',
      payload: mockUser,
      meta: {}
    };
    const state = userReducer(
      { ...initialState, isLoading: true },
      fulfilledAction
    );

    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.error).toBeNull();
  });
  // Тест на ошибку входа пользователя
  it('должен сохранять ошибку, выключать loading', () => {
    const rejectedAction: any = {
      type: 'user/fetchUser/rejected',
      error: { message: 'Ошибка' },
      meta: {}
    };
    const state = userReducer(
      { ...initialState, isLoading: true },
      rejectedAction
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка');
  });
});
