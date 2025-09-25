import { io } from 'socket.io-client';
import { useAuthStore } from '@/stores/auth.store';
import { useQuoteStore } from '@/stores/quote.store';

const URL = import.meta.env.VITE_WEBSOCKET_URL || 'http://localhost:8888';
// Normalize path to no trailing slash, default '/ws'
const PATH = (() => {
  const raw = import.meta.env.VITE_WEBSOCKET_PATH || '/ws';
  return raw.endsWith('/') ? raw.slice(0, -1) : raw;
})();
const ENABLED = (import.meta.env.VITE_WEBSOCKET_ENABLED ?? 'true') === 'true';

function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token') || undefined;
}

// Build socket with token in auth payload and configurable path
const socket = io(URL, {
  autoConnect: false,
  path: PATH,
  auth: () => ({ token: getToken() }),
  transports: ['websocket', 'polling'],
  withCredentials: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

socket.on('connect', () => {
  console.log('[socket] connected', socket.id);
  try {
    const auth = useAuthStore();
    if (auth.isLoggedIn && auth.getUser?.id) {
      socket.emit('register_user', auth.getUser.id);
      console.log('[socket] register_user emitted for account', auth.getUser.id);
    }
  } catch (e) {
    console.warn('Socket registration failed', e);
  }
});

let reportedConnectError = false;
socket.on('connect_error', (err) => {
  if (!reportedConnectError) {
    console.warn('[socket] connect_error', err?.message || err);
    reportedConnectError = true; // avoid spamming console
  }
});

socket.on('disconnect', (reason) => {
  console.log('[socket] disconnected', reason);
});

socket.io.on('reconnect_attempt', (attempt) => {
  console.log('[socket] reconnect_attempt', attempt);
});

socket.on('quote_update', (updatedQuote) => {
  console.log('[socket] quote_update received', updatedQuote?.id || updatedQuote);
  const quoteStore = useQuoteStore();
  quoteStore.handleRealtimeUpdate(updatedQuote);
});

// Optional: new quote created and assigned to current user
socket.on('new_quote', (newQuote) => {
  console.log('[socket] new_quote received', newQuote?.id || newQuote);
  const quoteStore = useQuoteStore();
  if (quoteStore?.addNewQuote) {
    quoteStore.addNewQuote(newQuote);
  }
});

// Export a convenience function for components
export function connectSocket() {
  if (!ENABLED) {
    console.info('[socket] disabled via VITE_WEBSOCKET_ENABLED=false');
    return;
  }
  try {
    if (socket?.disconnected) socket.connect();
  } catch (e) {
    console.warn('[socket] connect threw error (ignored)', e);
  }
}

export default socket;
