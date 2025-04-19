export const conferenceTemplate = {
  id: 'modern-conference',
  name: 'Professional Conference',
  description: 'Perfect for business conferences and professional events',
  thumbnail: '/api/placeholder/400/250',
  category: 'Conference',
  data: [
    // Hero Section with Countdown
    {
      type: 'container',
      id: 'hero-section',
      props: {
        bgColor: '#0f172a',
        bgImage: '',
        paddingTop: '120',
        paddingBottom: '120',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      },
      components: [
        {
          id: 'conf-badge',
          type: 'text',
          props: {
            text: '2025',
            fontSize: '18',
            fontWeight: '600',
            color: '#60a5fa',
            marginBottom: '16',
            backgroundColor: 'rgba(96, 165, 250, 0.1)',
            padding: '8px 16px',
            borderRadius: '9999px'
          }
        },
        {
          id: 'conf-title',
          type: 'title',
          props: {
            text: 'Conference Title',
            fontSize: '56',
            fontWeight: '800',
            color: '#ffffff',
            marginBottom: '24'
          }
        },
        {
          id: 'conf-description',
          type: 'text',
          props: {
            text: 'Conference description',
            fontSize: '20',
            color: '#94a3b8',
            maxWidth: '800px',
            marginBottom: '48'
          }
        },
        {
          id: 'conf-countdown',
          type: 'countdownTimer',
          props: {
            eventDate: '',
            fontSize: '24',
            color: '#ffffff',
            layout: 'horizontal',
            showLabels: true,
            labelColor: '#60a5fa'
          }
        }
      ]
    },

    // Schedule Section
    {
      type: 'container',
      id: 'schedule-section',
      props: {
        bgColor: '#ffffff',
        paddingTop: '96',
        paddingBottom: '96'
      },
      components: [
        {
          id: 'schedule-title',
          type: 'title',
          props: {
            text: 'Conference Schedule',
            fontSize: '36',
            color: '#111827',
            alignment: 'center',
            marginBottom: '48'
          }
        },
        {
          id: 'schedule-agenda',
          type: 'scheduleAgenda',
          props: {
            dates: [], // Will be populated based on event dates
            timeSlotHeight: '120',
            showSpeakers: true,
            showRoomInfo: true,
            enableFiltering: true,
            trackColors: ['#60a5fa', '#34d399', '#f472b6']
          }
        }
      ]
    },

    // Tickets Section
    {
      type: 'container',
      id: 'tickets-section',
      props: {
        bgColor: '#f8fafc',
        paddingTop: '96',
        paddingBottom: '96'
      },
      components: [
        {
          id: 'tickets-title',
          type: 'title',
          props: {
            text: 'Choose Your Pass',
            fontSize: '36',
            color: '#111827',
            alignment: 'center',
            marginBottom: '16'
          }
        },
        {
          id: 'tickets-subtitle',
          type: 'text',
          props: {
            text: 'Select the pass that best suits your needs',
            fontSize: '18',
            color: '#64748b',
            alignment: 'center',
            marginBottom: '48'
          }
        },
        {
          id: 'ticket-sales',
          type: 'ticketSalesWidget',
          props: {
            tickets: [],
            layout: 'cards',
            showAvailability: true,
            enableQuantitySelector: true,
            buttonStyle: 'primary',
            featuredTicketIndex: 1
          }
        }
      ]
    },

    // Venue Section
    {
      type: 'container',
      id: 'venue-section',
      props: {
        bgColor: '#ffffff',
        paddingTop: '96',
        paddingBottom: '96'
      },
      components: [
        {
          id: 'venue-title',
          type: 'title',
          props: {
            text: 'Conference Venue',
            fontSize: '36',
            color: '#111827',
            alignment: 'center',
            marginBottom: '48'
          }
        },
        {
          id: 'venue-map',
          type: 'googleMaps',
          props: {
            address: '',
            zoom: 15,
            height: '400px',
            marginBottom: '32',
            showDirectionsLink: true
          }
        }
      ]
    },

    // Social & Sharing
    {
      type: 'container',
      id: 'social-section',
      props: {
        bgColor: '#0f172a',
        paddingTop: '64',
        paddingBottom: '64',
        textAlign: 'center'
      },
      components: [
        {
          id: 'social-title',
          type: 'title',
          props: {
            text: 'Share With Your Network',
            fontSize: '24',
            color: '#ffffff',
            marginBottom: '24'
          }
        },
        {
          id: 'social-sharing',
          type: 'socialMediaSharing',
          props: {
            networks: ['facebook', 'twitter', 'linkedin', 'email'],
            shareText: '',
            buttonStyle: 'outline',
            buttonSize: 'large',
            spacing: '16',
            iconColor: '#60a5fa',
            backgroundColor: 'transparent'
          }
        }
      ]
    }
  ]
};