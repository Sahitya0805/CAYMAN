import { TicketCategory, TicketOrder } from '@/types';

export const initialTicketCategories: TicketCategory[] = [
  {
    id: 'cat-gen',
    name: 'General Admission',
    price: 10,
    description: 'Open seating on the boundary grass embankment and general stands.',
    perks: ['Ground entry', 'Boundary embankment access', 'Food & beverage stalls access'],
    availability: 450
  },
  {
    id: 'cat-prem',
    name: 'Premium Grandstand',
    price: 25,
    description: 'Covered shaded seating in the West Grandstand with prime bowler-line view.',
    perks: ['Shaded covered seating', 'Fast-track entry gate', 'Free matchday digital guide'],
    availability: 180
  },
  {
    id: 'cat-fam',
    name: 'Family Pass',
    price: 35,
    description: 'Admit up to 2 Adults & 2 Children with dedicated family zone seating.',
    perks: ['2 Adults + 2 Kids entry', 'Family zone access', 'Free CSK mini flag kit'],
    availability: 90
  },
  {
    id: 'cat-vip',
    name: 'VIP Lounge',
    price: 45,
    description: 'Access to the air-conditioned pavilion lounge with terrace views.',
    perks: ['AC Pavilion Lounge', 'Complimentary welcome drink', 'Player dugout proximity'],
    availability: 60
  },
  {
    id: 'cat-corp',
    name: 'Corporate Box',
    price: 120,
    description: 'All-inclusive premium corporate suite hospitality and fine dining.',
    perks: ['VIP Box Hospitality', 'Full open bar & Caribbean BBQ', 'Meet & greet pass'],
    availability: 20
  }
];

export const initialTicketOrders: TicketOrder[] = [
  {
    id: 't-ord-1',
    orderNumber: 'CSK10293',
    matchId: 'm-upcoming-1',
    matchTitle: 'CSK vs Greenies Too',
    matchDate: '2026-09-20 7:00 PM',
    matchVenue: 'Jimmy Powell Oval',
    category: 'VIP Lounge',
    quantity: 2,
    totalPrice: 90,
    customerName: 'Marcus Ebanks',
    customerEmail: 'marcus.ebanks@gmail.com',
    customerPhone: '+1 (345) 949-1122',
    seatNumbers: ['VIP-A12', 'VIP-A13'],
    qrCodeData: 'CSK-TICKET-CSK10293-MARCUS-VIP-A12-A13',
    status: 'VALID',
    createdAt: '2026-08-30 18:30'
  },
  {
    id: 't-ord-2',
    orderNumber: 'CSK10292',
    matchId: 'm-upcoming-1',
    matchTitle: 'CSK vs Greenies Too',
    matchDate: '2026-09-20 7:00 PM',
    matchVenue: 'Jimmy Powell Oval',
    category: 'General Admission',
    quantity: 4,
    totalPrice: 40,
    customerName: 'Chloe Bodden',
    customerEmail: 'chloe.b@candw.ky',
    customerPhone: '+1 (345) 945-8833',
    seatNumbers: ['GEN-GA-44', 'GEN-GA-45', 'GEN-GA-46', 'GEN-GA-47'],
    qrCodeData: 'CSK-TICKET-CSK10292-CHLOE-GEN-4',
    status: 'VALID',
    createdAt: '2026-08-30 15:10'
  }
];
