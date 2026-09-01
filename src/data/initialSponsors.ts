import { Sponsor } from '@/types';

export const initialSponsors: Sponsor[] = [
  {
    id: 'sp1',
    name: 'Butterfield Bank Cayman',
    tier: 'Principal Partner',
    logo: '🏦 Butterfield',
    website: 'https://butterfieldonline.com',
    active: true,
    displayOrder: 1
  },
  {
    id: 'sp2',
    name: 'Cayman Airways',
    tier: 'Principal Partner',
    logo: '✈️ Cayman Airways',
    website: 'https://caymanairways.com',
    active: true,
    displayOrder: 2
  },
  {
    id: 'sp3',
    name: 'Digicel Business',
    tier: 'Official Partner',
    logo: '📱 Digicel',
    website: 'https://digicelbusiness.com',
    active: true,
    displayOrder: 3
  },
  {
    id: 'sp4',
    name: 'Tortuga Rum Co.',
    tier: 'Official Partner',
    logo: '🍹 Tortuga Cayman',
    website: 'https://tortugarums.com',
    active: true,
    displayOrder: 4
  },
  {
    id: 'sp5',
    name: 'Dart Real Estate',
    tier: 'Associate Partner',
    logo: '🏢 DART',
    website: 'https://dart.ky',
    active: true,
    displayOrder: 5
  },
  {
    id: 'sp6',
    name: 'Seven Mile Spirits',
    tier: 'Associate Partner',
    logo: '🍸 7 Mile Spirits',
    website: 'https://sevenmilespirits.ky',
    active: true,
    displayOrder: 6
  }
];
