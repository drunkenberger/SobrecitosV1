import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  LifeBuoy,
  Wallet,
  Receipt,
  PiggyBank,
  Settings,
  Users,
  Shield,
  FileQuestion,
} from "lucide-react";

const categories = [
  {
    icon: <Wallet className="w-5 h-5" />,
    title: "Getting Started",
    articles: [
      {
        title: "Setting up your first budget",
        content:
          "Learn how to set up your initial monthly budget and categories.",
      },
      {
        title: "Understanding the dashboard",
        content: "Get familiar with the main dashboard and its features.",
      },
      {
        title: "Adding family members",
        content: "How to share your budget with family members.",
      },
    ],
  },
  {
    icon: <Receipt className="w-5 h-5" />,
    title: "Expense Management",
    articles: [
      {
        title: "Adding expenses",
        content: "Learn how to add and categorize your expenses.",
      },
      {
        title: "Setting up recurring expenses",
        content: "Automate your regular monthly payments.",
      },
      {
        title: "Managing receipts",
        content: "How to attach and organize receipts for your expenses.",
      },
    ],
  },
  {
    icon: <PiggyBank className="w-5 h-5" />,
    title: "Savings Goals",
    articles: [
      {
        title: "Creating savings goals",
        content: "Set up and track your financial goals.",
      },
      {
        title: "Smart savings distribution",
        content: "Let AI help you optimize your savings strategy.",
      },
      {
        title: "Monitoring progress",
        content: "Track your progress towards savings goals.",
      },
    ],
  },
  {
    icon: <Settings className="w-5 h-5" />,
    title: "Account Settings",
    articles: [
      {
        title: "Managing your profile",
        content: "Update your personal information and preferences.",
      },
      {
        title: "Currency settings",
        content: "Change your preferred currency and format.",
      },
      {
        title: "Notification preferences",
        content: "Customize your alert and notification settings.",
      },
    ],
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Family Sharing",
    articles: [
      {
        title: "Adding family members",
        content: "Share your budget with family members.",
      },
      {
        title: "Setting permissions",
        content: "Manage what family members can view and edit.",
      },
      {
        title: "Activity tracking",
        content: "Monitor changes made by family members.",
      },
    ],
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Privacy & Security",
    articles: [
      {
        title: "Data privacy",
        content: "Understanding how your data is stored and protected.",
      },
      {
        title: "Security settings",
        content:
          "Configure two-factor authentication and other security features.",
      },
      {
        title: "Backup and export",
        content: "How to backup and export your budget data.",
      },
    ],
  },
];

export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <LifeBuoy className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Help Center</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions and learn how to make the most of
            Sobrecitos
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for help articles..."
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category, i) => (
            <Card key={i} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  {category.icon}
                </div>
                <h2 className="text-xl font-semibold">{category.title}</h2>
              </div>
              <ul className="space-y-2">
                {category.articles.map((article, j) => (
                  <li key={j}>
                    <Button
                      variant="link"
                      className="text-left h-auto p-0 text-muted-foreground hover:text-primary"
                    >
                      {article.title}
                    </Button>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <FileQuestion className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold">Quick Answers</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {categories.flatMap((category, i) =>
              category.articles.map((article, j) => (
                <AccordionItem key={`${i}-${j}`} value={`${i}-${j}`}>
                  <AccordionTrigger className="text-left">
                    {article.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {article.content}
                  </AccordionContent>
                </AccordionItem>
              )),
            )}
          </Accordion>
        </Card>

        {/* Contact Support */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Still need help?{" "}
            <Button variant="link" className="p-0">
              Contact our support team
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
