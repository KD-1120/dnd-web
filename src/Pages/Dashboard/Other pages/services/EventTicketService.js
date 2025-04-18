// src/Pages/Dashboard/services/EventTicketService.js

/**
 * Enhanced service class for handling event and ticket operations
 */
export class EventTicketService {
    // Event operations
    static async createEvent(eventData) {
      try {
        const eventId = `event_${Date.now()}`;
        const newEvent = {
          id: eventId,
          ...eventData,
          createdAt: new Date().toISOString(),
          status: eventData.status || 'draft',
          pageViews: 0,
          uniqueVisitors: 0
        };
        
        // Save event to localStorage
        localStorage.setItem(`event_${eventId}`, JSON.stringify(newEvent));
        
        // Also maintain a list of all event IDs for easier querying
        const allEventIds = JSON.parse(localStorage.getItem('all_event_ids') || '[]');
        allEventIds.push(eventId);
        localStorage.setItem('all_event_ids', JSON.stringify(allEventIds));
        
        return eventId;
      } catch (error) {
        console.error('Error creating event:', error);
        throw error;
      }
    }
  
    static async getEvent(eventId) {
      try {
        const event = localStorage.getItem(`event_${eventId}`);
        return event ? JSON.parse(event) : null;
      } catch (error) {
        console.error(`Error getting event ${eventId}:`, error);
        throw error;
      }
    }
  
    static async updateEvent(eventId, eventData) {
      try {
        const existingEvent = await this.getEvent(eventId);
        if (!existingEvent) throw new Error('Event not found');
  
        const updatedEvent = {
          ...existingEvent,
          ...eventData,
          updatedAt: new Date().toISOString()
        };
  
        localStorage.setItem(`event_${eventId}`, JSON.stringify(updatedEvent));
        return true;
      } catch (error) {
        console.error(`Error updating event ${eventId}:`, error);
        throw error;
      }
    }
  
    static async deleteEvent(eventId) {
      try {
        // First check if event exists
        const event = await this.getEvent(eventId);
        if (!event) throw new Error('Event not found');
        
        // Remove the event
        localStorage.removeItem(`event_${eventId}`);
        
        // Remove all related data
        localStorage.removeItem(`tickets_${eventId}`);
        localStorage.removeItem(`sales_${eventId}`);
        localStorage.removeItem(`checkins_${eventId}`);
        localStorage.removeItem(`polls_${eventId}`);
        localStorage.removeItem(`questions_${eventId}`);
        localStorage.removeItem(`visitors_${eventId}`);
        
        // Update the list of all event IDs
        const allEventIds = JSON.parse(localStorage.getItem('all_event_ids') || '[]');
        const updatedEventIds = allEventIds.filter(id => id !== eventId);
        localStorage.setItem('all_event_ids', JSON.stringify(updatedEventIds));
        
        return true;
      } catch (error) {
        console.error(`Error deleting event ${eventId}:`, error);
        throw error;
      }
    }
  
    static async getEvents(filters = {}) {
      try {
        // Get the list of all event IDs for more efficient retrieval
        const allEventIds = JSON.parse(localStorage.getItem('all_event_ids') || '[]');
        
        const events = [];
        for (const eventId of allEventIds) {
          const eventData = localStorage.getItem(`event_${eventId}`);
          if (eventData) {
            const event = JSON.parse(eventData);
            if (this.matchesFilters(event, filters)) {
              events.push(event);
            }
          }
        }
        
        return events;
      } catch (error) {
        console.error('Error getting events:', error);
        throw error;
      }
    }
  
    // Ticket operations
    static async createTicketType(eventId, ticketData) {
      try {
        const event = await this.getEvent(eventId);
        if (!event) throw new Error('Event not found');
  
        const ticketId = `ticket_${Date.now()}`;
        const newTicket = {
          id: ticketId,
          ...ticketData,
          eventId,
          createdAt: new Date().toISOString(),
          status: ticketData.status || 'active',
          sold: 0
        };
  
        const ticketTypes = JSON.parse(localStorage.getItem(`tickets_${eventId}`) || '[]');
        ticketTypes.push(newTicket);
        localStorage.setItem(`tickets_${eventId}`, JSON.stringify(ticketTypes));
  
        return ticketId;
      } catch (error) {
        console.error('Error creating ticket type:', error);
        throw error;
      }
    }
  
