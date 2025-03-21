import api from ".";

export interface Post {
    id: BigInt;
    childId: BigInt;
    userId: BigInt;
    title: string;
    description: string;
    createDate: Date; 
    status: boolean;
}

