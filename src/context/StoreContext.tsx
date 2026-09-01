'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Player,
  Match,
  NewsArticle,
  MediaItem,
  TicketOrder,
  Product,
  ShopOrder,
  Sponsor,
  HospitalityPackage,
  FanPoll,
  AuditLog,
  SiteSettings,
  BallOutcome
} from '@/types';
import { initialSquad } from '@/data/initialSquad';
import { initialMatches } from '@/data/initialMatches';
import { initialNews } from '@/data/initialNews';
import { initialProducts } from '@/data/initialProducts';
import { initialMedia } from '@/data/initialMedia';
import { initialHospitality } from '@/data/initialHospitality';
import { initialSponsors } from '@/data/initialSponsors';
import { initialPoll } from '@/data/initialPolls';
import { initialSettings, initialOrders, initialAuditLogs } from '@/data/initialSettings';
import { initialTicketOrders } from '@/data/initialTickets';

interface StoreContextType {
  // Data
  players: Player[];
  matches: Match[];
  news: NewsArticle[];
  media: MediaItem[];
  products: Product[];
  ticketOrders: TicketOrder[];
  orders: ShopOrder[];
  sponsors: Sponsor[];
  hospitality: HospitalityPackage[];
  poll: FanPoll;
  settings: SiteSettings;
  auditLogs: AuditLog[];

  // Player Operations
  addPlayer: (player: Omit<Player, 'id'>) => void;
  updatePlayer: (id: string, player: Partial<Player>) => void;
  deletePlayer: (id: string) => void;

  // Match Operations
  addMatch: (match: Omit<Match, 'id'>) => void;
  updateMatch: (id: string, match: Partial<Match>) => void;
  deleteMatch: (id: string) => void;

  // Live Scoring Operations
  recordBall: (matchId: string, ball: {
    runs: number;
    isWicket: boolean;
    wicketType?: 'bowled' | 'caught' | 'lbw' | 'run out' | 'stumped';
    dismissedBatter?: string;
    catcher?: string;
    extraType?: 'wide' | 'no-ball' | 'bye' | 'leg-bye';
    extraRuns?: number;
    commentary?: string;
  }) => void;
  undoBall: (matchId: string) => void;
  setLiveInningsBatter: (matchId: string, strikerName: string, nonStrikerName: string) => void;
  setLiveInningsBowler: (matchId: string, bowlerName: string) => void;

  // News Operations
  addNews: (article: Omit<NewsArticle, 'id'>) => void;
  updateNews: (id: string, article: Partial<NewsArticle>) => void;
  deleteNews: (id: string) => void;

  // Media Operations
  addMedia: (item: Omit<MediaItem, 'id'>) => void;
  deleteMedia: (id: string) => void;

