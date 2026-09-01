export type MatchStatus = 'UPCOMING' | 'LIVE' | 'COMPLETED';

export interface PlayerStats {
  matches: number;
  runs: number;
  average: number;
  strikeRate: number;
  fifties: number;
  hundreds: number;
  highestScore: number;
  wickets: number;
  bowlingAverage: number;
  economy: number;
  bestBowling: string;
  catches: number;
}

export interface Player {
  id: string;
  slug: string;
  name: string;
  jerseyNumber: number;
  role: 'Batter' | 'Bowler' | 'All-Rounder' | 'Wicketkeeper' | 'Captain / All-Rounder';
  battingStyle: 'Right-hand bat' | 'Left-hand bat';
  bowlingStyle: 'Right-arm medium' | 'Right-arm fast' | 'Right-arm off break' | 'Leg break' | 'Left-arm orthodox' | 'N/A';
  nationality: string;
  dateOfBirth: string;
  bio: string;
  photoUrl: string;
  stats: PlayerStats;
  recentPerformances: string[];
  isFeatured?: boolean;
}

export interface BallOutcome {
  over: number; // e.g. 14.3
  ballNumber: number; // 1-6
  runs: number; // 0, 1, 2, 3, 4, 6
  isWicket: boolean;
  wicketType?: 'bowled' | 'caught' | 'lbw' | 'run out' | 'stumped';
  dismissedBatter?: string;
  catcher?: string;
  extraType?: 'wide' | 'no-ball' | 'bye' | 'leg-bye';
  extraRuns?: number;
  striker: string;
  nonStriker: string;
  bowler: string;
  commentary: string;
  timestamp: string;
}

export interface InningData {
  teamName: string;
  runs: number;
  wickets: number;
  overs: number;
  ballsInOver: number;
  currentStriker: {
    name: string;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    isStriker: boolean;
  };
  currentNonStriker: {
    name: string;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    isStriker: boolean;
  };
  currentBowler: {
    name: string;
    overs: number;
    maidens: number;
    runsConceded: number;
    wickets: number;
  };
  recentOvers: string[]; // e.g. ["1", "4", "0", "W", "2", "6"]
  fallOfWickets: {
    score: string;
    batter: string;
    over: string;
  }[];
}

export interface Match {
  id: string;
  title: string;
  tournament: string;
  homeTeam: {
    name: string;
    shortName: string;
    logo: string;
    score?: string;
    overs?: string;
  };
  awayTeam: {
    name: string;
    shortName: string;
    logo: string;
    score?: string;
    overs?: string;
  };
  date: string;
  time: string;
  venue: string;
  status: MatchStatus;
  result?: string;
  summary?: string;
  cskWinProbability?: number;
  liveInnings?: InningData;
  deliveries?: BallOutcome[];
  topPerformers?: {
    player: string;
    role: string;
    stat: string;
    badge: string;
  }[];
  ticketPriceFrom?: number;
  bannerImage?: string;
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  author: string;
  category: 'Match Report' | 'Team News' | 'Player Spotlight' | 'Club News' | 'Announcements';
  date: string;
  readTime: string;
  featuredImage: string;
  excerpt: string;
  content: string;
  matchScoreSummary?: {
    team1: string;
    score1: string;
    team2: string;
    score2: string;
    result: string;
  };
  topPerformers?: {
    name: string;
    performance: string;
    icon: string;
  }[];
  isPublished: boolean;
  tags: string[];
}

export interface MediaItem {
  id: string;
  title: string;
  category: 'Photos' | 'Videos' | 'Highlights';
  tag: 'Match' | 'Player' | 'Training' | 'Celebration' | 'Behind The Scenes';
  mediaUrl: string;
  thumbnailUrl: string;
  videoDuration?: string;
  date: string;
  matchTitle?: string;
}

export interface TicketCategory {
  id: string;
  name: 'General Admission' | 'VIP Lounge' | 'Premium Grandstand' | 'Family Pass' | 'Corporate Box';
  price: number;
  description: string;
  perks: string[];
  availability: number;
}

export interface TicketOrder {
  id: string;
  orderNumber: string;
  matchId: string;
  matchTitle: string;
  matchDate: string;
  matchVenue: string;
  category: string;
  quantity: number;
  totalPrice: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  seatNumbers: string[];
  qrCodeData: string;
  status: 'VALID' | 'CHECKED_IN' | 'CANCELLED';
  createdAt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: 'Jerseys' | 'Caps & Hats' | 'Apparel' | 'Accessories' | 'Fan Kits';
  images: string[];
  description: string;
  features: string[];
  sizes: string[];
  inStock: boolean;
  stockCount: number;
  isBestSeller?: boolean;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export interface ShopOrder {
  id: string;
  orderNumber: string;
  items: {
    productName: string;
    size: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  status: 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
}

export interface Sponsor {
  id: string;
  name: string;
  tier: 'Principal Partner' | 'Official Partner' | 'Associate Partner' | 'Digital Partner';
  logo: string;
  website: string;
  active: boolean;
  displayOrder: number;
}

export interface HospitalityPackage {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  pricePerPerson: number;
  minGuests: number;
  description: string;
  perks: string[];
  image: string;
  features: string[];
}

export interface FanPoll {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    votes: number;
  }[];
  totalVotes: number;
  isActive: boolean;
}

export interface AuditLog {
  id: string;
  adminUser: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface SiteSettings {
  announcementBar: {
    enabled: boolean;
    text: string;
    buttonText: string;
    buttonLink: string;
  };
  heroSlideDuration: number;
  contactEmail: string;
  contactPhone: string;
  stadiumAddress: string;
  instagramHandle: string;
  facebookUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
  homepageSectionsOrder: string[];
  homepageSectionsVisibility: Record<string, boolean>;
}
