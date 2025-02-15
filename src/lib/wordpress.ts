import { WordPressPost } from '../types/wordpress';

const WORDPRESS_API_URL = 'https://public-api.wordpress.com/wp/v2/sites/sobrecitos2.wordpress.com';

export async function getPosts(page = 1, perPage = 10): Promise<WordPressPost[]> {
  try {
    const url = `${WORDPRESS_API_URL}/posts?page=${page}&per_page=${perPage}&_embed`;
    console.log('Fetching posts from URL:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Response not OK:', response.status, response.statusText);
      throw new Error('Failed to fetch posts');
    }

    const posts = await response.json();
    console.log('Raw API response:', posts);

    if (!Array.isArray(posts)) {
      console.error('Posts is not an array:', posts);
      return [];
    }

    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return []; // Return empty array instead of throwing
  }
}

export async function getPost(id: number): Promise<WordPressPost> {
  try {
    const url = `${WORDPRESS_API_URL}/posts/${id}?_embed`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch post');
    }

    const post = await response.json();
    return post;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
}

export async function getPostBySlug(slug: string): Promise<WordPressPost> {
  try {
    const url = `${WORDPRESS_API_URL}/posts?slug=${slug}&_embed`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch post');
    }

    const posts = await response.json();
    
    if (!Array.isArray(posts) || posts.length === 0) {
      throw new Error('Post not found');
    }

    return posts[0]; // WordPress returns an array, but we only need the first post
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    throw error;
  }
}

export interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export const fetchCategories = async (): Promise<WordPressCategory[]> => {
  try {
    const url = `${WORDPRESS_API_URL}/categories`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    
    const categories = await response.json();
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const fetchPostsByCategory = async (
  categoryId: number,
  page = 1,
  perPage = 10,
): Promise<WordPressPost[]> => {
  try {
    const url = `${WORDPRESS_API_URL}/posts?categories=${categoryId}&page=${page}&per_page=${perPage}&_embed`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }
    
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};
