import api from ".";

//Define User type
interface Metric {
    id: string;
    weight: number;
    height: number;
    BMI: number;
    childId: string;
    createDate: Date;
    updateDate: Date;
    status: boolean;
}

// Fetch child by ID
const getChildById = async (id: number): Promise<Metric> => {
    try {
        const response = await api.get<Metric>(`/metric/findById/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching child with ID ${id}:`, error);
        throw error;
    }
};