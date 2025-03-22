import api from ".";

export interface Post {
    id: BigInt;
    childId: BigInt;
    userId: BigInt;
    title: string;
    description: string;
    createdDate: Date;
    status: boolean;
}

// Fetch all posts by child ID
const getAllPostByChildId = async (childId: BigInt): Promise<Post[]> => {
    try {
        const response = await api.get<{status: string; message: string; data: Post[];}>(`/post/getAllPostByChildId/${childId}`);
        return response.data.data; 
    } catch (error) {
        console.error(`Error fetching posts for child with ID ${childId}:`, error);
        throw error;
    }
};

// Create a post
const createPost = async (childData: {userId: number; childId: number; title: string; description: string}): Promise<Post> => {
    try {
        const response = await api.post<{status: string; message: string; data: Post; }>("/post/createPost", childData);
        return response.data.data; 
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
};

// Delete a post
const deletePost = async (id: BigInt): Promise<void> => {
    try {
        await api.put(`/post/deletePost/${id}`);
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