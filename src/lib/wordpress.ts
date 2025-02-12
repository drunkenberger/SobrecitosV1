export interface WordPressPost {
  id: number;
  date: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  featured_media?: number;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string;
    }>;
    author?: Array<{
      name: string;
      avatar_urls?: {
        [key: string]: string;
      };
    }>;
  };
  link: string;
  categories: number[];
  tags: number[];
}

export interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

import { proxyFetch } from "./proxy";

export const fetchPosts = async (
  page = 1,
  perPage = 10,
): Promise<WordPressPost[]> => {
  try {
    console.log(
      "Fetching posts from:",
      `${import.meta.env.VITE_WORDPRESS_URL}/posts?_envelope&page=${page}&number=${perPage}`,
    );
    const response = await proxyFetch(
      `${import.meta.env.VITE_WORDPRESS_URL}/posts?_envelope&page=${page}&number=${perPage}`,
      { method: "GET" },
    );
    if (!response.ok) {
      const text = await response.text();
      console.error("Response not ok:", response.status, text);
      throw new Error(`Failed to fetch posts: ${response.status} ${text}`);
    }
    const data = await response.json();
    console.log("Fetched posts:", data);
    // WordPress.com API returns data in a different format
    return data.body;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

export const fetchCategories = async (): Promise<WordPressCategory[]> => {
  try {
    const response = await proxyFetch(
      `${import.meta.env.VITE_WORDPRESS_URL}/categories?_envelope`,
      { method: "GET" },
    );
    if (!response.ok) throw new Error("Failed to fetch categories");
    const data = await response.json();
    return data.body;
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
    const response = await proxyFetch(
      `${import.meta.env.VITE_WORDPRESS_URL}/wp-json/wp/v2/posts?_embed&categories=${categoryId}&page=${page}&per_page=${perPage}`,
      { method: "GET" },
    );
    if (!response.ok) throw new Error("Failed to fetch posts");
    return response.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};
