export type FormLogin = LoginResponseType & LoginRequestType

export type LoginRequestType = {
    email: string,
    password: string,
}

export type LoginResponseType = {
    token : string
}