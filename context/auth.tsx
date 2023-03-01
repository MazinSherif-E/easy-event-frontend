export interface userData {
  token: String;
  userId: String;
}

export type AuthContextType = {
  data: userData;
  login: (token: String, userId: String, tokenExpiration: String) => void;
  logout: () => void;
};
