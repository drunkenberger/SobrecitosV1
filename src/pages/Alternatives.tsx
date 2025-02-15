import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";

export default function Alternatives() {
  const comparisons = [
    {
      competitor: "Mint",
      description: "Popular cloud-based budgeting app",
      advantages: [
        "100% private - data stays on your device",
        "No ads or upsells",
        "One-time purchase, no subscription",
        "Family-focused features",
        "Customizable AI assistant",
      ],
      disadvantages: [
        "Cloud storage required",
        "Shows ads",
        "Subscription model",
        "Generic features",
        "Limited AI capabilities",
      ],
    },
    {
      competitor: "YNAB",
      description: "Zero-based budgeting software",
      advantages: [
        "More affordable",
        "Simpler to use",
        "No learning curve",
        "AI-powered insights",
        "Privacy-focused",
      ],
      disadvantages: [
        "Expensive monthly fee",
        "Complex methodology",
        "Steep learning curve",
        "No AI features",
        "Data stored in cloud",
      ],
    },
    {
      competitor: "EveryDollar",
      description: "Dave Ramsey's budgeting tool",
      advantages: [
        "Modern interface",
        "Flexible categories",
        "Local data storage",
        "Smart automation",
        "Built-in AI chat",
      ],
      disadvantages: [
        "Basic interface",
        "Limited customization",
        "Cloud-dependent",
        "Manual entry only",
        "No smart features",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Sobrecitos vs Other Budget Apps - Compare Family Budget Tools"
        description="Compare Sobrecitos with other popular budget management apps. See why our private, family-focused approach to budgeting stands out from alternatives."
        keywords="budget app comparison, YNAB alternative, Mint alternative, EveryDollar alternative, family budget software, private budgeting apps, budget tool comparison"
      />
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-[#FFD700]/10 to-[#556B2F]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-6">Sobrecitos as an Alternative to Popular Budget Apps</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            See how Sobrecitos compares to other popular budgeting apps and why families choose us for their financial management needs.
          </p>
          <Button size="lg" className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#556B2F]" asChild>
            <Link to="/app">Try Sobrecitos Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {comparisons.map((app, i) => (
              <Card key={i} className="p-8">
                <h2 className="text-2xl font-bold mb-2">Sobrecitos vs {app.competitor}</h2>
                <p className="text-muted-foreground mb-6">{app.description}</p>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-green-600 dark:text-green-400 mb-3">Sobrecitos Advantages</h3>
                    <ul className="space-y-2">
                      {app.advantages.map((advantage, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                          <span>{advantage}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-red-600 dark:text-red-400 mb-3">{app.competitor} Limitations</h3>
                    <ul className="space-y-2">
                      {app.disadvantages.map((disadvantage, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                          <span>{disadvantage}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make the Switch?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of families who have chosen Sobrecitos for better budget management.
          </p>
          <Button size="lg" className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#556B2F]" asChild>
            <Link to="/app">
              Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
} 