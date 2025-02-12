import Hero from "@/components/landing/Hero";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Star, CheckCircle2, Users2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Landing() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Working Mom",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
      text: "This app has completely transformed how I manage our household expenses. The visual charts make it so easy to understand where our money goes.",
    },
    {
      name: "Michael Chen",
      role: "Family Financial Advisor",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      text: "I recommend this app to all my clients. It's the perfect balance of powerful features and ease of use.",
    },
    {
      name: "Emily Rodriguez",
      role: "Stay-at-home Parent",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
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
      name: "Alex Rivera",
      role: "Founder & CEO",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    },
    {
      name: "Lisa Wang",
      role: "Head of Product",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
    },
    {
      name: "David Kumar",
      role: "Lead Developer",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
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
                <CheckCircle2 className="w-8 h-8 text-primary mb-4" />
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
                <Button variant="default" size="lg" asChild className="w-full">
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
                <li>Help Center</li>
                <li>Blog</li>
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