    static async getTicketTypes(eventId) {
      try {
        const tickets = localStorage.getItem(`tickets_${eventId}`);
        return tickets ? JSON.parse(tickets) : [];
      } catch (error) {
        console.error(`Error getting tickets for event ${eventId}:`, error);
        throw error;
      }
    }
  
    static async updateTicketType(eventId, ticketId, ticketData) {
      try {
        const ticketTypes = await this.getTicketTypes(eventId);
        const ticketIndex = ticketTypes.findIndex(t => t.id === ticketId);
        
        if (ticketIndex === -1) throw new Error('Ticket type not found');
  
        ticketTypes[ticketIndex] = {
          ...ticketTypes[ticketIndex],
          ...ticketData,
          updatedAt: new Date().toISOString()
        };
  
        localStorage.setItem(`tickets_${eventId}`, JSON.stringify(ticketTypes));
        return true;
      } catch (error) {
        console.error(`Error updating ticket ${ticketId}:`, error);
        throw error;
      }
    }
  
    static async deleteTicketType(eventId, ticketId) {
      try {
        const ticketTypes = await this.getTicketTypes(eventId);
        const updatedTickets = ticketTypes.filter(t => t.id !== ticketId);
        localStorage.setItem(`tickets_${eventId}`, JSON.stringify(updatedTickets));
        return true;
      } catch (error) {
        console.error(`Error deleting ticket ${ticketId}:`, error);
        throw error;
      }
    }
  
    // Sales operations
    static async recordTicketSale(eventId, ticketId, quantity = 1, saleData = {}) {
      try {
        const ticketTypes = await this.getTicketTypes(eventId);
        const ticketIndex = ticketTypes.findIndex(t => t.id === ticketId);
        
        if (ticketIndex === -1) throw new Error('Ticket type not found');
        
        const ticket = ticketTypes[ticketIndex];
        if (ticket.quantity - ticket.sold < quantity) {
          throw new Error('Insufficient tickets available');
        }
  
        // Record the sale
        const saleId = `sale_${Date.now()}`;
        const sale = {
          id: saleId,
          eventId,
          ticketId,
          quantity,
          price: ticket.price,
          total: ticket.price * quantity,
          purchaseDate: new Date().toISOString(),
          status: saleData.status || 'confirmed',
          ...saleData
        };
  
        // Update ticket sales count
        ticket.sold += quantity;
        ticketTypes[ticketIndex] = ticket;
  
        // Save updates
        localStorage.setItem(`tickets_${eventId}`, JSON.stringify(ticketTypes));
        const sales = JSON.parse(localStorage.getItem(`sales_${eventId}`) || '[]');
        sales.push(sale);
        localStorage.setItem(`sales_${eventId}`, JSON.stringify(sales));
  
        return saleId;
      } catch (error) {
        console.error('Error recording ticket sale:', error);
        throw error;
      }
    }
  
    static async getEventSales(eventId) {
      try {
        const sales = localStorage.getItem(`sales_${eventId}`);
        return sales ? JSON.parse(sales) : [];
      } catch (error) {
        console.error(`Error getting sales for event ${eventId}:`, error);
        throw error;
      }
    }
  
    static async updateTicketSale(eventId, saleId, saleData) {
      try {
        const sales = await this.getEventSales(eventId);
        const saleIndex = sales.findIndex(s => s.id === saleId);
        
        if (saleIndex === -1) throw new Error('Sale not found');
  
        sales[saleIndex] = {
          ...sales[saleIndex],
          ...saleData,
          updatedAt: new Date().toISOString()
        };
  
        localStorage.setItem(`sales_${eventId}`, JSON.stringify(sales));
        return true;
      } catch (error) {
        console.error(`Error updating sale ${saleId}:`, error);
        throw error;
      }
    }
  
