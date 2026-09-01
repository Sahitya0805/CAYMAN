import { NewsArticle } from '@/types';

export const initialNews: NewsArticle[] = [
  {
    id: 'n1',
    slug: 'csk-defeat-greenies-by-62-runs',
    title: 'CSK Defeat Greenies Too by 62 Runs — Back-to-Back Wins for the Kings!',
    subtitle: 'Skipper Rahul Garg shines with 53, while Ravneet leads a devastating bowling onslaught.',
    author: 'Cayman Sports Desk',
    category: 'Match Report',
    date: '30 AUG 2026',
    readTime: '4 min read',
    featuredImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1200&auto=format&fit=crop',
    excerpt: 'Cayman Super Kings produced a masterclass performance with bat, ball, and in the field to brush aside Greenies Too by 62 runs at Jimmy Powell Oval.',
    content: `
# Clinical CSK Roar Past Greenies Too

The **Cayman Super Kings** continued their blistering surge in the **Daniel Morris Super League T20**, clinching a commanding **62-run victory** over Greenies Too.

### Batting Unit Sets the Foundation
Electing to bat first on a dry George Town track, CSK captain **Rahul Garg** led from the front with an explosive **53 runs off 42 balls**, laced with **9 sublime boundaries**. Valuable cameos from Gokul (18), Christopher (17), and Muthukumar (23) powered CSK to a competitive total of **132/10 in 20 overs**.

### Bowling Unit On Fire: 70 All Out!
What followed was sheer pace and spin mastery. **Ravneet** struck early, claiming **3 wickets for just 16 runs** in his 3-over burst. Seamer **Jason B** chimed in with **2/7 in 2 overs**, while **Parthipan** bowled with immense discipline to grab **2/11**.

### Fielding Unit Appreciation
Special recognition goes to **Praisewin**, who grabbed two sensational catches behind the stumps, alongside clutch catches by Raj, Gokul, Parthi, and Jason. Greenies were dismantled for just **70 runs in 14 overs**.

> "One Team. One Dream. We knew 132 was very defendable on this pitch, and our bowlers executed the plans to perfection." — *Rahul Garg, CSK Captain*
    `,
    matchScoreSummary: {
      team1: 'Cayman Super Kings',
      score1: '132/10 (20.0 ov)',
      team2: 'Greenies Too',
      score2: '70/10 (14.0 ov)',
      result: 'CSK WON BY 62 RUNS'
    },
    topPerformers: [
      { name: 'Rahul Garg', performance: '53 runs (42 balls, 9x4)', icon: '🏏' },
      { name: 'Ravneet Singh', performance: '3/16 (3.0 ov, Best Bowler)', icon: '🎯' },
      { name: 'Praisewin V', performance: '2 Catches (Best Fielder)', icon: '🧤' }
    ],
    isPublished: true,
    tags: ['Daniel Morris Super League', 'Greenies Too', 'Rahul Garg', 'Match Report']
  },
  {
    id: 'n2',
    slug: 'three-in-a-row-csk-dominate-youth-academy',
    title: 'Three in a Row: Cayman Super Kings Thrash Cayman Youth Academy by 8 Wickets',
    subtitle: 'Rajasekhara Kalagotla (3/6) and Christopher Balraj (3/8) orchestrate bowling clinic.',
    author: 'Editorial Staff',
    category: 'Match Report',
    date: '24 AUG 2026',
    readTime: '3 min read',
    featuredImage: 'https://images.unsplash.com/photo-1531415074868-036b1c57e3b0?q=80&w=1200&auto=format&fit=crop',
    excerpt: 'A third consecutive win for the Kings as spin wizard Christopher Balraj and all-rounder Raj dismantle CYA before Parthi closes the chase in style.',
    content: `
# Three In A Row For The Kings

The unstoppable Cayman Super Kings made it 3 consecutive wins in the Daniel Morris Super League with an 8-wicket rout of Cayman Youth Academy.

Rajasekhara Kalagotla claimed Player of the Match honors for his devastating 3/6 in 4 overs, completely suffocating the CYA top order. Christopher Balraj spun a web on the slow track, claiming 3/8.

In response, 'The Finisher' Parthipan K smashed an unbeaten 43* off 38 deliveries (4 fours, 2 sixes) to sail CSK across the line in only 11 overs.
    `,
    matchScoreSummary: {
      team1: 'Cayman Youth Academy',
      score1: '63/7 (20.0 ov)',
      team2: 'Cayman Super Kings',
      score2: '67/2 (11.0 ov)',
      result: 'CSK WON BY 8 WICKETS'
    },
    topPerformers: [
      { name: 'Rajasekhara Kalagotla', performance: '3/6 (4 overs) & 10 runs', icon: '👑' },
      { name: 'Christopher Balraj', performance: '3/8 (4.0 overs, Spin Wizard)', icon: '🪄' },
      { name: 'Parthipan K', performance: '43* (38 balls, 4x4, 2x6)', icon: '💥' }
    ],
    isPublished: true,
    tags: ['T20', 'CYA', 'Raj', 'Parthi', 'Wins']
  },
  {
    id: 'n3',
    slug: 'meet-the-kings-rahul-garg-leadership',
    title: 'Captain’s Column: "Our Brotherhood & Hunger Are CSK’s Greatest Strengths"',
    subtitle: 'Rahul Garg shares insights into the team culture and preparations for upcoming playoff clashes.',
    author: 'Rahul Garg',
    category: 'Player Spotlight',
    date: '18 AUG 2026',
    readTime: '5 min read',
    featuredImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop',
    excerpt: 'CSK Captain Rahul Garg reflects on team bonding, community cricket in the Cayman Islands, and setting sights on the Super League championship.',
    content: `
# Captain’s Column: The Lion Roars Again

When we started the 2026 Daniel Morris Super League campaign, our motto was clear: **One Team. One Dream.**

Cricket in the Cayman Islands is thriving. We have built an environment where experienced heads and energetic youngsters push each other to excel on every delivery.

Thank you to all our fans who come down to Jimmy Powell Oval every weekend. Your cheers energize our team!
    `,
    isPublished: true,
    tags: ['Rahul Garg', 'Captain', 'Team Culture']
  }
];
