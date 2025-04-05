import api from ".";

export interface UserLogin {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;            
    email: string;
    role: string;
    membership: string | null;   
    createdDate: string;
    updateDate: string;
    status: boolean;
  };
  authenticated: boolean;
}

export const loginUser = async (userLogin: UserLogin): Promise<LoginResponse> => {
  try {
    const resp = await api.post<{status: string; message: string; data: LoginResponse;}>("/authenticate/token", userLogin);
    return resp.data.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};
