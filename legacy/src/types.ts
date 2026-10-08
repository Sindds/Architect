export type ThemeMode = 'light' | 'dark' | 'system';
export type ActiveTheme = 'light' | 'dark';
export type Language = 'ru' | 'en';
export type Currency = 'RUB' | 'USD' | 'EUR' | 'AED';

export type VillaStyle = 'all' | 'fachwerk' | 'monolith' | 'hybrid' | 'minimal' | 'chalet';

export interface VillaProject {
  id: string;
  name: string;
  tagline: { ru: string; en: string };
  style: 'fachwerk' | 'monolith' | 'hybrid' | 'minimal' | 'chalet';
  styleName: { ru: string; en: string };
  area: number;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  durationDays: number;
  priceRub: number;
  priceUsd: number;
  mainImage: string;
  secondaryImage: string;
  features: { ru: string[]; en: string[] };
  specs: {
    ru: {
      foundation: string;
      glazing: string;
      timber: string;
      energyRating: string;
    };
    en: {
      foundation: string;
      glazing: string;
      timber: string;
      energyRating: string;
    };
  };
}

export interface RealCase {
  id: string;
  title: { ru: string; en: string };
  location: { ru: string; en: string };
  builtYear: number;
  area: number;
  budgetRub: number;
  budgetUsd: number;
  timelineDays: number;
  style: string;
  energyRating: string;
  finishedImage: string;
  constructionImage: string;
  blueprintImage: string;
  clientQuote: { ru: string; en: string };
  verifiedBadge: { ru: string; en: string };
  engineeringHighlights: { ru: string[]; en: string[] };
  keyMetrics: {
    label: { ru: string; en: string };
    value: string;
  }[];
}

export interface TeamMember {
  id: string;
  name: { ru: string; en: string };
  role: { ru: string; en: string };
  experienceYears: number;
  credentials: { ru: string; en: string };
  photo: string;
  bio: { ru: string; en: string };
  achievements: { ru: string[]; en: string[] };
}

export interface ConstructionVideo {
  id: string;
  title: { ru: string; en: string };
  duration: string;
  category: { ru: string; en: string };
  thumbnail: string;
  videoUrl: string;
  description: { ru: string; en: string };
  equipmentTag: string;
}

export interface TrustDocument {
  id: string;
  title: { ru: string; en: string };
  category: 'sro' | 'passport' | 'estimate' | 'contract' | 'warranty';
  categoryLabel: { ru: string; en: string };
  regNumber: string;
  issuer: string;
  validity: string;
  description: { ru: string; en: string };
  previewImage: string;
  downloadLabel: { ru: string; en: string };
  fileSize: string;
}

export interface ReviewItem {
  id: string;
  authorName: { ru: string; en: string };
  authorTitle: { ru: string; en: string };
  location: { ru: string; en: string };
  villaName: string;
  area: number;
  yearBuilt: number;
  rating: number;
  text: { ru: string; en: string };
  avatar: string;
  villaPhoto: string;
  verifiedOwner: boolean;
  videoUrl?: string;
}

export interface PackageTier {
  id: 'contour' | 'turnkey' | 'allinclusive';
  title: { ru: string; en: string };
  subtitle: { ru: string; en: string };
  pricePerM2Rub: number;
  pricePerM2Usd: number;
  isPopular?: boolean;
  badge?: { ru: string; en: string };
  features: { ru: string[]; en: string[] };
  timeline: { ru: string; en: string };
}

export interface EngineeringPillar {
  id: string;
  number: string;
  title: { ru: string; en: string };
  metric: string;
  metricLabel: { ru: string; en: string };
  description: { ru: string; en: string };
  badge: { ru: string; en: string };
  iconName: string;
}

export interface RoadmapStep {
  step: string;
  days: string;
  title: { ru: string; en: string };
  desc: { ru: string; en: string };
  deliverable: { ru: string; en: string };
}

export interface FaqItem {
  id: string;
  question: { ru: string; en: string };
  answer: { ru: string; en: string };
  category: { ru: string; en: string };
}

