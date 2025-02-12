import { Card } from "@/components/ui/card";

interface LegalPageProps {
  title: string;
  content: React.ReactNode;
}

export default function LegalPage({ title, content }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-center">{title}</h1>
        <Card className="p-8">
          <div className="prose dark:prose-invert max-w-none">{content}</div>
        </Card>
      </div>
    </div>
  );
}
