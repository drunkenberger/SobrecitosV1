import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { useTranslation } from 'react-i18next';

const getCategories = (t: any) => [
  {
    icon: <Wallet className="w-5 h-5" />,
    title: t('helpCenter.categories.gettingStarted.title'),
    articles: [
      {
        title: t('helpCenter.categories.gettingStarted.articles.firstBudget.title'),
        content: t('helpCenter.categories.gettingStarted.articles.firstBudget.content'),
      },
      {
        title: t('helpCenter.categories.gettingStarted.articles.dashboard.title'),
        content: t('helpCenter.categories.gettingStarted.articles.dashboard.content'),
      },
      {
        title: t('helpCenter.categories.gettingStarted.articles.familyMembers.title'),
        content: t('helpCenter.categories.gettingStarted.articles.familyMembers.content'),
      },
    ],
  },
  {
    icon: <Receipt className="w-5 h-5" />,
    title: t('helpCenter.categories.expenseManagement.title'),
    articles: [
      {
        title: t('helpCenter.categories.expenseManagement.articles.addingExpenses.title'),
        content: t('helpCenter.categories.expenseManagement.articles.addingExpenses.content'),
      },
      {
        title: t('helpCenter.categories.expenseManagement.articles.recurringExpenses.title'),
        content: t('helpCenter.categories.expenseManagement.articles.recurringExpenses.content'),
      },
      {
        title: t('helpCenter.categories.expenseManagement.articles.receipts.title'),
        content: t('helpCenter.categories.expenseManagement.articles.receipts.content'),
      },
    ],
  },
  {
    icon: <PiggyBank className="w-5 h-5" />,
    title: t('helpCenter.categories.savingsGoals.title'),
    articles: [
      {
        title: t('helpCenter.categories.savingsGoals.articles.creating.title'),
        content: t('helpCenter.categories.savingsGoals.articles.creating.content'),
      },
      {
        title: t('helpCenter.categories.savingsGoals.articles.distribution.title'),
        content: t('helpCenter.categories.savingsGoals.articles.distribution.content'),
      },
      {
        title: t('helpCenter.categories.savingsGoals.articles.progress.title'),
        content: t('helpCenter.categories.savingsGoals.articles.progress.content'),
      },
    ],
  },
  {
    icon: <Settings className="w-5 h-5" />,
    title: t('helpCenter.categories.accountSettings.title'),
    articles: [
      {
        title: t('helpCenter.categories.accountSettings.articles.profile.title'),
        content: t('helpCenter.categories.accountSettings.articles.profile.content'),
      },
      {
        title: t('helpCenter.categories.accountSettings.articles.currency.title'),
        content: t('helpCenter.categories.accountSettings.articles.currency.content'),
      },
      {
        title: t('helpCenter.categories.accountSettings.articles.notifications.title'),
        content: t('helpCenter.categories.accountSettings.articles.notifications.content'),
      },
    ],
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: t('helpCenter.categories.familySharing.title'),
    articles: [
      {
        title: t('helpCenter.categories.familySharing.articles.adding.title'),
        content: t('helpCenter.categories.familySharing.articles.adding.content'),
      },
      {
        title: t('helpCenter.categories.familySharing.articles.permissions.title'),
        content: t('helpCenter.categories.familySharing.articles.permissions.content'),
      },
      {
        title: t('helpCenter.categories.familySharing.articles.activity.title'),
        content: t('helpCenter.categories.familySharing.articles.activity.content'),
      },
    ],
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: t('helpCenter.categories.privacySecurity.title'),
    articles: [
      {
        title: t('helpCenter.categories.privacySecurity.articles.privacy.title'),
        content: t('helpCenter.categories.privacySecurity.articles.privacy.content'),
      },
      {
        title: t('helpCenter.categories.privacySecurity.articles.security.title'),
        content: t('helpCenter.categories.privacySecurity.articles.security.content'),
      },
      {
        title: t('helpCenter.categories.privacySecurity.articles.backup.title'),
        content: t('helpCenter.categories.privacySecurity.articles.backup.content'),
      },
    ],
  },
];

export default function HelpCenter() {
  const { t } = useTranslation();
  const categories = getCategories(t);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <LifeBuoy className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">{t('helpCenter.title')}</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('helpCenter.subtitle')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder={t('helpCenter.searchPlaceholder')}
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
            <h2 className="text-2xl font-semibold">{t('helpCenter.quickAnswers')}</h2>
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
            {t('helpCenter.needHelp')}{" "}
            <Button variant="link" className="p-0">
              {t('helpCenter.contactSupport')}
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
