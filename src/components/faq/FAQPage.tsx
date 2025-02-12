import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How secure is my financial data?",
    answer:
      "Your data is completely secure as it's stored locally on your device. We don't store any of your financial information in the cloud, giving you complete control and privacy.",
  },
  {
    question: "What happens to my data if I clear my browser data?",
    answer:
      "Since Sobrecitos stores data locally in your browser, clearing your browser data (including local storage) will erase your budget information. We strongly recommend regularly exporting your data as a backup using the Data Manager feature in the dashboard.",
  },
  {
    question: "How can I backup my budget data?",
    answer:
      "You can easily backup your data by using the 'Export Data' button in the Data Manager. This will download a JSON file containing all your budget information. Store this file in a safe place, such as your computer or cloud storage. If you need to restore your data, simply use the 'Import Data' feature.",
  },
  {
    question: "Can I share my budget with family members?",
    answer:
      "Yes! You can share your budget management with family members by exporting your data and sharing it with them. They can then import it into their own instance of the app.",
  },
  {
    question: "How do recurring expenses work?",
    answer:
      "When adding an expense, you can mark it as recurring (weekly or monthly). The app will automatically track these recurring expenses and include them in your budget calculations.",
  },
  {
    question: "Can I set budget alerts?",
    answer:
      "Yes, the app automatically alerts you when you're approaching your budget limits. You'll receive notifications when you reach 75% and 90% of your category budgets.",
  },
  {
    question: "How do I track savings goals?",
    answer:
      "Use the Savings Goals feature to set target amounts and deadlines. The app will track your progress and suggest optimal saving strategies based on your income and expenses.",
  },
  {
    question: "Can I export my budget data?",
    answer:
      "Yes, you can export your budget data at any time using the Data Manager. This creates a JSON file containing all your budget information that you can backup or transfer.",
  },
  {
    question: "How does the AI assistant help with budgeting?",
    answer:
      "Our AI assistant analyzes your spending patterns and provides personalized insights and recommendations to help you optimize your budget and achieve your financial goals.",
  },
  {
    question: "Is there a limit to how many categories I can create?",
    answer:
      "No, you can create as many budget categories as you need to effectively organize your expenses. We recommend keeping it manageable by using broad categories.",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about using Sobrecitos
          </p>
        </div>

        <Card className="p-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Still have questions?{" "}
            <a
              href="mailto:support@sobrecitos.com"
              className="text-primary hover:underline"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
