import api from ".";

// Define Metric type
export interface Metric {
    id: BigInt;
    weight: number;
    height: number;
    bmi: number;
    childId: BigInt;
    recordedDate: Date;
    createDate: Date;
    status: boolean;
}

// Fetch metrics by child ID
const getMetricsByChildId = async (childId: BigInt): Promise<Metric[]> => {
    try {
        const response = await api.get<{
            status: string;
            message: string;
            data: Metric[];
        }>(`/metric/findByChildId/${childId}`);
        return response.data.data;
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
}): Promise<Metric> => {
    try {
        const response = await api.post<{
            status: string;
            message: string;
            data: string; // The data is a string representation of the Metric
        }>("/metric/create", metricData);

        // Parse the string response into a Metric object
        const parsedMetric = parseMetricString(response.data.data);

        return parsedMetric; // Return the parsed Metric object
    } catch (error) {
        console.error("Error creating metric:", error);
        throw error;
    }
};

// Helper function to parse the string response
const parseMetricString = (metricString: string): Metric => {
    const regex =
        /Metric\{id=(\d+), weight=([\d.]+), height=([\d.]+), BMI=([\d.]+), recordedDate=([\d-:T.]+), createDate=([\d-:T.]+), status=(\w+)\}/;
    const match = metricString.match(regex);

    if (!match) {
        throw new Error("Failed to parse metric string");
    }

    return {
        id: BigInt(match[1]),
        weight: parseFloat(match[2]),
        height: parseFloat(match[3]),
        bmi: parseFloat(match[4]),
        recordedDate: new Date(match[5]),
        createDate: new Date(match[6]),
        status: match[7] === "true",
        childId: BigInt(0), // Set a default value for childId if it's not included in the string
    };
};

// Delete a metric
const deleteMetric = async (id: BigInt): Promise<void> => {
    try {
        await api.put(`/metric/delete/${id}`);
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
