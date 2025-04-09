import api from ".";

export interface Feedback {
    id : bigint;
    userId: bigint;
    parentname: string;
    doctorId: bigint;
    doctorname: string;
    rating: number;
    description: string;
    createdDate: Date;
    updatedDate: Date;
}

export interface ListDoctor {
    doctorId: bigint;
    doctorName: string;
    childId: bigint;
    childName: string;
}

// Fetch all feedbacks
const getFeedbacks = async (): Promise<{ status: string; message: string; data: Feedback[] }> => {
    try {
        const response = await api.get<{ status: string; message: string; data: Feedback[] }>("/feedback");
        return response.data; 
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

// Fetch all Doctors by parent ID
const getDoctorListByParentId = async (parentId: bigint): Promise<{ status: string; message: string; data: ListDoctor[] }> => {
    try {
        const response = await api.get<{ status: string; message: string; data: ListDoctor[] }>(`/feedback/${parentId}`);
        return response.data; 
    } catch (error) {
        console.error(`Error fetching doctors for parent ID ${parentId}:`, error);
        throw error;
    }
};

// Fetch average rating for a specific doctor by ID
const getDoctorRating = async (doctorId: bigint): Promise<{ status: string; message: string; data: number }> => {
    try {
        const response = await api.get<{ status: string; message: string; data: number }>(`/feedback/doctor/rating/${doctorId}`);
        return response.data; 
    } catch (error) {
        console.error(`Error fetching rating for doctor ID ${doctorId}:`, error);
        throw error;
    }
};

// Fetch feedback for a specific doctor by ID
const getFeedbackByDoctorId = async (doctorId: bigint): Promise<{ status: string; message: string; data: Feedback[] }> => {
    try {
        const response = await api.get<{ status: string; message: string; data: Feedback[] }>(`/feedback/doctor/${doctorId}`);
        return response.data; 
    } catch (error) {
        console.error(`Error fetching feedback for doctor ID ${doctorId}:`, error);
        throw error;
    }
};

// Create a new feedback
const createFeedback = async (feedbackData: {doctorId: number;parentId: number;description: string;rating: number;}): Promise<{ status: string; message: string; data: Feedback }> => {
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

        return response.data; 
    } catch (error) {
        console.error("Error creating feedback:", error);
        throw error;
    }
};

// Delete a feedback by ID
const deleteFeedback = async (id: bigint): Promise<{ status: string; message: string }> => {
    try {
        const response = await api.put<{ status: string; message: string }>(`/feedback/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting user with ID ${id}:`, error);
        throw error;
    }
};

const feedbackApi = {
    getFeedbacks,
    getDoctorListByParentId,
    getDoctorRating,
    getFeedbackByDoctorId,
    createFeedback,
    deleteFeedback,
};

export default feedbackApi;

