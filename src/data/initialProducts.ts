import { Product } from '@/types';

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    slug: 'csk-official-match-jersey-2026',
    name: 'CSK Official Match Jersey 2026',
    price: 59.99,
    originalPrice: 69.99,
    category: 'Jerseys',
    images: [
      'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'The authentic Cayman Super Kings 2026 Match Jersey as worn by Rahul Garg and the squad in the Daniel Morris Super League. Built with ultra-breathable moisture-wicking fabric, sublimated Lion crest, and gold sleeve detailing.',
    features: [
      '100% Recycled Performance Polyester',
      'Anti-microbial and sweat-wicking AEROREADY technology',
      'High-definition 3D silicone CSK Lion crest',
      'Ribbed athletic collar and ergonomic shoulder seams'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 85,
    isBestSeller: true
  },
  {
    id: 'prod-2',
    slug: 'csk-training-tshirt-navy',
    name: 'CSK Pro Training Performance Tee',
    price: 39.99,
    originalPrice: 45.00,
    category: 'Apparel',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Engineered for intense practice nets and gym sessions. Deep navy with royal blue geometric mesh side panels and bright gold CSK lettering.',
    features: [
      'Lightweight 4-way stretch fabric',
      'Breathable laser-cut ventilation under arms',
      'Reflective CSK logo print'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 120,
    isBestSeller: true
  },
  {
    id: 'prod-3',
    slug: 'csk-lion-gold-cap',
    name: 'CSK Official Matchday Gold Cap',
    price: 24.99,
    originalPrice: 29.99,
    category: 'Caps & Hats',
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Premium snapback cap featuring thick 3D gold embroidery of the iconic CSK Lion and "ONE TEAM. ONE DREAM." on the rear arch.',
    features: [
      'Adjustable snapback closure - one size fits all',
      '100% structured cotton twill',
      'Moisture-absorbent sweatband'
    ],
    sizes: ['One Size'],
    inStock: true,
    stockCount: 240,
    isBestSeller: true
  },
  {
    id: 'prod-4',
    slug: 'csk-supporter-scarf',
    name: 'CSK Gold & Navy Knitted Scarf',
    price: 19.99,
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Double-sided jacquard knitted stadium scarf featuring the Lion Crest, "ONE KINGDOM" chant, and tassel fringes.',
    features: [
      'Ultra-soft acrylic knit',
      'Fringed ends in bright gold',
      'Length: 145cm'
    ],
    sizes: ['One Size'],
    inStock: true,
    stockCount: 65
  },
  {
    id: 'prod-5',
    slug: 'csk-championship-hoodie',
    name: 'CSK Royal Crest Heavyweight Hoodie',
    price: 69.99,
    originalPrice: 79.99,
    category: 'Apparel',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'Heavyweight fleece hoodie in Deep Navy with gold-lined hood and embroidered chest badge. Essential for evening matches and travel.',
    features: [
      '380 GSM brushed organic cotton & recycled poly',
      'Kangaroo pouch pocket with hidden phone sleeve',
      'Custom gold eyelets and aglets'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 40
  },
  {
    id: 'prod-6',
    slug: 'csk-complete-fan-kit',
    name: 'CSK Ultimate Super Fan Matchday Bundle',
    price: 89.99,
    originalPrice: 104.99,
    category: 'Fan Kits',
    images: [
      'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'The complete supporter kit: includes Official 2026 Match Jersey, Gold Snapback Cap, CSK Water Bottle, and Supporter Flag.',
    features: [
      'Official Match Jersey (Choose Size)',
      'Gold Snapback Cap',
      'CSK Crest Flag (3x2 ft)',
      'Double-walled 750ml CSK Stainless Bottle'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 30,
    isBestSeller: true
  }
];
