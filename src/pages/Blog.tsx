import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ChevronRight } from "lucide-react";
import { getPosts } from "@/lib/wordpress";
import { WordPressPost } from "@/types/wordpress";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import SEO from "@/components/SEO";

const getFeaturedImageUrl = (post: WordPressPost) => {
  console.log('Getting featured image for post:', post.id, post.title.rendered);
  
  // First try jetpack_featured_media_url if available
  if (post.jetpack_featured_media_url) {
    console.log('Using jetpack_featured_media_url:', post.jetpack_featured_media_url);
    return post.jetpack_featured_media_url;
  }

  // Check if post has embedded media
  if (!post._embedded) {
    console.log('No _embedded field found');
    return null;
  }

  // Check for featured media
  const featuredMedia = post._embedded['wp:featuredmedia'];
  if (!featuredMedia || !Array.isArray(featuredMedia) || featuredMedia.length === 0) {
    console.log('No featured media array found');
    return null;
  }

  const media = featuredMedia[0];
  console.log('Media object:', media);

  // Return source_url if available
  if (media.source_url) {
    console.log('Using source_url:', media.source_url);
    return media.source_url;
  }

  console.log('No valid media URL found');
  return null;
};

export default function Blog() {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const postsData = await getPosts(1);
        console.log('Loaded posts with media:', postsData);
        setPosts(postsData);
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
    try {
      const newPosts = await getPosts(nextPage);
      if (newPosts.length > 0) {
        setPosts([...posts, ...newPosts]);
        setPage(nextPage);
        setHasMore(newPosts.length === 10);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
      setHasMore(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Blog</h1>
            <p className="text-lg text-muted-foreground">
              Tips and insights for better family budget management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-64 w-full" />
                <div className="p-8">
                  <Skeleton className="h-8 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-1/4 mb-4" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SEO 
        title="Sobrecitos Blog - Financial Tips & Budget Management Insights"
        description="Discover practical financial advice, budgeting tips, and money management strategies for families. Learn how to take control of your household finances."
        keywords="financial advice, budgeting tips, money management, family finance blog, household budget tips, financial planning guides"
      />
      <div className="min-h-screen bg-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Blog</h1>
            <p className="text-lg text-muted-foreground">
              Tips and insights for better family budget management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => {
              const featuredImageUrl = getFeaturedImageUrl(post);
              
              return (
                <Card
                  key={post.id}
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <Link to={`/blog/${post.slug}`} className="block">
                    {featuredImageUrl ? (
                      <div className="relative w-full h-72 overflow-hidden">
                        <img
                          src={featuredImageUrl}
                          alt={post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || post.title.rendered}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-72 bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">No image available</span>
                      </div>
                    )}
                    <div className="p-8">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(post.date).toLocaleDateString()}
                        </span>
                      </div>
                      <h2 
                        className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors leading-tight"
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                      />
                      <div
                        className={cn(
                          "prose prose-sm max-w-none mb-6 line-clamp-3",
                          "prose-slate dark:prose-invert",
                          "prose-p:text-muted-foreground prose-p:leading-relaxed",
                          "prose-strong:text-foreground prose-strong:font-semibold",
                          "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
                          "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                        )}
                        dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                      />
                      <Button 
                        variant="ghost" 
                        className="group-hover:text-primary transition-colors font-semibold pl-0 hover:bg-transparent"
                      >
                        Read More <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </Link>
                </Card>
              );
            })}
          </div>

          {hasMore && (
            <div className="text-center mt-16">
              <Button onClick={loadMore} variant="outline" size="lg" className="font-semibold">
                Load More Posts
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
