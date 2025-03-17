import api from ".";

// Define Metric type
export interface Metric {
    id: BigInt;
    weight: number;
    height: number;
    bmi: number;
    childId: string;
    recordedDate: Date;
    createDate: Date;
    status: boolean;
}

// Fetch metrics by child ID
const getMetricsByChildId = async (childId: BigInt): Promise<Metric[]> => {
    try {
        const response = await api.get<{ status: string; message: string; data: Metric[] }>(`/metric/findByChildId`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching metrics for child with ID ${childId}:`, error);
        throw error;
    }
};

const metricApi = {
    getMetricsByChildId,
};

export default metricApi;