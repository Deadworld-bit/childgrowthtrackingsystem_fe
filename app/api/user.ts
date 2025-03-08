import api from ".";

// Define User type
export interface User {
    id: string;
    userName: string;
    email: string;
    roleId: string;
    membership: string;
    createdDate: Date;
    updatedDate: Date;
    status: boolean;
}

// Fetch all users
const getUsers = async (): Promise<User[]> => {
    try {
        const response = await api.get<{ status: string; message: string; data: User[] }>("/users");
        return response.data.data; 
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

// Fetch user by ID
const getUserById = async (id: string): Promise<User> => {
    try {
        const response = await api.get<User>(`/users/userid/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching user with ID ${id}:`, error);
        throw error;
    }
};

// Update a user
const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
    try {
        const response = await api.put<User>(`/users/${id}`, userData);
        return response.data;
    } catch (error) {
        console.error(`Error updating user with ID ${id}:`, error);
        throw error;
    }
};

// Delete a user
const deleteUser = async (id: string): Promise<void> => {
    try {
        await api.put(`/users/${id}`);
    } catch (error) {
        console.error(`Error deleting user with ID ${id}:`, error);
        throw error;
    }
};

const userApi = {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
};

export default userApi;