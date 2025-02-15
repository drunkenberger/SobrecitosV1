import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from 'react-i18next';

export default function FAQPage() {
  const { t } = useTranslation();

  // Get the FAQ questions as an array
  const faqQuestions = Object.keys(t('faq.questions', { returnObjects: true }));

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            {t('faq.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('faq.subtitle')}
          </p>
        </div>

        <Card className="p-6">
          <Accordion type="single" collapsible className="w-full">
            {faqQuestions.map((key) => (
              <AccordionItem key={key} value={key}>
                <AccordionTrigger className="text-left">
                  {t(`faq.questions.${key}.question`)}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {t(`faq.questions.${key}.answer`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            {t('faq.support.stillNeedHelp')}{" "}
            <a
              href="mailto:support@sobrecitos.com"
              className="text-primary hover:underline"
            >
              {t('faq.support.contactSupport')}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
