import api from ".";

// Define Child type
export interface Child {
    id: BigInt;
    name: string;
    dob: Date;
    gender: string;
    parentId: string;
    parentName: string;
    doctorId: BigInt;
    createDate: Date;
    updateDate: Date;
    status: boolean;
}

// Fetch all children with a doctor
const getChildHaveDoctor = async (): Promise<Child[]> => {
    try {
        const response = await api.get<{
            status: string;
            message: string;
            data: Child[];
        }>("/child/getAllChildHaveDoctor");
        return response.data.data;
    } catch (error) {
        console.error("Error fetching children with a doctor:", error);
        throw error;
    }
};

// Fetch all children without a doctor
const getChildDontHaveDoctor = async (): Promise<Child[]> => {
    try {
        const response = await api.get<{
            status: string;
            message: string;
            data: Child[];
        }>("/child/getAllChildDontHaveDoctor");
        return response.data.data;
    } catch (error) {
        console.error("Error fetching children without a doctor:", error);
        throw error;
    }
};

// Fetch child by ID
const getChildById = async (id: BigInt): Promise<Child> => {
    try {
        const response = await api.get<{
            status: string;
            message: string;
            data: Child;
        }>(`/child/findById/${id}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching child with ID ${id}:`, error);
        throw error;
    }
};

const getChildByParentId = async (parentId: BigInt): Promise<Child[]> => {
    try {
        const response = await api.get<{
            status: string;
            message: string;
            data: Child[];
        }>(`/child/findByParentId/${parentId}`);
        return response.data.data;
    } catch (error) {
        console.error(
            `Error fetching child with Parent ID ${parentId}:`,
            error
        );
        throw error;
    }
};

const getChildByDoctorId = async (doctorId: BigInt): Promise<Child[]> => {
    try {
        const response = await api.get<{
            status: string;
            message: string;
            data: Child[];
        }>(`/child/getChildByDoctorId/${doctorId}`);
        return response.data.data;
    } catch (error) {
        console.error(
            `Error fetching child with Parent ID ${doctorId}:`,
            error
        );
        throw error;
    }
};

// Set doctor for a child
const setDoctor = async (id: BigInt, doctorId: BigInt): Promise<Child> => {
    try {
        const response = await api.put<{
            status: string;
            message: string;
            data: Child;
        }>(`/child/setDoctor/${id}`, null, {
            params: { doctorId: doctorId.toString() },
        });
        return response.data.data;
    } catch (error) {
        console.error(`Error setting doctor for child with ID ${id}:`, error);
        throw error;
    }
};

// Create a child
const createChild = async (childData: {name: string; dob: string; gender: string; parentId: number; }): Promise<Child> => {
    try {
        const response = await api.post<{status: string; message: string; data: Child; }>("/child/createChild", childData);
        return response.data.data; 
    } catch (error) {
        console.error("Error creating child:", error);
        throw error;
    }
};

// Update a child
const updateChild = async (
    id: BigInt,
    childData: Partial<Child>
): Promise<Child> => {
    try {
        const response = await api.put<{
            status: string;
            message: string;
            data: Child;
        }>(`/child/update/${id}`, childData);
        return response.data.data;
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
    getChildByDoctorId,
    setDoctor,
    createChild,
    updateChild,
    deleteChild,
};

export default childApi;
