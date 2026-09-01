import { FanPoll } from '@/types';

export const initialPoll: FanPoll = {
  id: 'poll-1',
  question: 'WHO WILL BE PLAYER OF THE MATCH IN THE UPCOMING CLASH VS GREENIES TOO?',
  options: [
    { id: 'opt-1', text: 'Rahul Garg (Skipper & Batter)', votes: 248 },
    { id: 'opt-2', text: 'Ravneet Singh (Pace Spearhead)', votes: 182 },
    { id: 'opt-3', text: 'Parthipan K (The Finisher)', votes: 145 },
    { id: 'opt-4', text: 'Christopher Balraj (Spin Wizard)', votes: 94 },
    { id: 'opt-5', text: 'Praisewin V (Wicketkeeper)', votes: 76 }
  ],
  totalVotes: 745,
  isActive: true
};
