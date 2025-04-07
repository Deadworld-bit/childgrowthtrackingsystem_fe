import api from ".";

export interface User {
    id: bigint;
    username: string;
    email: string;
    password: string;
    role: string;
    membership: string;
    createdDate: Date;
    updateDate: Date;
    status: boolean;
    specialization: string;
    certificate: string;
    childCount: number;
}

export interface Doctor {
    doctorId: bigint;
    specialization: string;
    certificate: string;
}

export interface DoctorData {
    specialization: string;
    certificate: string;
}

export interface Membership {
    id: bigint;
    username: string;
    planname: string;
    maxChildren: number;
    duration: number;
    startDate: Date;
    endDate: Date;
    status: boolean;
}

// Fetch all members
const getMembers = async (): Promise<{ status: string; message: string; data: User[] }> => {
    try {
        const response = await api.get<{ status: string; message: string; data: User[] }>("/users/member");
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

// Fetch all doctors
const getDoctors = async (): Promise<{ status: string; message: string; data: (User & DoctorData)[] }> => {
    try {
        const response = await api.get<{
            status: string;
            message: string;
            data: { user: User; specialization: string; certificate: string; childCount: number }[];
        }>("/users/doctor");
        const doctors = response.data.data.map((item) => ({
            ...item.user,
            specialization: item.specialization,
            certificate: item.certificate,
            childCount: item.childCount,
        }));
        return { status: response.data.status, message: response.data.message, data: doctors };
    } catch (error) {
        console.error("Error fetching doctors:", error);
        throw error;
    }
};

// Count doctors
const countDoctors = async (): Promise<{ status: string; message: string; data: number }> => {
    try {
        const response = await api.get<{ status: string; message: string; data: number }>("/users/countAllDoctor");
        return response.data;
    } catch (error) {
        console.error("Error counting doctors:", error);
        throw error;
    }
}

// Count members
const countMembers = async (): Promise<{ status: string; message: string; data: number }> => {
    try {
        const response = await api.get<{ status: string; message: string; data: number }>("/users/countAllMember");
        return response.data;
    } catch (error) {
        console.error("Error counting members:", error);
        throw error;
    }
}

// Count Basic members
const countBasicMembers = async (): Promise<{ status: string; message: string; data: number }> => {
    try {
        const response = await api.get<{ status: string; message: string; data: number }>("/users/countByMembershipBasic");
        return response.data;
    } catch (error) {
        console.error("Error counting members:", error);
        throw error;
    }
}

// Count Premium members
const countPremiumMembers = async (): Promise<{ status: string; message: string; data: number }> => {
    try {
        const response = await api.get<{ status: string; message: string; data: number }>("/users/countByMembershipPremium");
        return response.data;
    } catch (error) {
        console.error("Error counting members:", error);
        throw error;
    }
}

// Count VIP members
const countVIPMembers = async (): Promise<{ status: string; message: string; data: number }> => {
    try {
        const response = await api.get<{ status: string; message: string; data: number }>("/users/countByMembershipVIP");
        return response.data;
    } catch (error) {
        console.error("Error counting members:", error);
        throw error;
    }
}

// Fetch user by ID
const getUserById = async (id: bigint): Promise<{ status: string; message: string; data: User }> => {
    try {
        const response = await api.get<{ status: string; message: string; data: User }>(`/users/userid/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching user with ID ${id}:`, error);
        throw error;
    }
};

// Fetch doctor by ID
const getDoctorById = async (id: bigint): Promise<{ status: string; message: string; data: Doctor }> => {
    try {
        const response = await api.get<{ status: string; message: string; data: Doctor }>(`/users/doctor/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching doctor with ID ${id}:`, error);
        throw error;
    }
};

// Fetch membership by userId
const getMembershipByUserId = async (userId: bigint): Promise<{ status: string; message: string; data: Membership }> => {
    try {
        const response = await api.get<{ status: string; message: string; data: Membership }>(`/membership/${userId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching membership with userId ${userId}:`, error);
        throw error;
    }
};

// Create a new user
const createUser = async (
userData: { username: string; password: string; email: string; role: string; }
): Promise<{ status: string; message: string; data: User | null }> => {
    try {
        const response = await api.post<{ status: string; message: string; data: User | null }>("/users", userData);
        return response.data;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

// Update a user
const updateUser = async (id: bigint, userData: Partial<User>): Promise<{ status: string; message: string; data: User }> => {
    try {
        const response = await api.put<{ status: string; message: string; data: User }>(`/users/${id}`, userData);
        return response.data;
    } catch (error) {
        console.error(`Error updating user with ID ${id}:`, error);
        throw error;
    }
};

// Update a user profile
const updateUserProfile = async (id: bigint, userData: Partial<User>): Promise<{ status: string; message: string; data: User }> => {
    try {
        const response = await api.put<{ status: string; message: string; data: User }>(`/users/update/${id}`, userData);
        return response.data;
    } catch (error) {
        console.error(`Error updating user profile with ID ${id}:`, error);
        throw error;
    }
};

// Update doctor's specialization and certificate
const updateSpec = async (id: bigint, doctorData: Partial<Doctor>): Promise<{ status: string; message: string; data: Doctor }> => {
    try {
        const response = await api.put<{ status: string; message: string; data: Doctor }>(`/users/doctor/${id}`, doctorData);
        return response.data;
    } catch (error) {
        console.error(`Error updating doctor with ID ${id}:`, error);
        throw error;
    }
};

// Update user membership
const updateUserMembership = async (id: bigint, membership: string): Promise<{ status: string; message: string }> => {
    try {
        const response = await api.put<{ status: string; message: string }>(`/users/membership/${id}?membership=${membership}`);
        return response.data;
    } catch (error) {
        console.error(`Error updating membership for user with ID ${id}:`, error);
        throw error;
    }
};

// Delete a user
const deleteUser = async (id: bigint): Promise<{ status: string; message: string }> => {
    try {
        const response = await api.put<{ status: string; message: string }>(`/users/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting user with ID ${id}:`, error);
        throw error;
    }
};

const userApi = {
    getMembers,
    getDoctors,
    countDoctors,
    countMembers,
    countBasicMembers,
    countPremiumMembers,
    countVIPMembers,
    getUserById,
    getDoctorById,
    getMembershipByUserId,
    createUser,
    updateUser,
    updateUserProfile,
    updateSpec,
    updateUserMembership,
    deleteUser,
};

export default userApi;