    static async deleteTicketSale(eventId, saleId) {
      try {
        // Find the sale
        const sales = await this.getEventSales(eventId);
        const sale = sales.find(s => s.id === saleId);
        
        if (!sale) throw new Error('Sale not found');
        
        // Update the ticket availability if needed
        if (sale.ticketId) {
          const ticketTypes = await this.getTicketTypes(eventId);
          const ticketIndex = ticketTypes.findIndex(t => t.id === sale.ticketId);
          
          if (ticketIndex !== -1) {
            ticketTypes[ticketIndex].sold -= sale.quantity || 1;
            localStorage.setItem(`tickets_${eventId}`, JSON.stringify(ticketTypes));
          }
        }
        
        // Remove the sale
        const updatedSales = sales.filter(s => s.id !== saleId);
        localStorage.setItem(`sales_${eventId}`, JSON.stringify(updatedSales));
        
        return true;
      } catch (error) {
        console.error(`Error deleting sale ${saleId}:`, error);
        throw error;
      }
    }
  
    // Analytics operations
    static async recordPageView(eventId, visitorData = {}) {
      try {
        const event = await this.getEvent(eventId);
        if (!event) throw new Error('Event not found');
  
        // Update page views
        event.pageViews = (event.pageViews || 0) + 1;
  
        // Track unique visitors if visitor ID provided
        if (visitorData.visitorId) {
          const visitors = new Set(JSON.parse(localStorage.getItem(`visitors_${eventId}`) || '[]'));
          if (!visitors.has(visitorData.visitorId)) {
            visitors.add(visitorData.visitorId);
            event.uniqueVisitors = visitors.size;
            localStorage.setItem(`visitors_${eventId}`, JSON.stringify([...visitors]));
          }
        }
  
        await this.updateEvent(eventId, event);
        return true;
      } catch (error) {
        console.error('Error recording page view:', error);
        throw error;
      }
    }
  
    static async getSalesAnalytics(eventId) {
      try {
        const sales = await this.getEventSales(eventId);
        
        // Group sales by date
        const salesByDate = sales.reduce((acc, sale) => {
          const date = sale.purchaseDate.split('T')[0];
          acc[date] = acc[date] || { count: 0, revenue: 0 };
          acc[date].count += sale.quantity || 1;
          acc[date].revenue += sale.total || 0;
          return acc;
        }, {});
  
        // Calculate ticket type distribution
        const ticketTypes = await this.getTicketTypes(eventId);
        const ticketDistribution = ticketTypes.map(ticket => ({
          id: ticket.id,
          name: ticket.name,
          sold: ticket.sold || 0,
          revenue: ticket.price * (ticket.sold || 0)
        }));
  
        // Calculate attendee statistics
        const attendeeStats = {
          total: sales.length,
          confirmed: sales.filter(s => s.status === 'confirmed').length,
          pending: sales.filter(s => s.status === 'pending').length,
          cancelled: sales.filter(s => s.status === 'cancelled').length
        };
  
        return {
          salesByDate,
          ticketDistribution,
          attendeeStats,
          totalRevenue: sales.reduce((sum, sale) => sum + (sale.total || 0), 0),
          totalSold: sales.reduce((sum, sale) => sum + (sale.quantity || 1), 0)
        };
      } catch (error) {
        console.error('Error getting sales analytics:', error);
        throw error;
      }
    }
  
