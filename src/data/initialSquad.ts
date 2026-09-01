import { Player } from '@/types';

export const initialSquad: Player[] = [
  {
    id: 'p1',
    slug: 'rahul-garg',
    name: 'Rahul Garg',
    jerseyNumber: 18,
    role: 'Captain / All-Rounder',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm medium',
    nationality: 'Cayman Islands / India',
    dateOfBirth: '1995-04-14',
    bio: 'Dynamic top-order batter and inspirational captain of the Cayman Super Kings. Renowned for his fearless boundary-hitting, tactical captaincy, and match-winning fifties in the Daniel Morris Super League.',
    photoUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800&auto=format&fit=crop',
    stats: {
      matches: 28,
      runs: 946,
      average: 43.0,
      strikeRate: 158.2,
      fifties: 7,
      hundreds: 2,
      highestScore: 104,
      wickets: 19,
      bowlingAverage: 18.4,
      economy: 6.8,
      bestBowling: '3/14',
      catches: 16
    },
    recentPerformances: [
      '53 (42) & 2-0-6-0 vs Greenies Too (Player of the Match)',
      '68* (34) vs George Town Strikers',
      '41 (22) & 2/18 vs Cayman Tigers'
    ],
    isFeatured: true
  },
  {
    id: 'p2',
    slug: 'ravneet-singh',
    name: 'Ravneet Singh',
    jerseyNumber: 24,
    role: 'Bowler',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm fast',
    nationality: 'Cayman Islands',
    dateOfBirth: '1997-08-22',
    bio: 'Strike pace spearhead for CSK. Nicknamed the "Speed Merchant", Ravneet delivers blistering pace with deadly yorkers, recently dismantling Greenies Too with a match-winning spell of 3/16.',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
    stats: {
      matches: 24,
      runs: 112,
      average: 14.0,
      strikeRate: 124.4,
      fifties: 0,
      hundreds: 0,
      highestScore: 28,
      wickets: 42,
      bowlingAverage: 14.2,
      economy: 6.1,
      bestBowling: '4/11',
      catches: 8
    },
    recentPerformances: [
      '3/16 (3.0 overs) vs Greenies Too (Best Bowler Award)',
      '2/22 vs Cayman Youth Academy',
      '3/19 vs West Bay Warriors'
    ],
    isFeatured: true
  },
  {
    id: 'p3',
    slug: 'rajasekhara-kalagotla',
    name: 'Rajasekhara Kalagotla (Raj)',
    jerseyNumber: 10,
    role: 'All-Rounder',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm medium',
    nationality: 'Cayman Islands',
    dateOfBirth: '1996-11-05',
    bio: 'Clutch all-rounder and fielding dynamo. Won Player of the Match against Cayman Youth Academy with an exceptional spell of 3/6 and electric fielding inside the ring.',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
    stats: {
      matches: 22,
      runs: 480,
      average: 32.0,
      strikeRate: 145.0,
      fifties: 3,
      hundreds: 0,
      highestScore: 64,
      wickets: 28,
      bowlingAverage: 16.5,
      economy: 6.4,
      bestBowling: '3/6',
      catches: 15
    },
    recentPerformances: [
      '3/6 (4 overs) & 10 (11) vs Cayman Youth Academy (Player of the Match)',
      '1 catch & 2/19 vs Greenies Too',
      '34* (18) vs Bodden Town CC'
    ],
    isFeatured: true
  },
  {
    id: 'p4',
    slug: 'parthipan-k',
    name: 'Parthipan K (Parthi)',
    jerseyNumber: 7,
    role: 'Batter',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm medium',
    nationality: 'Cayman Islands',
    dateOfBirth: '1998-02-18',
    bio: 'The undisputed Finisher of the Kings. Known for ice-cold composure under pressure, delivering match-winning cameos and crucial boundary bursts in death overs.',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    stats: {
      matches: 25,
      runs: 620,
      average: 38.75,
      strikeRate: 162.8,
      fifties: 4,
      hundreds: 0,
      highestScore: 72,
      wickets: 12,
      bowlingAverage: 21.0,
      economy: 7.2,
      bestBowling: '2/11',
      catches: 11
    },
    recentPerformances: [
      '43* (38 balls, 4x4, 2x6) vs Cayman Youth Academy (The Finisher)',
      '2/11 & 1 catch vs Greenies Too',
      '31* (14) vs North Side CC'
    ],
    isFeatured: true
  },
  {
    id: 'p5',
    slug: 'christopher-balraj',
    name: 'Christopher Balraj',
    jerseyNumber: 11,
    role: 'Bowler',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Leg break',
    nationality: 'Cayman Islands',
    dateOfBirth: '1994-09-12',
    bio: 'The Spin Wizard on slow tracks. Master of deception with sharp turn, subtle googlies, and unbelievable control (3-8 in 4 overs vs Cayman Youth Academy).',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop',
    stats: {
      matches: 26,
      runs: 85,
      average: 9.4,
      strikeRate: 105.0,
      fifties: 0,
      hundreds: 0,
      highestScore: 19,
      wickets: 46,
      bowlingAverage: 12.8,
      economy: 5.2,
      bestBowling: '3/8',
      catches: 9
    },
    recentPerformances: [
      '3/8 (4.0 overs) vs Cayman Youth Academy (Spin Wizard Performance)',
      '17 (14) & 1/20 vs Greenies Too',
      '4/16 vs George Town'
    ],
    isFeatured: true
  },
  {
    id: 'p6',
    slug: 'praisewin-v',
    name: 'Praisewin V',
    jerseyNumber: 99,
    role: 'Wicketkeeper',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'N/A',
    nationality: 'Cayman Islands',
    dateOfBirth: '1999-06-30',
    bio: 'CSK’s acrobatic wicketkeeper and lightning fielder. Renowned for spectacular diving catches and pinpoint stumping behind the stumps.',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=800&auto=format&fit=crop',
    stats: {
      matches: 27,
      runs: 390,
      average: 26.0,
      strikeRate: 138.5,
      fifties: 2,
      hundreds: 0,
      highestScore: 56,
      wickets: 0,
      bowlingAverage: 0,
      economy: 0,
      bestBowling: 'N/A',
      catches: 32
    },
    recentPerformances: [
      '2 sensational catches & 20 (18) vs Greenies Too (Best Fielder Award)',
      '3 catches & 1 stumping vs Cayman Youth Academy',
      '44 (28) vs East End XI'
    ],
    isFeatured: true
  },
  {
    id: 'p7',
    slug: 'gokul-s',
    name: 'Gokul S',
    jerseyNumber: 15,
    role: 'Batter',
    battingStyle: 'Left-hand bat',
    bowlingStyle: 'Right-arm off break',
    nationality: 'Cayman Islands',
    dateOfBirth: '1998-12-04',
    bio: 'Aggressive top-order stroke-maker and athletic inner-ring fielder. Anchored crucial chases in the Daniel Morris Super League.',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    stats: {
      matches: 21,
      runs: 512,
      average: 28.4,
      strikeRate: 142.1,
      fifties: 3,
      hundreds: 0,
      highestScore: 61,
      wickets: 8,
      bowlingAverage: 24.0,
      economy: 7.5,
      bestBowling: '2/18',
      catches: 12
    },
    recentPerformances: [
      '18 (17 balls) & 1 catch vs Greenies Too',
      '52 (31) vs West Bay',
      '1 catch & 15 (9) vs CYA'
    ]
  },
  {
    id: 'p8',
    slug: 'jason-b',
    name: 'Jason B',
    jerseyNumber: 33,
    role: 'Bowler',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm fast',
    nationality: 'Cayman Islands',
    dateOfBirth: '1996-03-15',
    bio: 'Disciplined seam bowler with great swing with the new ball. Key part of the "Bowling Unit on Fire" that bundled out Greenies Too for 70.',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop',
    stats: {
      matches: 19,
      runs: 64,
      average: 10.6,
      strikeRate: 110.0,
      fifties: 0,
      hundreds: 0,
      highestScore: 16,
      wickets: 29,
      bowlingAverage: 15.6,
      economy: 6.3,
      bestBowling: '3/17',
      catches: 9
    },
    recentPerformances: [
      '2-0-7-2 & 1 catch vs Greenies Too',
      '2/21 vs Bodden Town',
      '1/14 vs George Town'
    ]
  },
  {
    id: 'p9',
    slug: 'muthukumar-r',
    name: 'Muthukumar R (Muthu)',
    jerseyNumber: 27,
    role: 'All-Rounder',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm medium',
    nationality: 'Cayman Islands',
    dateOfBirth: '1995-07-29',
    bio: 'Reliable middle order anchor and miserly medium pacer who consistently chokes run rates in middle overs.',
    photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=800&auto=format&fit=crop',
    stats: {
      matches: 23,
      runs: 410,
      average: 27.3,
      strikeRate: 130.0,
      fifties: 2,
      hundreds: 0,
      highestScore: 54,
      wickets: 21,
      bowlingAverage: 19.8,
      economy: 6.6,
      bestBowling: '2/7',
      catches: 8
    },
    recentPerformances: [
      '23 (37) & 2-0-7-1 vs Greenies Too',
      '16 (11) & 1/15 vs CYA',
      '38* (22) vs West Bay'
    ]
  }
];
