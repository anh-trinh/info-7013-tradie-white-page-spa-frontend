import { defineStore } from 'pinia';
import bookingService from '@/services/booking.service';

export const useQuoteStore = defineStore('quote', {
  state: () => ({
    quotes: [],
    selectedQuote: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchQuotes() {
      this.loading = true;
      this.error = null;
      try {
        const response = await bookingService.getQuotes();
        // Exclude accepted quotes by default for active work
        this.quotes = (response.data || []).filter((q) => q.status !== 'accepted');
      } catch (err) {
        console.error(err);
        this.error = 'Failed to load quotes.';
      } finally {
        this.loading = false;
      }
    },
    async selectQuote(quote) {
      try {
        const response = await bookingService.getQuoteById(quote.id);
        this.selectedQuote = response.data;
      } catch (err) {
        console.error('Failed to fetch quote detail', err);
        this.error = 'Failed to fetch quote detail';
      }
    },
    addNewQuote(newQuote) {
      if (!newQuote) return;
      // Avoid duplicates
      const exists = this.quotes.some((q) => q.id === newQuote.id);
      if (!exists) {
        // Keep newest first (optional)
        this.quotes.unshift(newQuote);
      }
    },
    // Called by WebSocket service for realtime updates
    async handleRealtimeUpdate(updatedQuote) {
      // Update summary list item if present
      const idx = this.quotes.findIndex((q) => q.id === updatedQuote.id);
      if (idx !== -1) this.quotes[idx] = { ...this.quotes[idx], ...updatedQuote };

      // If the currently open thread is the one updated, fetch full details to refresh messages
      if (this.selectedQuote && this.selectedQuote.id === updatedQuote.id) {
        try {
          const response = await bookingService.getQuoteById(updatedQuote.id);
          this.selectedQuote = response.data;
        } catch (e) {
          console.warn('Failed to refresh quote detail on realtime update', e);
          // Fall back to applying whatever we received
          this.selectedQuote = { ...this.selectedQuote, ...updatedQuote };
        }
      }
    },
  },
});
