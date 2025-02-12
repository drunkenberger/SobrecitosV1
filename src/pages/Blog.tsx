import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ChevronRight } from "lucide-react";
import {
  fetchPosts,
  fetchCategories,
  WordPressPost,
  WordPressCategory,
} from "@/lib/wordpress";
import { Link } from "react-router-dom";

export default function Blog() {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [categories, setCategories] = useState<WordPressCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [postsData, categoriesData] = await Promise.all([
          fetchPosts(1),
          fetchCategories(),
        ]);
        setPosts(postsData);
        setCategories(categoriesData);
        setHasMore(postsData.length === 10);
      } catch (error) {
        console.error("Error loading blog data:", error);
      }
      setLoading(false);
    };

    loadInitialData();
  }, []);

  const loadMore = async () => {
    const nextPage = page + 1;
    const newPosts = await fetchPosts(nextPage);
    if (newPosts.length > 0) {
      setPosts([...posts, ...newPosts]);
      setPage(nextPage);
      setHasMore(newPosts.length === 10);
    } else {
      setHasMore(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/4 mb-2" />
                <Skeleton className="h-24 w-full" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-lg text-muted-foreground">
            Tips and insights for better family budget management
          </p>
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {categories.map((category) => (
              <Badge key={category.id} variant="secondary">
                {category.name} ({category.count})
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="p-6 hover:shadow-lg transition-shadow"
            >
              {post._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
                <img
                  src={post._embedded["wp:featuredmedia"][0].source_url}
                  alt={post.title.rendered}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h2 className="text-2xl font-bold mb-2">{post.title.rendered}</h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.date).toLocaleDateString()}
                </span>
                {post._embedded?.author?.[0]?.name && (
                  <span>By {post._embedded.author[0].name}</span>
                )}
              </div>
              <div
                className="text-muted-foreground mb-4"
                dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
              />
              <Button asChild>
                <Link
                  to={`/blog/${post.id}`}
                  className="flex items-center gap-2"
                >
                  Read More <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            </Card>
          ))}
        </div>

        {hasMore && (
          <div className="text-center mt-8">
            <Button onClick={loadMore} variant="outline" size="lg">
              Load More Posts
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
