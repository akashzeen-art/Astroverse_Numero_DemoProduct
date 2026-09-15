import { useLanguage } from "@/contexts/LanguageContext";
import { LANGUAGES, LANGUAGE_LABELS, LANGUAGE_NAMES } from "@/i18n";
import type { Language } from "@/i18n";
import { Check, ChevronDown, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-400/40 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 hover:text-white transition-all duration-200 text-xs font-medium outline-none focus-visible:ring-2 focus-visible:ring-purple-400/50"
          aria-label={`Language: ${LANGUAGE_NAMES[language]}`}
        >
          <Globe className="h-3.5 w-3.5" />
          <span>{LANGUAGE_LABELS[language]}</span>
          <ChevronDown className="h-3 w-3 opacity-70" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="min-w-[10rem] bg-slate-950 border border-purple-400/30 text-gray-200"
      >
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => setLanguage(lang as Language)}
            className="flex items-center justify-between gap-3 cursor-pointer text-xs focus:bg-purple-500/20 focus:text-white"
          >
            <span className="flex items-center gap-2">
              <span className="font-medium">{LANGUAGE_LABELS[lang]}</span>
              <span className="text-gray-400">{LANGUAGE_NAMES[lang]}</span>
            </span>
            {language === lang && <Check className="h-3.5 w-3.5 text-purple-300" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
