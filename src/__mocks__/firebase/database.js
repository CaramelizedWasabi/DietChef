// src/__mocks__/firebase/database.js

export const getDatabase = jest.fn(() => ({}));

export const ref = jest.fn();

export const onValue = jest.fn((ref, callback) => {
  callback({
    exists: () => true,
    val: () => ({
      calories: 2000,
      carbs: 250,
      protein: 100,
    }),
  });
  return jest.fn();
});

