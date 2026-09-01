import { Match } from '@/types';

export const initialMatches: Match[] = [
  {
    id: 'm-live',
    title: 'CSK vs Greenies Too - Grand Clash',
    tournament: 'Daniel Morris Super League T20 2026',
    homeTeam: {
      name: 'Cayman Super Kings',
      shortName: 'CSK',
      logo: '🦁',
      score: '132/6',
      overs: '18.4'
    },
    awayTeam: {
      name: 'Greenies Too',
      shortName: 'GREENIES',
      logo: '🐢',
      score: '128/8',
      overs: '20.0'
    },
    date: '2026-08-30',
    time: '7:00 PM EST',
    venue: 'Jimmy Powell Oval, George Town, Cayman Islands',
    status: 'LIVE',
    cskWinProbability: 82,
    liveInnings: {
      teamName: 'Cayman Super Kings',
      runs: 132,
      wickets: 6,
      overs: 18,
      ballsInOver: 4,
      currentStriker: {
        name: 'Rahul Garg',
        runs: 53,
        balls: 42,
        fours: 9,
        sixes: 0,
        isStriker: true
      },
      currentNonStriker: {
        name: 'Gokul S',
        runs: 18,
        balls: 17,
        fours: 2,
        sixes: 0,
        isStriker: false
      },
      currentBowler: {
        name: 'Ravneet (Opposition Bowler)',
        overs: 3.4,
        maidens: 0,
        runsConceded: 24,
        wickets: 2
      },
      recentOvers: ['1', '4', '0', '1', '2', '4', '6', '1'],
      fallOfWickets: [
        { score: '24/1', batter: 'Muthukumar R', over: '3.2' },
        { score: '62/2', batter: 'Parthipan K', over: '8.4' },
        { score: '88/3', batter: 'Christopher B', over: '12.1' },
        { score: '105/4', batter: 'Rajasekhara K', over: '15.0' },
        { score: '122/5', batter: 'Praisewin V', over: '17.2' }
      ]
    },
    deliveries: [
      {
        over: 18.4,
        ballNumber: 4,
        runs: 1,
        isWicket: false,
        striker: 'Rahul Garg',
        nonStriker: 'Gokul S',
        bowler: 'R. Davis',
        commentary: 'Rahul Garg drives gently down to long-on for a brisk single. Raises his bat for a classy half-century!',
        timestamp: '22:45'
      },
      {
        over: 18.3,
        ballNumber: 3,
        runs: 4,
        isWicket: false,
        striker: 'Rahul Garg',
        nonStriker: 'Gokul S',
        bowler: 'R. Davis',
        commentary: 'FOUR! Smashed through extra cover! Pure timing from the CSK skipper.',
        timestamp: '22:44'
      },
      {
        over: 18.2,
        ballNumber: 2,
        runs: 2,
        isWicket: false,
        striker: 'Rahul Garg',
        nonStriker: 'Gokul S',
        bowler: 'R. Davis',
        commentary: 'Worked away off the pads into the deep midwicket pocket. Superb running between the wickets.',
        timestamp: '22:43'
      },
      {
        over: 18.1,
        ballNumber: 1,
        runs: 0,
        isWicket: false,
        striker: 'Rahul Garg',
        nonStriker: 'Gokul S',
        bowler: 'R. Davis',
        commentary: 'Good length delivery outside off, defended safely to point.',
        timestamp: '22:42'
      }
    ],
    ticketPriceFrom: 10,
    bannerImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'm-upcoming-1',
    title: 'Cayman Super Kings vs George Town Strikers',
    tournament: 'Daniel Morris Super League T20 2026',
    homeTeam: {
      name: 'Cayman Super Kings',
      shortName: 'CSK',
      logo: '🦁'
    },
    awayTeam: {
      name: 'George Town Strikers',
      shortName: 'GTS',
      logo: '⚡'
    },
    date: '2026-09-20',
    time: '7:00 PM EST',
    venue: 'Jimmy Powell Oval, George Town',
    status: 'UPCOMING',
    ticketPriceFrom: 10,
    bannerImage: 'https://images.unsplash.com/photo-1531415074868-036b1c57e3b0?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'm-upcoming-2',
    title: 'Cayman Super Kings vs West Bay Warriors',
    tournament: 'Daniel Morris Super League T20 2026',
    homeTeam: {
      name: 'Cayman Super Kings',
      shortName: 'CSK',
      logo: '🦁'
    },
    awayTeam: {
      name: 'West Bay Warriors',
      shortName: 'WBW',
      logo: '⚔️'
    },
    date: '2026-09-27',
    time: '4:30 PM EST',
    venue: 'Jimmy Powell Oval, George Town',
    status: 'UPCOMING',
    ticketPriceFrom: 15,
    bannerImage: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'm-completed-1',
    title: 'Cayman Super Kings vs Greenies Too',
    tournament: 'Daniel Morris Super League T20 2026',
    homeTeam: {
      name: 'Cayman Super Kings',
      shortName: 'CSK',
      logo: '🦁',
      score: '132/10',
      overs: '20.0'
    },
    awayTeam: {
      name: 'Greenies Too',
      shortName: 'GREENIES',
      logo: '🐢',
      score: '70 ALL OUT',
      overs: '14.0'
    },
    date: '2026-08-23',
    time: '7:00 PM EST',
    venue: 'Jimmy Powell Oval',
    status: 'COMPLETED',
    result: 'CSK WON BY 62 RUNS',
    summary: 'Another complete team performance! CSK posted 132 before our bowling unit caught fire, bundling out Greenies Too for just 70 runs in 14 overs.',
    topPerformers: [
      { player: 'Rahul Garg', role: 'Best Batsman', stat: '53 runs (42 balls, 9x4)', badge: '🥇' },
      { player: 'Ravneet Singh', role: 'Best Bowler', stat: '3/16 (3.0 overs)', badge: '🎯' },
      { player: 'Praisewin V', role: 'Best Fielder', stat: '2 Catches', badge: '🧤' },
      { player: 'Jason B', role: 'Seam Bowler', stat: '2-0-7-2 & 1 Catch', badge: '⚡' }
    ],
    bannerImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'm-completed-2',
    title: 'Cayman Super Kings vs Cayman Youth Academy',
    tournament: 'Daniel Morris Super League T20 2026',
    homeTeam: {
      name: 'Cayman Youth Academy',
      shortName: 'CYA',
      logo: '🎓',
      score: '63/7',
      overs: '20.0'
    },
    awayTeam: {
      name: 'Cayman Super Kings',
      shortName: 'CSK',
      logo: '🦁',
      score: '67/2',
      overs: '11.0'
    },
    date: '2026-08-16',
    time: '4:00 PM EST',
    venue: 'Jimmy Powell Oval',
    status: 'COMPLETED',
    result: 'CSK WON BY 8 WICKETS (3 IN A ROW)',
    summary: 'Clinical, disciplined, relentless. A bowling masterclass from Rajasekhara (3/6) and Christopher Balraj (3/8) restricted CYA to 63 before Parthi guided us home.',
    topPerformers: [
      { player: 'Rajasekhara K (Raj)', role: 'Player of the Match', stat: '3/6 (4 ovs) & 10 (11)', badge: '👑' },
      { player: 'Christopher Balraj', role: 'Spin Wizard', stat: '3/8 (4.0 overs)', badge: '🪄' },
      { player: 'Parthipan K (Parthi)', role: 'The Finisher', stat: '43* (38 balls, 4x4, 2x6)', badge: '💥' }
    ],
    bannerImage: 'https://images.unsplash.com/photo-1531415074868-036b1c57e3b0?q=80&w=1200&auto=format&fit=crop'
  }
];
