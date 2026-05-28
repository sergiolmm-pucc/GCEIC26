const AUTH_KEY = 'gceic26-etec-auth';

export function login(username, password) {
  const authenticated = username === 'admin' && password === 'admin';

  if (authenticated) {
    window.localStorage.setItem(AUTH_KEY, 'true');
  }

  return authenticated;
}

export function logout() {
  window.localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated() {
  return window.localStorage.getItem(AUTH_KEY) === 'true';
}
