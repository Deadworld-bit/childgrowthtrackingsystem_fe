import api from ".";

//Define User type
interface Child {
    id: string;
    name: string;
    dob: Date;
    gender: string;
    parentId: string;
    createDate: Date;
    updateDate: Date;
    status: boolean;
}

// Fetch all children
const getChild = async (): Promise<Child[]> => {
    try {
        const response = await api.get<Child[]>("/child/getAllChild");
        return response.data;
    } catch (error) {
        console.error("Error fetching child:", error);
        throw error;
    }
};

// Fetch child by ID
const getChildById = async (id: number): Promise<Child> => {
    try {
        const response = await api.get<Child>(`/child/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching child with ID ${id}:`, error);
        throw error;
    }
};

// Fetch child by Parent ID
const getChildByParentId = async (parentId: number): Promise<Child> => {
    try {
        const response = await api.get<Child>(`/child/findByParentId/${parentId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching child with ID ${parentId}:`, error);
        throw error;
    }
};

// Create a child
const createChild = async (childData: Omit<Child, "id" | "createDate" | "updateDate">): Promise<Child> => {
    try {
        const response = await api.post<Child>("/child/createChild", childData);
        return response.data; // The backend should return the full User object with an auto-generated `id`
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

// Update a child
const updateChild = async (id: number, childData: Partial<Child>): Promise<Child> => {
    try {
        const response = await api.put<Child>(`/child/update/${id}`, childData);
        return response.data;
    } catch (error) {
        console.error(`Error updating child with ID ${id}:`, error);
        throw error;
    }
};

// Delete a user
const deleteChild = async (id: number): Promise<void> => {
    try {
      await api.delete(`/child/delete/${id}`);
    } catch (error) {
      console.error(`Error deleting child with ID ${id}:`, error);
      throw error;
    }
};

const childApi = {
    getChild,
    getChildById,
    getChildByParentId,
    createChild,
    updateChild,
    deleteChild
};

export default childApi;