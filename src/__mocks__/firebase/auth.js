// src/__mocks__/firebase/auth.js

export const getAuth = jest.fn(() => ({
  currentUser: { uid: 'mockUserId' },
}));

export const browserLocalPersistence = {};

export const setPersistence = jest.fn(() => Promise.resolve());
