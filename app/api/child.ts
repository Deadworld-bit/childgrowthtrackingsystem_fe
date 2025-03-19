import api from ".";

// Define Child type
export interface Child {
    id: BigInt;
    name: string;
    dob: Date;
    gender: string;
    parentId: string;
    parentName: string;
    createDate: Date;
    updateDate: Date;
    status: boolean;
}

// Fetch all children with a doctor
const getChildHaveDoctor = async (): Promise<Child[]> => {
    try {
        const response = await api.get<{ status: string; message: string; data: Child[] }>("/child/getAllChildHaveDoctor");
        return response.data.data;
    } catch (error) {
        console.error("Error fetching children with a doctor:", error);
        throw error;
    }
};

// Fetch all children without a doctor
const getChildDontHaveDoctor = async (): Promise<Child[]> => {
    try {
        const response = await api.get<{ status: string; message: string; data: Child[] }>("/child/getAllChildDontHaveDoctor");
        return response.data.data;
    } catch (error) {
        console.error("Error fetching children without a doctor:", error);
        throw error;
    }
};

// Fetch child by ID
const getChildById = async (id: BigInt): Promise<Child> => {
    try {
        const response = await api.get<{ status: string; message: string; data: Child }>(`/child/findById/${id}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching child with ID ${id}:`, error);
        throw error;
    }
};

// Fetch child by Parent ID
const getChildByParentId = async (parentId: BigInt): Promise<Child> => {
    try {
        const response = await api.get<Child>(`/child/findByParentId/${parentId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching child with Parent ID ${parentId}:`, error);
        throw error;
    }
};

// Create a child
const createChild = async (childData: Omit<Child, "id" | "createDate" | "updateDate">): Promise<Child> => {
    try {
        const response = await api.post<Child>("/child/createChild", childData);
        return response.data; // The backend should return the full Child object with an auto-generated `id`
    } catch (error) {
        console.error("Error creating child:", error);
        throw error;
    }
};

// Update a child
const updateChild = async (id: BigInt, childData: Partial<Child>): Promise<Child> => {
    try {
        const response = await api.put<Child>(`/child/update/${id}`, childData);
        return response.data;
    } catch (error) {
        console.error(`Error updating child with ID ${id}:`, error);
        throw error;
    }
};

// Delete a child
const deleteChild = async (id: BigInt): Promise<void> => {
    try {
        await api.put(`/child/delete/${id}`);
    } catch (error) {
        console.error(`Error deleting child with ID ${id}:`, error);
        throw error;
    }
};

const childApi = {
    getChildHaveDoctor,
    getChildDontHaveDoctor,
    getChildById,
    getChildByParentId,
    createChild,
    updateChild,
    deleteChild
};

export default childApi;