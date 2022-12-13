export const SaveToken = (token: string) => {
    sessionStorage.setItem('TOKEN', token);
}

export const GetToken = (): string | null => {
    return sessionStorage.getItem('TOKEN');
}

export const RemoveToken = () => {
    sessionStorage.removeItem('TOKEN');
}

export const SaveUserName = (username: string) => {
    sessionStorage.setItem('USERNAME', username);
}

export const GetUserName = (): string | null => {
    return sessionStorage.getItem('USERNAME');
}

export const RemoveUserName = () => {
    sessionStorage.removeItem('USERNAME');
}