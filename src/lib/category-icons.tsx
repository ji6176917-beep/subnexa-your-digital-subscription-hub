import {
  Bot,
  Clapperboard,
  Cloud,
  FileSignature,
  GraduationCap,
  Headphones,
  Megaphone,
  Palette,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconBySlug: Record<string, LucideIcon> = {
  "ai-chat-ai-assistant": Bot,
  "photo-editing-ai-photo": Palette,
  "video-editing-ai-video": Clapperboard,
  "music-audio-voice-ai": Headphones,
  "education-learning": GraduationCap,
  "cloud-storage-office-productivity": Cloud,
  "developer-coding-tech": TerminalSquare,
  "vpn-security-privacy": ShieldCheck,
  "social-media-creator-marketing-tools": Megaphone,
  "pdf-writing-translation-utility": FileSignature,
  "bonus-tools": Sparkles,
};

export function categoryIcon(slug: string): LucideIcon {
  return iconBySlug[slug] ?? Sparkles;
}

export function CategoryIcon({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const Icon = categoryIcon(slug);
  return <Icon className={cn("size-5 text-primary", className)} aria-hidden />;
}

/** Rounded tile wrapper used on category cards. */
export function CategoryIconTile({
  slug,
  className,
  iconClassName,
}: {
  slug: string;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <span
      className={cn(
        "flex size-12 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-secondary/70 shadow-sm",
        className,
      )}
    >
      <CategoryIcon slug={slug} className={cn("size-6", iconClassName)} />
    </span>
  );
}