  // Shop & Product Operations
  addProduct: (prod: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, prod: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (orderId: string, status: ShopOrder['status']) => void;
  createShopOrder: (order: Omit<ShopOrder, 'id' | 'orderNumber' | 'createdAt'>) => ShopOrder;

  // Ticket Operations
  createTicketOrder: (order: Omit<TicketOrder, 'id' | 'orderNumber' | 'qrCodeData' | 'status' | 'createdAt'>) => TicketOrder;
  verifyTicket: (qrCodeData: string) => { success: boolean; message: string; ticket?: TicketOrder };

  // Fan Zone Operations
  votePoll: (optionId: string) => void;
  addNewsletterSubscriber: (email: string) => boolean;

  // Sponsor Operations
  addSponsor: (sponsor: Omit<Sponsor, 'id'>) => void;
  updateSponsor: (id: string, sponsor: Partial<Sponsor>) => void;
  deleteSponsor: (id: string) => void;

  // Settings & Homepage Builder
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  reorderHomepageSections: (newOrder: string[]) => void;
  toggleHomepageSection: (sectionKey: string, visible: boolean) => void;

  // Reset to default seed
  resetStoreData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PLAYERS: 'csk_storage_players_v1',
  MATCHES: 'csk_storage_matches_v1',
  NEWS: 'csk_storage_news_v1',
  MEDIA: 'csk_storage_media_v1',
  PRODUCTS: 'csk_storage_products_v1',
  TICKETS: 'csk_storage_tickets_v1',
  ORDERS: 'csk_storage_orders_v1',
  SPONSORS: 'csk_storage_sponsors_v1',
  POLL: 'csk_storage_poll_v1',
  SETTINGS: 'csk_storage_settings_v1',
  LOGS: 'csk_storage_logs_v1',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>(initialSquad);
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [news, setNews] = useState<NewsArticle[]>(initialNews);
  const [media, setMedia] = useState<MediaItem[]>(initialMedia);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [ticketOrders, setTicketOrders] = useState<TicketOrder[]>(initialTicketOrders);
  const [orders, setOrders] = useState<ShopOrder[]>(initialOrders);
  const [sponsors, setSponsors] = useState<Sponsor[]>(initialSponsors);
  const [hospitality] = useState<HospitalityPackage[]>(initialHospitality);
  const [poll, setPoll] = useState<FanPoll>(initialPoll);
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedPlayers = localStorage.getItem(STORAGE_KEYS.PLAYERS);
      if (storedPlayers) setPlayers(JSON.parse(storedPlayers));

      const storedMatches = localStorage.getItem(STORAGE_KEYS.MATCHES);
      if (storedMatches) setMatches(JSON.parse(storedMatches));

      const storedNews = localStorage.getItem(STORAGE_KEYS.NEWS);
      if (storedNews) setNews(JSON.parse(storedNews));

      const storedMedia = localStorage.getItem(STORAGE_KEYS.MEDIA);
      if (storedMedia) setMedia(JSON.parse(storedMedia));

      const storedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (storedProducts) setProducts(JSON.parse(storedProducts));

      const storedTickets = localStorage.getItem(STORAGE_KEYS.TICKETS);
      if (storedTickets) setTicketOrders(JSON.parse(storedTickets));

      const storedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (storedOrders) setOrders(JSON.parse(storedOrders));

      const storedSponsors = localStorage.getItem(STORAGE_KEYS.SPONSORS);
      if (storedSponsors) setSponsors(JSON.parse(storedSponsors));

      const storedPoll = localStorage.getItem(STORAGE_KEYS.POLL);
      if (storedPoll) setPoll(JSON.parse(storedPoll));

      const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (storedSettings) setSettings(JSON.parse(storedSettings));

      const storedLogs = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (storedLogs) setAuditLogs(JSON.parse(storedLogs));
    } catch (e) {
      console.warn('Storage sync failed, using seed data:', e);
    }
    setIsLoaded(true);
  }, []);

  // Multi-tab storage listener
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.newValue) return;
      try {
        if (e.key === STORAGE_KEYS.MATCHES) setMatches(JSON.parse(e.newValue));
        if (e.key === STORAGE_KEYS.PLAYERS) setPlayers(JSON.parse(e.newValue));
        if (e.key === STORAGE_KEYS.NEWS) setNews(JSON.parse(e.newValue));
        if (e.key === STORAGE_KEYS.TICKETS) setTicketOrders(JSON.parse(e.newValue));
        if (e.key === STORAGE_KEYS.ORDERS) setOrders(JSON.parse(e.newValue));
        if (e.key === STORAGE_KEYS.SETTINGS) setSettings(JSON.parse(e.newValue));
      } catch (err) {
        console.error('Storage parse error:', err);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Helpers to persist
  const saveItem = (key: string, data: unknown) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }
    }
  };

  const addAudit = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      adminUser: 'Admin Staff',
      action,
      details,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setAuditLogs(prev => {
      const updated = [newLog, ...prev.slice(0, 49)];
      saveItem(STORAGE_KEYS.LOGS, updated);
      return updated;
    });
  };

  // Player Operations
  const addPlayer = (playerData: Omit<Player, 'id'>) => {
    const newPlayer: Player = {
      ...playerData,
      id: 'p-' + Date.now(),
      slug: playerData.slug || playerData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };
    setPlayers(prev => {
      const updated = [...prev, newPlayer];
      saveItem(STORAGE_KEYS.PLAYERS, updated);
      return updated;
    });
    addAudit('Player Added', `Added player ${newPlayer.name} (#${newPlayer.jerseyNumber})`);
  };

  const updatePlayer = (id: string, playerData: Partial<Player>) => {
    setPlayers(prev => {
      const updated = prev.map(p => (p.id === id ? { ...p, ...playerData } : p));
      saveItem(STORAGE_KEYS.PLAYERS, updated);
      return updated;
    });
    addAudit('Player Updated', `Updated profile of player ID ${id}`);
  };

  const deletePlayer = (id: string) => {
    setPlayers(prev => {
      const target = prev.find(p => p.id === id);
      const updated = prev.filter(p => p.id !== id);
      saveItem(STORAGE_KEYS.PLAYERS, updated);
      if (target) addAudit('Player Deleted', `Removed player ${target.name}`);
      return updated;
    });
  };

  // Match Operations
  const addMatch = (matchData: Omit<Match, 'id'>) => {
    const newMatch: Match = {
      ...matchData,
      id: 'm-' + Date.now()
    };
    setMatches(prev => {
      const updated = [newMatch, ...prev];
      saveItem(STORAGE_KEYS.MATCHES, updated);
      return updated;
    });
    addAudit('Match Created', `Created fixture: ${newMatch.title}`);
  };

  const updateMatch = (id: string, matchData: Partial<Match>) => {
    setMatches(prev => {
      const updated = prev.map(m => (m.id === id ? { ...m, ...matchData } : m));
      saveItem(STORAGE_KEYS.MATCHES, updated);
      return updated;
    });
    addAudit('Match Updated', `Updated match ID ${id}`);
  };

  const deleteMatch = (id: string) => {
    setMatches(prev => {
      const updated = prev.filter(m => m.id !== id);
      saveItem(STORAGE_KEYS.MATCHES, updated);
      return updated;
    });
    addAudit('Match Deleted', `Deleted match ID ${id}`);
  };

  // Live Scoring Engine
  const recordBall = (matchId: string, ball: {
    runs: number;
    isWicket: boolean;
    wicketType?: 'bowled' | 'caught' | 'lbw' | 'run out' | 'stumped';
    dismissedBatter?: string;
    catcher?: string;
    extraType?: 'wide' | 'no-ball' | 'bye' | 'leg-bye';
    extraRuns?: number;
    commentary?: string;
  }) => {
    setMatches(prev => {
      const updated = prev.map(m => {
        if (m.id !== matchId || !m.liveInnings) return m;

        const inn = { ...m.liveInnings };
        const isExtra = !!ball.extraType;
        const totalRunsThisBall = ball.runs + (ball.extraRuns || 0) + (ball.extraType === 'wide' || ball.extraType === 'no-ball' ? 1 : 0);

        // Update overall runs
        inn.runs += totalRunsThisBall;

        // Check if legal ball
        const isLegalBall = !(ball.extraType === 'wide' || ball.extraType === 'no-ball');
        if (isLegalBall) {
          if (inn.ballsInOver >= 5) {
            inn.overs += 1;
            inn.ballsInOver = 0;
            // Over finished: swap strikers
            const temp = inn.currentStriker;
            inn.currentStriker = inn.currentNonStriker;
            inn.currentNonStriker = temp;
          } else {
            inn.ballsInOver += 1;
          }
        }

        // Update current striker if off-the-bat runs
        if (!ball.extraType || ball.extraType === 'no-ball') {
          inn.currentStriker.runs += ball.runs;
          inn.currentStriker.balls += (isLegalBall || ball.extraType === 'no-ball' ? 1 : 0);
          if (ball.runs === 4) inn.currentStriker.fours += 1;
          if (ball.runs === 6) inn.currentStriker.sixes += 1;
        }

        // Update bowler figures
        inn.currentBowler.runsConceded += totalRunsThisBall;
        if (isLegalBall) {
          const totalBallsBowled = Math.floor(inn.currentBowler.overs) * 6 + Math.round((inn.currentBowler.overs % 1) * 10) + 1;
          const fullOvers = Math.floor(totalBallsBowled / 6);
          const remBalls = totalBallsBowled % 6;
          inn.currentBowler.overs = fullOvers + remBalls / 10;
        }

        // Handle Wicket
        if (ball.isWicket) {
          inn.wickets += 1;
          inn.currentBowler.wickets += 1;
          const overNotation = `${inn.overs}.${inn.ballsInOver}`;
          inn.fallOfWickets.push({
            score: `${inn.runs}/${inn.wickets}`,
            batter: inn.currentStriker.name,
            over: overNotation
          });
          inn.currentStriker = {
            name: 'Next Batter',
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            isStriker: true
          };
        }

        // If odd runs, swap striker (unless over boundary swapped them)
        if (ball.runs % 2 === 1 && isLegalBall && inn.ballsInOver !== 0) {
          const temp = inn.currentStriker;
          inn.currentStriker = inn.currentNonStriker;
          inn.currentNonStriker = temp;
        }

        // Recent overs ball string
        let ballToken = ball.runs.toString();
        if (ball.isWicket) ballToken = 'W';
        else if (ball.extraType === 'wide') ballToken = 'WD';
        else if (ball.extraType === 'no-ball') ballToken = 'NB';
        else if (ball.runs === 4) ballToken = '4';
        else if (ball.runs === 6) ballToken = '6';

        const updatedRecent = [...inn.recentOvers.slice(-11), ballToken];
        inn.recentOvers = updatedRecent;

        // Auto update win probability
        const prob = Math.min(96, Math.max(15, Math.round(75 + (inn.runs - (m.awayTeam.score ? parseInt(m.awayTeam.score) : 100)) * 0.4)));

        // Delivery commentary item
        const newDelivery: BallOutcome = {
          over: parseFloat(`${inn.overs}.${inn.ballsInOver}`),
          ballNumber: inn.ballsInOver || 6,
          runs: ball.runs,
          isWicket: ball.isWicket,
          extraType: ball.extraType,
          striker: inn.currentStriker.name,
          nonStriker: inn.currentNonStriker.name,
          bowler: inn.currentBowler.name,
          commentary: ball.commentary || `${ball.isWicket ? 'WICKET! ' : ''}${ball.runs} runs scored by ${inn.currentStriker.name} off ${inn.currentBowler.name}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const deliveries = [newDelivery, ...(m.deliveries || []).slice(0, 49)];

        return {
          ...m,
          homeTeam: {
            ...m.homeTeam,
            score: `${inn.runs}/${inn.wickets}`,
            overs: `${inn.overs}.${inn.ballsInOver}`
          },
          cskWinProbability: prob,
          liveInnings: inn,
          deliveries
        };
      });

      saveItem(STORAGE_KEYS.MATCHES, updated);
      return updated;
    });

    addAudit('Live Scored Ball', `Scored ball on match ${matchId}`);
  };

  const undoBall = (matchId: string) => {
    setMatches(prev => {
      const updated = prev.map(m => {
        if (m.id !== matchId || !m.deliveries || m.deliveries.length === 0 || !m.liveInnings) return m;
        const lastDelivery = m.deliveries[0];
        const remDeliveries = m.deliveries.slice(1);
        const inn = { ...m.liveInnings };

        inn.runs = Math.max(0, inn.runs - lastDelivery.runs);
        if (lastDelivery.isWicket && inn.wickets > 0) inn.wickets -= 1;

        return {
          ...m,
          homeTeam: {
            ...m.homeTeam,
            score: `${inn.runs}/${inn.wickets}`
          },
          deliveries: remDeliveries,
          liveInnings: inn
        };
      });
      saveItem(STORAGE_KEYS.MATCHES, updated);
      return updated;
    });
    addAudit('Live Score Undo', `Reverted last ball on match ${matchId}`);
  };

  const setLiveInningsBatter = (matchId: string, strikerName: string, nonStrikerName: string) => {
    setMatches(prev => {
      const updated = prev.map(m => {
        if (m.id !== matchId || !m.liveInnings) return m;
        return {
          ...m,
          liveInnings: {
            ...m.liveInnings,
            currentStriker: { ...m.liveInnings.currentStriker, name: strikerName },
            currentNonStriker: { ...m.liveInnings.currentNonStriker, name: nonStrikerName }
          }
        };
      });
      saveItem(STORAGE_KEYS.MATCHES, updated);
      return updated;
    });
  };

  const setLiveInningsBowler = (matchId: string, bowlerName: string) => {
    setMatches(prev => {
      const updated = prev.map(m => {
        if (m.id !== matchId || !m.liveInnings) return m;
        return {
          ...m,
          liveInnings: {
            ...m.liveInnings,
            currentBowler: { ...m.liveInnings.currentBowler, name: bowlerName }
          }
        };
      });
      saveItem(STORAGE_KEYS.MATCHES, updated);
      return updated;
    });
  };

  // News Operations
  const addNews = (articleData: Omit<NewsArticle, 'id'>) => {
    const newArticle: NewsArticle = {
      ...articleData,
      id: 'n-' + Date.now(),
      slug: articleData.slug || articleData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };
    setNews(prev => {
      const updated = [newArticle, ...prev];
      saveItem(STORAGE_KEYS.NEWS, updated);
      return updated;
    });
    addAudit('News Published', `Published article: "${newArticle.title}"`);
  };

  const updateNews = (id: string, articleData: Partial<NewsArticle>) => {
    setNews(prev => {
      const updated = prev.map(n => (n.id === id ? { ...n, ...articleData } : n));
      saveItem(STORAGE_KEYS.NEWS, updated);
      return updated;
    });
    addAudit('News Updated', `Edited article ID ${id}`);
  };

  const deleteNews = (id: string) => {
    setNews(prev => {
      const updated = prev.filter(n => n.id !== id);
      saveItem(STORAGE_KEYS.NEWS, updated);
      return updated;
    });
    addAudit('News Deleted', `Deleted article ID ${id}`);
  };

  // Media Operations
  const addMedia = (itemData: Omit<MediaItem, 'id'>) => {
    const newItem: MediaItem = { ...itemData, id: 'm-' + Date.now() };
    setMedia(prev => {
      const updated = [newItem, ...prev];
      saveItem(STORAGE_KEYS.MEDIA, updated);
      return updated;
    });
    addAudit('Media Uploaded', `Added media "${newItem.title}"`);
  };

  const deleteMedia = (id: string) => {
    setMedia(prev => {
      const updated = prev.filter(m => m.id !== id);
      saveItem(STORAGE_KEYS.MEDIA, updated);
      return updated;
    });
    addAudit('Media Deleted', `Removed media ID ${id}`);
  };

  // Product Operations
  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...prodData,
      id: 'prod-' + Date.now(),
      slug: prodData.slug || prodData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };
    setProducts(prev => {
      const updated = [newProd, ...prev];
      saveItem(STORAGE_KEYS.PRODUCTS, updated);
      return updated;
    });
    addAudit('Product Added', `Added product ${newProd.name}`);
  };

  const updateProduct = (id: string, prodData: Partial<Product>) => {
    setProducts(prev => {
      const updated = prev.map(p => (p.id === id ? { ...p, ...prodData } : p));
      saveItem(STORAGE_KEYS.PRODUCTS, updated);
      return updated;
    });
    addAudit('Product Updated', `Updated product ID ${id}`);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== id);
      saveItem(STORAGE_KEYS.PRODUCTS, updated);
      return updated;
    });
    addAudit('Product Deleted', `Removed product ID ${id}`);
  };

  const updateOrderStatus = (orderId: string, status: ShopOrder['status']) => {
    setOrders(prev => {
      const updated = prev.map(o => (o.id === orderId ? { ...o, status } : o));
      saveItem(STORAGE_KEYS.ORDERS, updated);
      return updated;
    });
    addAudit('Order Status Updated', `Order ${orderId} marked as ${status}`);
  };

  const createShopOrder = (orderData: Omit<ShopOrder, 'id' | 'orderNumber' | 'createdAt'>): ShopOrder => {
    const newOrder: ShopOrder = {
      ...orderData,
      id: 'ord-' + Date.now(),
      orderNumber: 'ORD-CSK' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setOrders(prev => {
      const updated = [newOrder, ...prev];
      saveItem(STORAGE_KEYS.ORDERS, updated);
      return updated;
    });
    addAudit('New Store Order', `Order ${newOrder.orderNumber} placed by ${newOrder.customerName}`);
    return newOrder;
  };

  // Ticket Operations
  const createTicketOrder = (orderData: Omit<TicketOrder, 'id' | 'orderNumber' | 'qrCodeData' | 'status' | 'createdAt'>): TicketOrder => {
    const orderNum = 'CSK' + Math.floor(10000 + Math.random() * 90000);
    const newOrder: TicketOrder = {
      ...orderData,
      id: 't-ord-' + Date.now(),
      orderNumber: orderNum,
      qrCodeData: `CSK-TICKET-${orderNum}-${orderData.customerName.toUpperCase().replace(/\s+/g, '')}-${orderData.category.substring(0, 3).toUpperCase()}`,
      status: 'VALID',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setTicketOrders(prev => {
      const updated = [newOrder, ...prev];
      saveItem(STORAGE_KEYS.TICKETS, updated);
      return updated;
    });
    addAudit('Ticket Purchased', `Ticket order #${newOrder.orderNumber} generated for ${newOrder.customerName}`);
    return newOrder;
  };

  const verifyTicket = (qrCodeData: string) => {
    const ticket = ticketOrders.find(t => t.qrCodeData === qrCodeData || t.orderNumber === qrCodeData);
    if (!ticket) {
      return { success: false, message: 'Invalid ticket pass. No matching ticket found in database.' };
    }
    if (ticket.status === 'CHECKED_IN') {
      return { success: false, message: `Ticket #${ticket.orderNumber} was ALREADY CHECKED IN previously.`, ticket };
    }
    if (ticket.status === 'CANCELLED') {
      return { success: false, message: `Ticket #${ticket.orderNumber} is CANCELLED or refunded.`, ticket };
    }

    // Mark as checked in
    const updated = ticketOrders.map(t => (t.id === ticket.id ? { ...t, status: 'CHECKED_IN' as const } : t));
    setTicketOrders(updated);
    saveItem(STORAGE_KEYS.TICKETS, updated);
    addAudit('Ticket Checked In', `Gate verification: Ticket #${ticket.orderNumber} (${ticket.customerName}) checked in.`);

    const verifiedTicket: TicketOrder = { ...ticket, status: 'CHECKED_IN' as const };

    return {
      success: true,
      message: `Ticket Verified! Welcome ${ticket.customerName} (${ticket.category} - ${ticket.quantity} seats)`,
      ticket: verifiedTicket
    };
  };

  // Fan Zone Operations
  const votePoll = (optionId: string) => {
    setPoll(prev => {
      const updatedOptions = prev.options.map(opt => (opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt));
      const updatedPoll = {
        ...prev,
        options: updatedOptions,
        totalVotes: prev.totalVotes + 1
      };
      saveItem(STORAGE_KEYS.POLL, updatedPoll);
      return updatedPoll;
    });
  };

  const addNewsletterSubscriber = (email: string) => {
    addAudit('Newsletter Subscription', `New fan subscriber registered: ${email}`);
    return true;
  };

  // Sponsor Operations
  const addSponsor = (sData: Omit<Sponsor, 'id'>) => {
    const newSp: Sponsor = { ...sData, id: 'sp-' + Date.now() };
    setSponsors(prev => {
      const updated = [...prev, newSp];
      saveItem(STORAGE_KEYS.SPONSORS, updated);
      return updated;
    });
    addAudit('Sponsor Added', `Added sponsor ${newSp.name}`);
  };

  const updateSponsor = (id: string, sData: Partial<Sponsor>) => {
    setSponsors(prev => {
      const updated = prev.map(s => (s.id === id ? { ...s, ...sData } : s));
      saveItem(STORAGE_KEYS.SPONSORS, updated);
      return updated;
    });
  };

  const deleteSponsor = (id: string) => {
    setSponsors(prev => {
      const updated = prev.filter(s => s.id !== id);
      saveItem(STORAGE_KEYS.SPONSORS, updated);
      return updated;
    });
  };

  // Settings & Layout Builder
  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      saveItem(STORAGE_KEYS.SETTINGS, updated);
      return updated;
    });
    addAudit('Settings Updated', 'Admin modified site configuration');
  };

  const reorderHomepageSections = (newOrder: string[]) => {
    setSettings(prev => {
      const updated = { ...prev, homepageSectionsOrder: newOrder };
      saveItem(STORAGE_KEYS.SETTINGS, updated);
      return updated;
    });
    addAudit('Homepage Reordered', 'Admin updated homepage section display order');
  };

  const toggleHomepageSection = (sectionKey: string, visible: boolean) => {
    setSettings(prev => {
      const updated = {
        ...prev,
        homepageSectionsVisibility: {
          ...prev.homepageSectionsVisibility,
          [sectionKey]: visible
        }
      };
      saveItem(STORAGE_KEYS.SETTINGS, updated);
      return updated;
    });
    addAudit('Homepage Section Toggled', `Toggled ${sectionKey} to ${visible ? 'visible' : 'hidden'}`);
  };

  const resetStoreData = () => {
    setPlayers(initialSquad);
    setMatches(initialMatches);
    setNews(initialNews);
    setMedia(initialMedia);
    setProducts(initialProducts);
    setTicketOrders(initialTicketOrders);
    setOrders(initialOrders);
    setSponsors(initialSponsors);
    setPoll(initialPoll);
    setSettings(initialSettings);
    setAuditLogs(initialAuditLogs);
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  };

  return (
    <StoreContext.Provider
      value={{
        players,
        matches,
        news,
        media,
        products,
        ticketOrders,
        orders,
        sponsors,
        hospitality,
        poll,
        settings,
        auditLogs,
        addPlayer,
        updatePlayer,
        deletePlayer,
        addMatch,
        updateMatch,
        deleteMatch,
        recordBall,
        undoBall,
        setLiveInningsBatter,
        setLiveInningsBowler,
        addNews,
        updateNews,
        deleteNews,
        addMedia,
        deleteMedia,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        createShopOrder,
        createTicketOrder,
        verifyTicket,
        votePoll,
        addNewsletterSubscriber,
        addSponsor,
        updateSponsor,
        deleteSponsor,
        updateSettings,
        reorderHomepageSections,
        toggleHomepageSection,
        resetStoreData
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
