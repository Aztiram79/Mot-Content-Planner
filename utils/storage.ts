import AsyncStorage from '@react-native-async-storage/async-storage';
import { Post } from '@/types';

const POSTS_STORAGE_KEY = 'social_media_planner_posts';

// Get all posts
export const getAllPosts = async (): Promise<Post[]> => {
  try {
    const postsJson = await AsyncStorage.getItem(POSTS_STORAGE_KEY);
    if (!postsJson) return [];
    return JSON.parse(postsJson);
  } catch (error) {
    console.error('Error retrieving posts:', error);
    return [];
  }
};

// Get posts by date
export const getPostsByDate = async (date?: string): Promise<Post[]> => {
  try {
    const allPosts = await getAllPosts();
    
    if (!date) return allPosts;
    
    // Filter posts by the date (ignoring time)
    return allPosts.filter(post => {
      const postDate = post.scheduledDate.split('T')[0]; // Get just the date part
      return postDate === date;
    });
  } catch (error) {
    console.error('Error getting posts by date:', error);
    return [];
  }
};

// Add a new post
export const addPost = async (post: Post): Promise<void> => {
  try {
    const posts = await getAllPosts();
    posts.push(post);
    await AsyncStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
  } catch (error) {
    console.error('Error adding post:', error);
    throw error;
  }
};

// Update a post
export const updatePost = async (updatedPost: Post): Promise<void> => {
  try {
    const posts = await getAllPosts();
    const index = posts.findIndex(post => post.id === updatedPost.id);
    
    if (index !== -1) {
      posts[index] = {
        ...updatedPost,
        updatedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
    } else {
      throw new Error('Post not found');
    }
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

// Update post status
export const updatePostStatus = async (
  postId: string, 
  status: 'Draft' | 'Scheduled' | 'Published'
): Promise<void> => {
  try {
    const posts = await getAllPosts();
    const index = posts.findIndex(post => post.id === postId);
    
    if (index !== -1) {
      posts[index] = {
        ...posts[index],
        status,
        updatedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
    } else {
      throw new Error('Post not found');
    }
  } catch (error) {
    console.error('Error updating post status:', error);
    throw error;
  }
};

// Delete a post
export const deletePost = async (postId: string): Promise<void> => {
  try {
    const posts = await getAllPosts();
    const filteredPosts = posts.filter(post => post.id !== postId);
    await AsyncStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(filteredPosts));
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

// Clear all posts
export const clearAllPosts = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(POSTS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing posts:', error);
    throw error;
  }
};