    // Ticket validation
    static async validateTicket(ticketCode) {
      try {
        // In a real app, this would validate against a backend
        // For demo purposes, we'll use a simple validation
        
        // Parse the ticket code
        let eventId, ticketId, saleId;
        
        if (ticketCode.includes('_')) {
          [eventId, ticketId, saleId] = ticketCode.split('_');
        } else {
          // If the code format is different, try to look up across all sales
          const allEventIds = JSON.parse(localStorage.getItem('all_event_ids') || '[]');
          for (const eId of allEventIds) {
            const sales = JSON.parse(localStorage.getItem(`sales_${eId}`) || '[]');
            const sale = sales.find(s => s.id === ticketCode);
            if (sale) {
              eventId = eId;
              ticketId = sale.ticketId;
              saleId = sale.id;
              break;
            }
          }
        }
        
        if (!eventId || !saleId) {
          return { valid: false, message: 'Invalid ticket code' };
        }
        
        const sales = JSON.parse(localStorage.getItem(`sales_${eventId}`) || '[]');
        const sale = sales.find(s => s.id === saleId);
        
        if (!sale) {
          return { valid: false, message: 'Invalid ticket' };
        }
        
        if (sale.status === 'cancelled') {
          return { valid: false, message: 'Ticket has been cancelled' };
        }
  
        // Check usage count
        const usage = JSON.parse(localStorage.getItem(`ticket_usage_${ticketCode}`) || '0');
        if (usage >= sale.quantity) {
          return { valid: false, message: 'Ticket already used' };
        }
  
        // Get ticket type information
        const ticketTypes = JSON.parse(localStorage.getItem(`tickets_${eventId}`) || '[]');
        const ticketType = ticketTypes.find(t => t.id === sale.ticketId);
  
        return {
          valid: true,
          ticket: {
            id: ticketCode,
            eventId,
            ...sale,
            ticketType: ticketType?.name || 'Standard',
            attendeeName: sale.attendeeData?.name || 'N/A',
            usageCount: usage,
            quantity: sale.quantity || 1,
            status: 'valid'
          }
        };
      } catch (error) {
        console.error('Error validating ticket:', error);
        throw error;
      }
    }
  
    // Check-in operations
    static async recordCheckIn(eventId, ticketCode, checkInData = {}) {
      try {
        const validation = await this.validateTicket(ticketCode);
        
        if (!validation.valid) {
          throw new Error(validation.message);
        }
  
        const checkInId = `checkin_${Date.now()}`;
        const checkIn = {
          id: checkInId,
          eventId,
          ticketCode,
          timestamp: new Date().toISOString(),
          location: checkInData.location || 'Main Entrance',
          staffMember: checkInData.staffMember || 'Unknown',
          ...checkInData
        };
  
        // Store check-in record
        const checkIns = JSON.parse(localStorage.getItem(`checkins_${eventId}`) || '[]');
        checkIns.push(checkIn);
        localStorage.setItem(`checkins_${eventId}`, JSON.stringify(checkIns));
  
        // Update ticket usage count
        const usage = JSON.parse(localStorage.getItem(`ticket_usage_${ticketCode}`) || '0');
        localStorage.setItem(`ticket_usage_${ticketCode}`, JSON.stringify(usage + 1));
  
        return {
          checkInId,
          status: 'success',
          message: 'Check-in recorded successfully'
        };
      } catch (error) {
        console.error('Error recording check-in:', error);
        throw error;
      }
    }
  
    static async getCheckInHistory(eventId, filters = {}) {
      try {
        const checkIns = JSON.parse(localStorage.getItem(`checkins_${eventId}`) || '[]');
        
        if (Object.keys(filters).length === 0) {
          return checkIns;
        }
  
        return checkIns.filter(checkIn => {
          for (const [key, value] of Object.entries(filters)) {
            if (checkIn[key] !== value) {
              return false;
            }
          }
          return true;
        });
      } catch (error) {
        console.error('Error getting check-in history:', error);
        throw error;
      }
    }
  
    static async getTicketHistory(ticketCode) {
      try {
        // Parse the ticket code to extract eventId
        let eventId;
        
        if (ticketCode.includes('_')) {
          eventId = ticketCode.split('_')[0];
        } else {
          // If the code format is different, try to look up across all check-ins
          const allEventIds = JSON.parse(localStorage.getItem('all_event_ids') || '[]');
          for (const eId of allEventIds) {
            const checkIns = JSON.parse(localStorage.getItem(`checkins_${eId}`) || '[]');
            const found = checkIns.some(c => c.ticketCode === ticketCode);
            if (found) {
              eventId = eId;
              break;
            }
          }
        }
        
        if (!eventId) {
          return [];
        }
        
        const checkIns = await this.getCheckInHistory(eventId);
        return checkIns.filter(checkIn => checkIn.ticketCode === ticketCode);
      } catch (error) {
        console.error('Error getting ticket history:', error);
        throw error;
      }
    }
  
    // Helper methods
    static matchesFilters(event, filters) {
      for (const [key, value] of Object.entries(filters)) {
        if (event[key] !== value) {
          return false;
        }
      }
      return true;
    }
  }