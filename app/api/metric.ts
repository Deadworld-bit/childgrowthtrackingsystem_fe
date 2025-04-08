import api from ".";

// Define Metric type
export interface Metric {
    id: bigint;
    weight: number;
    height: number;
    bmi: number;
    childId: bigint;
    recordedDate: Date;
    createDate: Date;
    status: boolean;
}

// Fetch metrics by child ID
const getMetricsByChildId = async (
    childId: BigInt
): Promise<{ status: string; message: string; data: Metric[] }> => {
    try {
        const response = await api.get<{
            status: string;
            message: string;
            data: Metric[];
        }>(`/metric/findByChildId/${childId}`);
        return response.data;
    } catch (error) {
        console.error(
            `Error fetching metrics for child with ID ${childId}:`,
            error
        );
        throw error;
    }
};

// Create a metric
const createMetric = async (metricData: {
    childId: number;
    weight: number;
    height: number;
    recordedDate: string;
}): Promise<{ status: string; message: string; data: Metric }> => {
    try {
        const response = await api.post<{
            status: string;
            message: string;
            data: Metric;
        }>("/metric/create", metricData);
        return response.data;
    } catch (error) {
        console.error("Error creating metric:", error);
        throw error;
    }
};

// Delete a metric
const deleteMetric = async (
    id: BigInt
): Promise<{ status: string; message: string }> => {
    try {
        const response = await api.put(`/metric/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting metric with ID ${id}:`, error);
        throw error;
    }
};

const metricApi = {
    getMetricsByChildId,
    createMetric,
    deleteMetric,
};

export default metricApi;
