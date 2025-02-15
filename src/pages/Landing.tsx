import Hero from "@/components/landing/Hero";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Star, CheckCircle2, Users2, Calendar, ChevronLeft, ChevronRight, Sparkles, Bot } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getPosts } from "@/lib/wordpress";
import { WordPressPost } from "@/types/wordpress";
import { cn } from "@/lib/utils";
import SEO from "@/components/SEO";
import { useTranslations } from "@/hooks/useTranslations";

export default function Landing() {
  const { t } = useTranslations();
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [testimonials, setTestimonials] = useState([
    {
      name: "Diana Marshall",
      role: "",
      image: "https://api.dicebear.com/9.x/personas/svg?seed=Sarah&backgroundColor=b6e3f4&hair=long&eyes=happy&mouth=smile&skinColor=e5a07e&clothingColor=456dff",
      text: ""
    },
    {
      name: "William Chen",
      role: "",
      image: "https://api.dicebear.com/9.x/personas/svg?seed=Michael&backgroundColor=d1d4f9&hair=shortCombover&eyes=glasses&mouth=bigSmile&skinColor=d78774&clothingColor=7555ca",
      text: ""
    },
    {
      name: "Emilia Rodriguez",
      role: "",
      image: "https://api.dicebear.com/9.x/personas/svg?seed=Emily&backgroundColor=ffd5dc&hair=bobBangs&eyes=happy&mouth=smile&skinColor=eeb4a4&clothingColor=f55d81&nose=wrinkles",
      text: ""
    }
  ]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getPosts(1, 6); // Fetch 6 latest posts
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    setTestimonials([
      {
        name: "Diana Marshall",
        role: t('testimonials.roles.workingMom'),
        image: "https://api.dicebear.com/9.x/personas/svg?seed=Sarah&backgroundColor=b6e3f4&hair=long&eyes=happy&mouth=smile&skinColor=e5a07e&clothingColor=456dff",
        text: t('testimonials.quotes.diana')
      },
      {
        name: "William Chen",
        role: t('testimonials.roles.advisor'),
        image: "https://api.dicebear.com/9.x/personas/svg?seed=Michael&backgroundColor=d1d4f9&hair=shortCombover&eyes=glasses&mouth=bigSmile&skinColor=d78774&clothingColor=7555ca",
        text: t('testimonials.quotes.william')
      },
      {
        name: "Emilia Rodriguez",
        role: t('testimonials.roles.stayAtHome'),
        image: "https://api.dicebear.com/9.x/personas/svg?seed=Emily&backgroundColor=ffd5dc&hair=bobBangs&eyes=happy&mouth=smile&skinColor=eeb4a4&clothingColor=f55d81&nose=wrinkles",
        text: t('testimonials.quotes.emilia')
      }
    ]);
  }, [t]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(posts.length / 3));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? Math.ceil(posts.length / 3) - 1 : prev - 1
    );
  };

  const getFeaturedImageUrl = (post: WordPressPost) => {
    if (post.jetpack_featured_media_url) {
      return post.jetpack_featured_media_url;
    }

    const media = post._embedded?.['wp:featuredmedia']?.[0];
    if (!media) return null;

    const sizes = media.media_details?.sizes;
    if (sizes) {
      return sizes.medium?.source_url || sizes.full?.source_url;
    }

    return media.source_url;
  };

  const benefits = [
    {
      title: t('landing.features.private.title'),
      description: t('landing.features.private.description'),
    },
    {
      title: t('landing.features.smart.title'),
      description: t('landing.features.smart.description'),
    },
    {
      title: t('landing.features.visual.title'),
      description: t('landing.features.visual.description'),
    },
    {
      title: t('landing.features.alerts.title'),
      description: t('landing.features.alerts.description'),
    },
    {
      title: t('landing.features.sharing.title'),
      description: t('landing.features.sharing.description'),
    },
    {
      title: t('landing.features.goals.title'),
      description: t('landing.features.goals.description'),
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Sobrecitos - Smart Family Budget Management Made Simple"
        description={t('landing.hero.subtitle')}
        keywords="family budget app, expense tracker, financial planning, household finances, budget management, savings goals, private budgeting"
      />
      <Hero />
      {/* Benefits Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('landing.whyChoose.title')}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('landing.whyChoose.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, i) => (
              <Card key={i} className="p-6 hover:shadow-lg transition-shadow">
                <CheckCircle2 className="w-8 h-8 text-[#FFD700] mb-4" />
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Privacy & Security Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                {t('landing.privacy.title')}
              </h2>
              <div className="space-y-4">
                <p className="text-lg text-muted-foreground">
                  {t('landing.privacy.description')}
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1" />
                    <span>{t('landing.privacy.features.offline')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1" />
                    <span>{t('landing.privacy.features.noSharing')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1" />
                    <span>{t('landing.privacy.features.control')}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl" />
              <Card className="relative p-8 backdrop-blur-sm bg-white/50 dark:bg-gray-950/50">
                <Users2 className="w-12 h-12 text-green-600 mb-6" />
                <h3 className="text-2xl font-semibold mb-4">
                  {t('landing.features.private.title')}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {t('landing.features.private.description')}
                </p>
                <Button 
                  variant="default" 
                  size="lg" 
                  asChild 
                  className="w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#556B2F] dark:bg-[#FFD700] dark:hover:bg-[#FFD700]/90 dark:text-[#556B2F] font-semibold"
                >
                  <Link
                    to="/app"
                    className="flex items-center justify-center gap-2"
                  >
                    {t('common.tryItNow')} <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>
      {/* AI Features Section */}
      <section className="py-20 bg-gradient-to-br from-[#FFD700]/10 to-[#556B2F]/10 dark:from-[#FFD700]/5 dark:to-[#556B2F]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('landing.ai.title')}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('landing.ai.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6 bg-gradient-to-br from-[#FFD700]/20 to-[#556B2F]/10 dark:from-[#FFD700]/10 dark:to-[#556B2F]/20 border-[#FFD700]/20 dark:border-[#FFD700]/10 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-8 h-8 text-[#FFD700] dark:text-[#FFD700]/90" />
                <h3 className="text-xl font-medium text-[#556B2F] dark:text-[#FFD700]/90">
                  {t('landing.ai.assistant.title')}
                </h3>
              </div>
              <div className="space-y-4">
                <p className="text-[#556B2F] dark:text-[#FFD700]/80">
                  {t('landing.ai.assistant.description')}
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#FFD700] dark:text-[#FFD700]/90 mt-1" />
                    <span className="text-[#556B2F] dark:text-[#FFD700]/80">{t('landing.ai.assistant.features.analysis')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#FFD700] dark:text-[#FFD700]/90 mt-1" />
                    <span className="text-[#556B2F] dark:text-[#FFD700]/80">{t('landing.ai.assistant.features.patterns')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#FFD700] dark:text-[#FFD700]/90 mt-1" />
                    <span className="text-[#556B2F] dark:text-[#FFD700]/80">{t('landing.ai.assistant.features.optimization')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#FFD700] dark:text-[#FFD700]/90 mt-1" />
                    <span className="text-[#556B2F] dark:text-[#FFD700]/80">{t('landing.ai.assistant.features.planning')}</span>
                  </li>
                </ul>
                <div className="mt-4 p-4 bg-[#FFD700]/5 dark:bg-[#556B2F]/20 rounded-lg border border-[#FFD700]/10 dark:border-[#FFD700]/10">
                  <h4 className="font-medium text-[#556B2F] dark:text-[#FFD700] mb-2">{t('landing.ai.assistant.providers.title')}</h4>
                  <ul className="space-y-2 text-sm text-[#556B2F] dark:text-[#FFD700]/80">
                    <li className="flex items-center gap-2">
                      <span className="font-medium">{t('landing.ai.assistant.providers.openai.name')}:</span> {t('landing.ai.assistant.providers.openai.description')}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="font-medium">{t('landing.ai.assistant.providers.google.name')}:</span> {t('landing.ai.assistant.providers.google.description')}
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="font-medium">{t('landing.ai.assistant.providers.ollama.name')}:</span> {t('landing.ai.assistant.providers.ollama.description')}
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-[#556B2F]/10 to-[#FFD700]/20 dark:from-[#556B2F]/20 dark:to-[#FFD700]/10 border-[#556B2F]/20 dark:border-[#556B2F]/10 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Bot className="w-8 h-8 text-[#556B2F] dark:text-[#FFD700]/90" />
                <h3 className="text-xl font-medium text-[#556B2F] dark:text-[#FFD700]/90">
                  {t('landing.ai.chat.title')}
                </h3>
              </div>
              <div className="space-y-4">
                <p className="text-[#556B2F] dark:text-[#FFD700]/80">
                  {t('landing.ai.chat.description')}
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#556B2F] dark:text-[#FFD700]/90 mt-1" />
                    <span className="text-[#556B2F] dark:text-[#FFD700]/80">{t('landing.ai.chat.features.questions')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#556B2F] dark:text-[#FFD700]/90 mt-1" />
                    <span className="text-[#556B2F] dark:text-[#FFD700]/80">{t('landing.ai.chat.features.analysis')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#556B2F] dark:text-[#FFD700]/90 mt-1" />
                    <span className="text-[#556B2F] dark:text-[#FFD700]/80">{t('landing.ai.chat.features.tips')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#556B2F] dark:text-[#FFD700]/90 mt-1" />
                    <span className="text-[#556B2F] dark:text-[#FFD700]/80">{t('landing.ai.chat.features.tracking')}</span>
                  </li>
                </ul>
                <div className="mt-4 p-4 bg-[#556B2F]/5 dark:bg-[#556B2F]/20 rounded-lg border border-[#556B2F]/10 dark:border-[#FFD700]/10">
                  <h4 className="font-medium text-[#556B2F] dark:text-[#FFD700] mb-2">{t('landing.ai.setup.title')}</h4>
                  <ul className="space-y-2 text-sm text-[#556B2F] dark:text-[#FFD700]/80">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#556B2F] dark:text-[#FFD700]/90 mt-0.5" />
                      <span>{t('landing.ai.setup.apiKey')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#556B2F] dark:text-[#FFD700]/90 mt-0.5" />
                      <span>{t('landing.ai.setup.local')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#556B2F] dark:text-[#FFD700]/90 mt-0.5" />
                      <span>{t('landing.ai.setup.control')}</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6">
                  <Button 
                    variant="default"
                    size="lg"
                    className="w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#556B2F] dark:bg-[#FFD700] dark:hover:bg-[#FFD700]/90 dark:text-[#556B2F] font-semibold"
                    asChild
                  >
                    <Link to="/app" className="flex items-center justify-center gap-2">
                      {t('common.tryFeatures')} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('landing.testimonials.title')}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('landing.testimonials.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground">{testimonial.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Alternatives Preview Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('landing.alternatives.title')}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('landing.alternatives.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">{t('landing.alternatives.comparison.mint.title')}</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <span>{t('landing.alternatives.comparison.mint.private')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <span>{t('landing.alternatives.comparison.mint.noAds')}</span>
                </li>
              </ul>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">{t('landing.alternatives.comparison.ynab.title')}</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <span>{t('landing.alternatives.comparison.ynab.affordable')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <span>{t('landing.alternatives.comparison.ynab.easy')}</span>
                </li>
              </ul>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">{t('landing.alternatives.comparison.everyDollar.title')}</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <span>{t('landing.alternatives.comparison.everyDollar.automation')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <span>{t('landing.alternatives.comparison.everyDollar.ai')}</span>
                </li>
              </ul>
            </Card>
          </div>
          
          <div className="text-center">
            <Button 
              size="lg" 
              className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#556B2F] font-semibold"
            >
              <Link to="/alternatives" className="flex items-center">
                {t('landing.alternatives.cta')} <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      {/* Blog Posts Carousel Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('landing.blog.title')}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('landing.blog.subtitle')}
            </p>
          </div>

          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 min-w-full">
                  {posts.slice(currentSlide * 3, (currentSlide + 1) * 3).map((post) => {
                    const featuredImageUrl = getFeaturedImageUrl(post);
                    
                    return (
                      <Card
                        key={post.id}
                        className="group overflow-hidden hover:shadow-xl transition-all duration-300"
                      >
                        <Link to={`/blog/${post.slug}`} className="block">
                          {featuredImageUrl ? (
                            <div className="relative w-full h-48 overflow-hidden">
                              <img
                                src={featuredImageUrl}
                                alt={post.title.rendered}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                          ) : (
                            <div className="w-full h-48 bg-muted flex items-center justify-center">
                              <span className="text-muted-foreground">No image available</span>
                            </div>
                          )}
                          <div className="p-6">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                              <Calendar className="w-4 h-4" />
                              {new Date(post.date).toLocaleDateString()}
                            </div>
                            <h3 
                              className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2"
                              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                            />
                            <div
                              className={cn(
                                "text-sm text-muted-foreground line-clamp-3 mb-4",
                                "prose prose-sm dark:prose-invert"
                              )}
                              dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                            />
                            <Button 
                              variant="ghost" 
                              className="group-hover:text-primary transition-colors font-semibold pl-0 hover:bg-transparent"
                            >
                              Read More <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </Link>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>

            {posts.length > 3 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-background shadow-lg hover:bg-background"
                  onClick={prevSlide}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-background shadow-lg hover:bg-background"
                  onClick={nextSlide}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg"
              className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#556B2F] font-semibold"
            >
              <Link to="/blog" className="flex items-center">
                {t('landing.blog.cta')} <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {t('landing.cta.title')}
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            {t('landing.cta.subtitle')}
          </p>
          <Button size="lg" variant="secondary" className="gap-2" asChild>
            <Link to="/app">
              {t('landing.cta.button')} <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-background border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">{t('footer.about.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('footer.about.description')}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t('footer.features.title')}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>{t('footer.features.items.tracking')}</li>
                <li>{t('footer.features.items.planning')}</li>
                <li>{t('footer.features.items.reports')}</li>
                <li>{t('footer.features.items.sharing')}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t('footer.resources.title')}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/faq" className="hover:text-primary">
                    {t('navigation.faq')}
                  </Link>
                </li>
                <li>
                  <Link to="/help-center" className="hover:text-primary">
                    {t('navigation.help')}
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="hover:text-primary">
                    {t('navigation.blog')}
                  </Link>
                </li>
                <li>
                  <Link to="/alternatives" className="hover:text-primary">
                    {t('navigation.alternatives')}
                  </Link>
                </li>
                <li>{t('navigation.contact')}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t('footer.legal.title')}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/privacy" className="hover:text-primary">
                    {t('footer.legal.privacy')}
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-primary">
                    {t('footer.legal.terms')}
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className="hover:text-primary">
                    {t('footer.legal.cookies')}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            {t('footer.copyright')}
          </div>
        </div>
      </footer>
    </div>
  );
}
