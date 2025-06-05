const ANONYM_ID_KEY = 'anonymous_user_id';

export const getOrCreateAnonymId = () => {
  let anonymousId = localStorage.getItem(ANONYM_ID_KEY);
  if (!anonymousId) {
    anonymousId = 'anonymous-' + String(Date.now()) + '-' + Math.random().toString(36);
    localStorage.setItem(ANONYM_ID_KEY, anonymousId);
  }
  return anonymousId;
};
