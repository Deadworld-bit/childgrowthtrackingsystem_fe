import api from ".";

export interface MembershipPlan {
    id: bigint;
    name: string;
    description: string;
    features: string;
    annualPrice: number;
    maxChildren: number;
    duration: number;
    createdDate: Date;
    updateDate: Date;
    status: boolean;
}

//Fetch all membership plans
const getMembershipPlans = async (): Promise<{status: string; message: string; data: MembershipPlan[]}> => {
    try {
        const response = await api.get<{
            status: string;
            message: string;
            data: MembershipPlan[];
        }>("/membershipplan/getAll");
        return response.data;
    } catch (error) {
        console.error("Error fetching membership plans:", error);
        throw error;
    }
};

//Fetch all membership plans
const getActiveMembershipPlans = async (): Promise<{status: string; message: string; data: MembershipPlan[]}> => {
    try {
        const response = await api.get<{
            status: string;
            message: string;
            data: MembershipPlan[];
        }>("/membershipplan/getAllActive");
        return response.data;
    } catch (error) {
        console.error("Error fetching membership plans:", error);
        throw error;
    }
};

//Create a new membership plan
const createMembershipPlan = async (membershipPlan: MembershipPlan): Promise<{ status: string; message: string; data: MembershipPlan }> => {
    try {
        const response = await api.post<{
            status: string;
            message: string;
            data: MembershipPlan;
        }>("/membershipplan/create", membershipPlan);
        return response.data;
    } catch (error) {
        console.error("Error creating membership plan:", error);
        throw error;
    }
};

//Update a membership plan
const updateMembershipPlan = async (id: bigint, membershipPlanData: Partial<MembershipPlan>): Promise<{ status: string; message: string; data: MembershipPlan }> => {
    try {
        const response = await api.put<{
            status: string;
            message: string;
            data: MembershipPlan;
        }>(`/membershipplan/update/${id}`, membershipPlanData);
        return response.data;
    } catch (error) {
        console.error("Error updating membership plan:", error);
        throw error;
    }
};

//Disable a membership plan
const disableMembershipPlan = async (id: bigint): Promise<{ status: string; message: string}> => {
    try {
        const response = await api.put<{ status: string; message: string }>(`/membershipplan/disable/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting user with ID ${id}:`, error);
        throw error;
    }
};

//Active a membership plan
const activeMembershipPlan = async (id: bigint): Promise<{ status: string; message: string}> => {
    try {
        const response = await api.put<{ status: string; message: string }>(`/membershipplan/active/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error activating user with ID ${id}:`, error);
        throw error;
    }
};

const membershipPlanApi = {
    getMembershipPlans,
    getActiveMembershipPlans,
    createMembershipPlan,
    updateMembershipPlan,
    disableMembershipPlan,
    activeMembershipPlan,
};

export default membershipPlanApi;
