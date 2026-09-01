import { HospitalityPackage } from '@/types';

export const initialHospitality: HospitalityPackage[] = [
  {
    id: 'hosp-1',
    title: 'The Royal Pavilion VIP Lounge',
    slug: 'vip-lounge',
    subtitle: 'Air-conditioned luxury with panoramic boundary views and all-inclusive gourmet dining.',
    pricePerPerson: 95,
    minGuests: 1,
    description: 'Experience Cayman Super Kings cricket in ultimate luxury. Enjoy private indoor climate-controlled seating with direct access to an elevated viewing balcony overlooking the bowlers’ run-up.',
    perks: [
      'Complimentary gourmet Caribbean BBQ buffet & chef stations',
      'Open premium bar including cocktails, champagne, and beers',
      'Exclusive post-match meet & greet with CSK players and captain',
      'VIP parking pass and fast-track private entrance',
      'Signed CSK official match cap souvenir'
    ],
    features: [
      'Elevated boundary line sightlines',
      'Private air-conditioned suite & high-top cocktail tables',
      'Dedicated host and waitstaff service'
    ],
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'hosp-2',
    title: 'Corporate Executive Box',
    slug: 'corporate-box',
    subtitle: 'Private branded suite for corporate entertaining, business clients, and celebrations.',
    pricePerPerson: 140,
    minGuests: 8,
    description: 'Host up to 20 clients or team members in a private branded hospitality suite. Customized branding, bespoke catering menus, and private TV screens with live match analytics.',
    perks: [
      'Private enclosed suite with dedicated balcony seating for 12-20 guests',
      'Bespoke multi-course dining with personal chef',
      'Dedicated personal bartender throughout match duration',
      'Corporate logo display on matchday stadium big screen',
      'Complimentary team jerseys for all company guests'
    ],
    features: [
      'Custom catering packages',
      'Private sound system & high-speed Wi-Fi',
      'Full match presentation access'
    ],
    image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'hosp-3',
    title: 'Matchday Dining & Deck Experience',
    slug: 'matchday-dining',
    subtitle: 'Trackside dining experience bringing you closest to the boundary rope action.',
    pricePerPerson: 55,
    minGuests: 2,
    description: 'Immerse your family and friends in the electric match atmosphere right beside the boundary rope. Enjoy relaxed table service, craft beers, and island-style grill dishes.',
    perks: [
      'Reserved trackside table within meters of the boundary line',
      '3-course Caribbean feast with fresh seafood options',
      '2 complimentary drinks vouchers per guest',
      'Matchday programme and scorecard lanyard'
    ],
    features: [
      'Rope-side viewing',
      'Family friendly seating',
      'Pre-match pitch walk access'
    ],
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop'
  }
];
