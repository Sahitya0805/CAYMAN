import { SiteSettings, ShopOrder, AuditLog } from '@/types';

export const initialSettings: SiteSettings = {
  announcementBar: {
    enabled: true,
    text: '🔥 CSK WIN BY 62 RUNS — BACK-TO-BACK WINS IN DANIEL MORRIS SUPER LEAGUE!',
    buttonText: 'VIEW MATCH REPORT →',
    buttonLink: '/news/csk-defeat-greenies-by-62-runs'
  },
  heroSlideDuration: 7000,
  contactEmail: 'contact@caymansuperkings.ky',
  contactPhone: '+1 (345) 949-CSK1',
  stadiumAddress: 'Jimmy Powell Oval, George Town, Grand Cayman, Cayman Islands',
  instagramHandle: '@caymansuperkings',
  facebookUrl: 'https://facebook.com/caymansuperkings',
  youtubeUrl: 'https://youtube.com/@caymansuperkings',
  tiktokUrl: 'https://tiktok.com/@caymansuperkings',
  homepageSectionsOrder: [
    'hero',
    'nextMatch',
    'quickActions',
    'performance',
    'videos',
    'news',
    'hospitality',
    'sponsors'
  ],
  homepageSectionsVisibility: {
    hero: true,
    nextMatch: true,
    quickActions: true,
    performance: true,
    videos: true,
    news: true,
    hospitality: true,
    sponsors: true,
    fixtures: false,
    liveMatch: false,
    results: false,
    players: false,
    fanZone: false,
    shop: false,
    instagram: false,
    newsletter: false
  }
};

export const initialOrders: ShopOrder[] = [
  {
    id: 'ord-101',
    orderNumber: 'ORD-CSK8821',
    items: [
      {
        productName: 'CSK Official Match Jersey 2026',
        size: 'L',
        quantity: 2,
        price: 59.99,
        image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800&auto=format&fit=crop'
      },
      {
        productName: 'CSK Official Matchday Gold Cap',
        size: 'One Size',
        quantity: 1,
        price: 24.99,
        image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop'
      }
    ],
    customerName: 'Aarav Patel',
    customerEmail: 'aarav.patel@gmail.com',
    shippingAddress: '14 Palm Heights, West Bay Road, Grand Cayman',
    subtotal: 144.97,
    shippingFee: 10.00,
    total: 154.97,
    status: 'PAID',
    createdAt: '2026-08-30 19:40'
  },
  {
    id: 'ord-102',
    orderNumber: 'ORD-CSK8820',
    items: [
      {
        productName: 'CSK Royal Crest Heavyweight Hoodie',
        size: 'XL',
        quantity: 1,
        price: 69.99,
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop'
      }
    ],
    customerName: 'Sarah McTaggart',
    customerEmail: 'sarah.mctaggart@outlook.com',
    shippingAddress: '42 South Sound Rd, George Town, Grand Cayman',
    subtotal: 69.99,
    shippingFee: 10.00,
    total: 79.99,
    status: 'PROCESSING',
    createdAt: '2026-08-30 16:15'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'log-1',
    adminUser: 'Admin Rahul',
    action: 'Scorecard Updated',
    details: 'Updated live score to 132/6 (18.4 overs) vs Greenies Too',
    timestamp: '2026-08-30 22:45'
  },
  {
    id: 'log-2',
    adminUser: 'Admin Editor',
    action: 'Article Published',
    details: 'Published "CSK Defeat Greenies Too by 62 Runs"',
    timestamp: '2026-08-30 21:00'
  },
  {
    id: 'log-3',
    adminUser: 'Ticket Manager',
    action: 'Ticket Validated',
    details: 'Checked-in Ticket #CSK10291 at Gate B',
    timestamp: '2026-08-30 18:00'
  }
];
