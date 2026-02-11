export const setToken = (token: string) => {
  document.cookie = `access_token=${token}; path=/`;
};

export const getToken = (): string | null => {
  const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
  return match ? match[2] : null;
};

export const removeToken = () => {
  document.cookie = "token=; Max-Age=0; path=/";
};
