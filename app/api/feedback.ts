import api from ".";

export interface Feedback {
    id : BigInt;
    userId: BigInt;
    parentname: string;
    doctorId: BigInt;
    doctorname: string;
    rating: number;
    description: string;
    createdDate: Date;
    updatedDate: Date;
}

// Fetch all feedbacks
const getFeedbacks = async (): Promise<Feedback[]> => {
    try {
        const response = await api.get<{ status: string; message: string; data: Feedback[] }>("/feedback");
        return response.data.data; 
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

// Fetch average rating for a specific doctor by ID
const getDoctorRating = async (doctorId: BigInt): Promise<number> => {
    try {
        const response = await api.get<{ status: string; message: string; data: number }>(`/feedback/doctor/rating/${doctorId}`);
        return response.data.data; 
    } catch (error) {
        console.error(`Error fetching rating for doctor ID ${doctorId}:`, error);
        throw error;
    }
};

// Fetch feedback for a specific doctor by ID
const getFeedbackByDoctorId = async (doctorId: BigInt): Promise<Feedback[]> => {
    try {
        const response = await api.get<{ status: string; message: string; data: Feedback[] }>(`/feedback/doctor/${doctorId}`);
        return response.data.data; 
    } catch (error) {
        console.error(`Error fetching feedback for doctor ID ${doctorId}:`, error);
        throw error;
    }
};

const createFeedback = async (feedbackData: {doctorId: number;parentId: number;description: string;rating: number;}): Promise<Feedback> => {
    try {
        const response = await api.post<{
            status: string;
            message: string;
            data: Feedback;
        }>(
            `/feedback/createFeedback?doctorId=${feedbackData.doctorId}&parentId=${feedbackData.parentId}`,
            {
                description: feedbackData.description,
                rating: feedbackData.rating,
            }
        );

        return response.data.data; // Return the created feedback object
    } catch (error) {
        console.error("Error creating feedback:", error);
        throw error;
    }
};

const feedbackApi = {
    getFeedbacks,
    getDoctorRating,
    getFeedbackByDoctorId,
    createFeedback
};

export default feedbackApi;

