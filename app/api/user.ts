import api from ".";

// Define User type
export interface User {
    id: BigInt;
    username: string;
    email: string;
    password:string;
    role: string;
    membership: string;
    createdDate: Date;
    updatedDate: Date;
    status: boolean;
    specialization: string;
    certificate: string;
}

export interface Doctor {
    specialization: string;
    certificate: string;
}

// Fetch all users
const getMembers = async (): Promise<User[]> => {
    try {
        const response = await api.get<{ status: string; message: string; data: User[] }>("/users/member");
        return response.data.data; 
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

// Fetch all doctors
const getDoctors = async (): Promise<(User & Doctor)[]> => {
    try {
        const response = await api.get<{ status: string; message: string; data: { user: User; specialization: string; certificate: string }[] }>("/users/doctor");
        return response.data.data.map((item) => ({
            ...item.user,
            specialization: item.specialization,
            certificate: item.certificate,
        }));
    } catch (error) {
        console.error("Error fetching doctors:", error);
        throw error;
    }
};

// Fetch user by ID
const getUserById = async (id: string): Promise<User> => {
    try {
        const response = await api.get<{ status: string; message: string; data: User }>(`/users/userid/${id}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching user with ID ${id}:`, error);
        throw error;
    }
};

const createUser = async (userData: {username: string; password: string; email: string; role: string;}): Promise<{ status: string; message: string; data: User | null }> => {
    try {
      const response = await api.post<{ status: string; message: string; data: User | null }>("/users",userData);
      return response.data; 
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };

// Update a user
const updateUser = async (id: BigInt, userData: Partial<User>): Promise<User> => {
    try {
        const response = await api.put<{ status: string; message: string; data: User }>(`/users/${id}`, userData);
        return response.data.data;
    } catch (error) {
        console.error(`Error updating user with ID ${id}:`, error);
        throw error;
    }
};

// Delete a user
const deleteUser = async (id: BigInt): Promise<void> => {
    try {
        await api.put(`/users/delete/${id}`);
    } catch (error) {
        console.error(`Error deleting user with ID ${id}:`, error);
        throw error;
    }
};

const userApi = {
    getMembers,
    getDoctors,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};

export default userApi;