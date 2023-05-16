export type FormLogin = LoginResponseType & LoginRequestType;

export type LoginRequestType = {
  email: string;
  password: string;
  expoToken: string | undefined;
};

export type LoginResponseType = {
  token: string;
};
