export function BlogCard({ post }: { post: WordPressPost }) {
  return (
    <Card className="overflow-hidden">
      <AspectRatio ratio={16 / 9}>
        <img
          src={post.featured_media_url || "/placeholder-blog.jpg"}
          alt={post.title.rendered}
          className="object-cover w-full h-full"
        />
      </AspectRatio>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Calendar className="w-4 h-4" />
          {new Date(post.date).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
        <h3 className="text-xl font-semibold mb-2">
          {post.title.rendered}
        </h3>
        <p className="text-muted-foreground mb-4 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
        />
        <Button asChild variant="outline" className="w-full">
          <Link to={`/blog/${post.slug}`}>
            Leer más <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
} 