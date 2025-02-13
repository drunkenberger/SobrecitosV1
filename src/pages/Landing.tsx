import Hero from "@/components/landing/Hero";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Star, CheckCircle2, Users2, Calendar, ChevronLeft, ChevronRight, Sparkles, Bot } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getPosts } from "@/lib/wordpress";
import { WordPressPost } from "@/types/wordpress";
import { cn } from "@/lib/utils";

export default function Landing() {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  const testimonials = [
    {
      name: "Diana Marshall",
      role: "Working Mom",
      image: "https://api.dicebear.com/9.x/personas/svg?seed=Sarah&backgroundColor=b6e3f4&hair=long&eyes=happy&mouth=smile&skinColor=e5a07e&clothingColor=456dff",
      text: "This app has completely transformed how I manage our household expenses. The visual charts make it so easy to understand where our money goes.",
    },
    {
      name: "William Chen",
      role: "Family Financial Advisor",
      image: "https://api.dicebear.com/9.x/personas/svg?seed=Michael&backgroundColor=d1d4f9&hair=shortCombover&eyes=glasses&mouth=bigSmile&skinColor=d78774&clothingColor=7555ca",
      text: "I use this app and recommend it to all my clients. It's the perfect balance of powerful features and ease of use.",
    },
    {
      name: "Emilia Rodriguez",
      role: "Stay-at-home Parent",
      image: "https://api.dicebear.com/9.x/personas/svg?seed=Emily&backgroundColor=ffd5dc&hair=bobBangs&eyes=happy&mouth=smile&skinColor=eeb4a4&clothingColor=f55d81&nose=wrinkles",
      text: "The recurring expenses feature saves me so much time. I can finally keep track of all our family's spending in one place.",
    },
  ];

  const benefits = [
    {
      title: "100% Private & Secure",
      description:
        "All data is stored locally on your device, never in the cloud",
    },
    {
      title: "Smart Categorization",
      description:
        "Automatically organize expenses into customizable categories",
    },
    {
      title: "Visual Reports",
      description:
        "See your spending patterns with beautiful, intuitive charts",
    },
    {
      title: "Budget Alerts",
      description: "Get notified when you're approaching category limits",
    },
    {
      title: "Family Sharing",
      description: "Collaborate with family members on budget management",
    },
    {
      title: "Savings Goals",
      description: "Set and track financial goals for your family's future",
    },
  ];

  const team = [
    {
      name: "Santiago González",
      role: "Founder & Developer",
      image: "https://api.dicebear.com/9.x/personas/svg?seed=Alex&backgroundColor=d1d4f9&hair=shortComboverChops&eyes=happy&mouth=smile&skinColor=b16a5b&clothingColor=456dff&facialHair=shadow",
    },
    {
      name: "Sofía Barrios",
      role: "Head of Product",
      image: "https://api.dicebear.com/9.x/personas/svg?seed=Lisa&backgroundColor=ffd5dc&hair=bobCut&eyes=happy&mouth=bigSmile&skinColor=d78774&clothingColor=f55d81",
    },
    {
      name: "NEZ",
      role: "Lead Developer",
      image: "https://api.dicebear.com/9.x/personas/svg?seed=David&backgroundColor=ffdfbf&hair=buzzcut&eyes=glasses&mouth=smile&skinColor=e5a07e&clothingColor=f3b63a",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Hero />
      {/* Benefits Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Sobrecitos?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              It's easy to use and your financial data never leaves your device.
              Designed for families who value both simplicity and privacy in
              managing their budget.
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
                Your Data Stays With You
              </h2>
              <div className="space-y-4">
                <p className="text-lg text-muted-foreground">
                  Unlike traditional budget apps that store your sensitive
                  financial data in the cloud, Sobrecitos keeps everything
                  securely on your device.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1" />
                    <span>
                      100% offline storage - your data never leaves your device
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1" />
                    <span>No third-party data sharing or tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1" />
                    <span>
                      Complete control over your financial information
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl" />
              <Card className="relative p-8 backdrop-blur-sm bg-white/50 dark:bg-gray-950/50">
                <Users2 className="w-12 h-12 text-green-600 mb-6" />
                <h3 className="text-2xl font-semibold mb-4">
                  Privacy First Design
                </h3>
                <p className="text-muted-foreground mb-6">
                  We believe your financial data belongs to you alone. That's
                  why we've designed Sobrecitos to be completely self-contained,
                  giving you full control over your information.
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
                    Try It Now <ArrowRight className="w-4 h-4" />
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
            <h2 className="text-3xl font-bold mb-4">AI-Powered Financial Insights</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Optional AI features to help you make smarter financial decisions while keeping your data private. Choose your preferred AI provider and maintain full control.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6 bg-gradient-to-br from-[#FFD700]/20 to-[#556B2F]/10 dark:from-[#FFD700]/10 dark:to-[#556B2F]/20 border-[#FFD700]/20 dark:border-[#FFD700]/10 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-8 h-8 text-[#FFD700] dark:text-[#FFD700]/90" />
                <h3 className="text-xl font-medium text-[#556B2F] dark:text-[#FFD700]/90">
                  AI Financial Assistant
                </h3>
              </div>
              <div className="space-y-4">
                <p className="text-[#556B2F] dark:text-[#FFD700]/80">
                  Get personalized financial advice and insights powered by advanced AI technology:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#FFD700] dark:text-[#FFD700]/90 mt-1" />
                    <span className="text-[#556B2F] dark:text-[#FFD700]/80">Real-time budget analysis and recommendations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#FFD700] dark:text-[#FFD700]/90 mt-1" />
                    <span className="text-[#556B2F] dark:text-[#FFD700]/80">Smart spending pattern detection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#FFD700] dark:text-[#FFD700]/90 mt-1" />
                    <span className="text-[#556B2F] dark:text-[#FFD700]/80">Savings goals optimization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#FFD700] dark:text-[#FFD700]/90 mt-1" />
                    <span className="text-[#556B2F] dark:text-[#FFD700]/80">Future payment planning assistance</span>
                  </li>
                </ul>
                <div className="mt-4 p-4 bg-[#FFD700]/5 dark:bg-[#556B2F]/20 rounded-lg border border-[#FFD700]/10 dark:border-[#FFD700]/10">
                  <h4 className="font-medium text-[#556B2F] dark:text-[#FFD700] mb-2">Choose Your AI Provider:</h4>
                  <ul className="space-y-2 text-sm text-[#556B2F] dark:text-[#FFD700]/80">
                    <li className="flex items-center gap-2">
                      <span className="font-medium">OpenAI:</span> Use GPT models with your API key
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="font-medium">Google:</span> Connect to Gemini models
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="font-medium">Ollama:</span> Run AI locally for complete privacy
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-[#556B2F]/10 to-[#FFD700]/20 dark:from-[#556B2F]/20 dark:to-[#FFD700]/10 border-[#556B2F]/20 dark:border-[#556B2F]/10 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <Bot className="w-8 h-8 text-[#556B2F] dark:text-[#FFD700]/90" />
                <h3 className="text-xl font-medium text-[#556B2F] dark:text-[#FFD700]/90">
                  Interactive AI Chat
                </h3>
              </div>
              <div className="space-y-4">
                <p className="text-[#556B2F] dark:text-[#FFD700]/80">
                  Chat with your personal AI financial assistant that understands your unique situation:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#556B2F] dark:text-[#FFD700]/90 mt-1" />
                    <span className="text-[#556B2F] dark:text-[#FFD700]/80">Ask questions about your finances</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#556B2F] dark:text-[#FFD700]/90 mt-1" />
                    <span className="text-[#556B2F] dark:text-[#FFD700]/80">Get detailed spending analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#556B2F] dark:text-[#FFD700]/90 mt-1" />
                    <span className="text-[#556B2F] dark:text-[#FFD700]/80">Receive custom financial tips</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#556B2F] dark:text-[#FFD700]/90 mt-1" />
                    <span className="text-[#556B2F] dark:text-[#FFD700]/80">Track progress towards goals</span>
                  </li>
                </ul>
                <div className="mt-4 p-4 bg-[#556B2F]/5 dark:bg-[#556B2F]/20 rounded-lg border border-[#556B2F]/10 dark:border-[#FFD700]/10">
                  <h4 className="font-medium text-[#556B2F] dark:text-[#FFD700] mb-2">Easy Setup:</h4>
                  <ul className="space-y-2 text-sm text-[#556B2F] dark:text-[#FFD700]/80">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#556B2F] dark:text-[#FFD700]/90 mt-0.5" />
                      <span>Bring your own API key for OpenAI or Gemini</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#556B2F] dark:text-[#FFD700]/90 mt-0.5" />
                      <span>Or use Ollama to run models locally on your device</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#556B2F] dark:text-[#FFD700]/90 mt-0.5" />
                      <span>Full control over AI settings and model selection</span>
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
                      Try AI Features <ArrowRight className="w-4 h-4" />
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
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join thousands of satisfied families who have transformed their
              financial management
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
      {/* Blog Posts Carousel Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Latest from Our Blog</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Stay updated with our latest tips and insights on family budget management
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
                        <Link to={`/blog/${post.id}`} className="block">
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
            <Button asChild variant="outline" size="lg">
              <Link to="/blog" className="font-semibold">
                View All Posts <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      {/* Team Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Dedicated to making family budget management easier for everyone
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <Card
                key={i}
                className="p-6 text-center hover:shadow-lg transition-shadow"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Take Control of Your Family Budget?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of families who are already managing their finances
            smarter with Sobrecitos
          </p>
          <Button size="lg" variant="secondary" className="gap-2" asChild>
            <Link to="/app">
              Get Started Now <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-background border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">About Sobrecitos</h3>
              <p className="text-sm text-muted-foreground">
                Making family budget management simple and effective for
                everyone.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Expense Tracking</li>
                <li>Budget Planning</li>
                <li>Visual Reports</li>
                <li>Family Sharing</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/faq" className="hover:text-primary">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link to="/help" className="hover:text-primary">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="hover:text-primary">
                    Blog
                  </Link>
                </li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/privacy" className="hover:text-primary">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-primary">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className="hover:text-primary">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Sobrecitos. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
