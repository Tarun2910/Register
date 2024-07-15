export const authRole = {
  Admin: ['admin', 'user'],
  User: ['user'],
};

export const defaultUser = {
  displayName: 'Tarun sharma',
  email: 'Tarun@costacloud.com',
  token: 'access-token',
  role: 'user',
  photoURL: '/assets/images/avatar/A11.jpg',
};
export const allowMultiLanguage =
  window.__ENV__.REACT_APP_MULTILINGUAL === 'true';
export const fileStackKey = window.__ENV__.REACT_APP_FILESTACK_KEY;
export const initialUrl = '/teamSync'; // this url will open after login
