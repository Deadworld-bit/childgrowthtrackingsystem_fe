import api from ".";

export interface UserLogin {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: number;
        userName: string;
        email: string;
        role: string;
        membership: string;
        createdDate: string;
        updateDate: string;
        status: boolean;
    };
    authenticated: boolean;
}

export const loginUser = async (userLogin: UserLogin): Promise<LoginResponse> => {
    try {
        const response = await api.post<{ status: string; message: string; data: LoginResponse }>(
            "/authenticate/token",
            userLogin
        );
        return response.data.data;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};