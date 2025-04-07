import api from ".";

export interface Post {
    id: bigint;
    childId: BigInt;
    userId: BigInt;
    title: string;
    description: string;
    createdDate: Date;
    status: boolean;
}

// Fetch all posts by child ID
const getAllPostByChildId = async (childId: bigint): Promise<{ status: string; message: string; data:Post[]}> => {
    try {
        const response = await api.get<{status: string; message: string; data: Post[];}>(`/post/getAllPostByChildId/${childId}`);
        return response.data; 
    } catch (error) {
        console.error(`Error fetching posts for child with ID ${childId}:`, error);
        throw error;
    }
};

// Create a post
const createPost = async (childData: {userId: number; childId: number; title: string; description: string}): Promise<{ status: string; message: string; data:Post}> => {
    try {
        const response = await api.post<{status: string; message: string; data: Post; }>("/post/createPost", childData);
        return response.data; 
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
};

// Delete a post
const deletePost = async (id: bigint): Promise<{ status: string; message: string}> => {
    try {
        const response = await api.put<{ status: string; message: string }>(`/post/deletePost/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting post with ID ${id}:`, error);
        throw error;
    }
};

const postApi = {
    getAllPostByChildId, 
    createPost,
    deletePost
};

export default postApi;