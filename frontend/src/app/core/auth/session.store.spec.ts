import { SessionStore } from './session.store';

describe('SessionStore', () => {
  let store: SessionStore;

  beforeEach(() => {
    sessionStorage.clear();
    store = new SessionStore();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('stores and reads token from sessionStorage', () => {
    store.setToken('jwt-token');

    expect(store.getToken()).toBe('jwt-token');
    expect(store.isAuthenticated()).toBeTrue();
  });

  it('clears stored token', () => {
    store.setToken('jwt-token');
    store.clear();

    expect(store.getToken()).toBeNull();
    expect(store.isAuthenticated()).toBeFalse();
  });

  it('treats blank token as unauthenticated', () => {
    store.setToken('   ');

    expect(store.isAuthenticated()).toBeFalse();
  });
});
