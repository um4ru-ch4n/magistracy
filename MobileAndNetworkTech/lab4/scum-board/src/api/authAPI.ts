import { axiosInstance } from "./api";

export const AuthAPI = {
    signIn: (username: string, password: string) =>
        axiosInstance().post<{ token: string }>('auth/login', { username, password })
            .then(res => {
                if (res.status !== 200) {
                    return {
                        error: res.statusText,
                        data: null,
                    }
                }

                return {
                    error: null,
                    data: {
                        token: res.data.token,
                    },
                }
            }),
    signUp: async (username: string, password: string) =>
        axiosInstance().post<{ token: string }>('auth/register', { username, password })
            .then(res => {
                if (res.status !== 201) {
                    return {
                        error: res.statusText,
                    }
                }

                return {
                    error: null,
                }
            }),
    userLoad: () =>
        axiosInstance(true).get('auth/validate')
            .then(res => {
                if (res.status !== 200) {
                    return {
                        error: res.statusText,
                        data: null,
                    }
                }
                
                return {
                    error: null,
                    data: res.data,
                }
            }),
}