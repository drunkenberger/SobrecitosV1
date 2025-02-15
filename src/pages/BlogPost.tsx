import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";
import { WordPressPost } from "@/types/wordpress";
import { getPostBySlug } from "@/lib/wordpress";
import SEO from "@/components/SEO";

const getFeaturedImageUrl = (post: WordPressPost) => {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  if (!media) return null;

  // Try to get the large size first, then medium, then fall back to full size
  const sizes = media.media_details?.sizes;
  if (sizes) {
    return sizes.large?.source_url || sizes.medium?.source_url || sizes.full?.source_url;
  }
  
  // Fall back to the default source_url if no sizes are available
  return media.source_url;
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<WordPressPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const postData = await getPostBySlug(slug);
        setPost(postData);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/4 mb-8" />
            <Skeleton className="h-[400px] w-full mb-8" />
            <div className="space-y-6">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground">
              The requested post could not be found.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  const featuredImageUrl = getFeaturedImageUrl(post);

  return (
    <div>
      {post && (
        <SEO 
          title={`${post.title.rendered} - Sobrecitos Blog`}
          description={post.excerpt.rendered.replace(/<[^>]*>/g, '').slice(0, 160)}
          keywords={`family budget, money management, financial planning, ${post.title.rendered.toLowerCase()}, personal finance tips, household budgeting`}
          image={post._embedded?.['wp:featuredmedia']?.[0]?.source_url}
        />
      )}
      <div className="min-h-screen bg-background py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden">
            <article className="p-8">
              <div className="text-center space-y-4 mb-8">
                <h1 
                  className="text-3xl sm:text-4xl font-bold text-foreground leading-tight"
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground border-b border-border pb-6">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {featuredImageUrl && (
                <div className="relative w-full h-[400px] overflow-hidden rounded-lg mb-8">
                  <img
                    src={featuredImageUrl}
                    alt={post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || post.title.rendered}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div
                className="wordpress-content"
                dangerouslySetInnerHTML={{ __html: post.content.rendered }}
              />
            </article>
          </Card>
        </div>
      </div>
    </div>
  );
}
