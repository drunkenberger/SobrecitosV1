import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";
import { useEffect } from "react";

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
] as const;

export function LanguageSwitcher() {
  const { currentLanguage, changeLanguage, i18n } = useTranslations();

  // Ensure the component re-renders when language changes
  useEffect(() => {
    if (i18n.language !== currentLanguage) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage, i18n]);

  const handleLanguageChange = async (value: string) => {
    try {
      await changeLanguage(value as 'en' | 'es');
      // Force a page reload to ensure all components update
      window.location.reload();
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-white" />
      <Select value={currentLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[120px] bg-transparent border-none text-white hover:bg-white/10">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 