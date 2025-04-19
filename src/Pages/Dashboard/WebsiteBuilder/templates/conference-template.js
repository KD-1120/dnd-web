export const conferenceTemplate = {
  id: 'modern-conference',
  name: 'Conference & Trade Show',
  description: 'Perfect for multi-track conferences, expos, and trade shows',
  thumbnail: '/templates/conference-preview.jpg',
  category: 'Conference',
  data: [
    // Hero Section with Multi-Track Focus
    {
      type: 'container',
      id: 'hero-section',
      props: {
        bgColor: '#0a2463',
        bgOverlay: 'rgba(10, 36, 99, 0.9)',
        paddingTop: '120',
        paddingBottom: '120',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      },
      components: [
        {
          id: 'conference-dates',
          type: 'text',
          props: {
            text: '', // Will be populated with formatted event dates
            fontSize: '18',
            fontWeight: '600',
            color: '#7f9cf5',
            marginBottom: '24'
          }
        },
        {
          id: 'event-title',
          type: 'title',
          props: {
            text: 'Conference Title',
            fontSize: '56',
            fontWeight: '800',
            color: '#ffffff',
            marginBottom: '24',
            textAlign: 'center'
          }
        },
        {
          id: 'event-description',
          type: 'text',
          props: {
            text: 'Conference description',
            fontSize: '20',
            color: '#cbd5e0',
            maxWidth: '800px',
            textAlign: 'center',
            marginBottom: '48'
          }
        },
        {
          id: 'stats-grid',
          type: 'grid',
          props: {
            columns: 3,
            gap: '32',
            items: [
              {
                label: 'Speakers',
                value: '0', // Will be populated
                color: '#7f9cf5'
              },
              {
                label: 'Sessions',
                value: '0', // Will be populated
                color: '#7f9cf5'
              },
              {
                label: 'Tracks',
                value: '0', // Will be populated
                color: '#7f9cf5'
              }
            ]
          }
        }
      ]
    },

    // Multi-Track Schedule
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
            fontSize: '40',
            color: '#1a202c',
            marginBottom: '48',
            textAlign: 'center'
          }
        },
        {
          id: 'schedule-tabs',
          type: 'tabs',
          props: {
            items: [], // Will be populated with conference days
            defaultTab: 0
          }
        },
        {
          id: 'schedule-grid',
          type: 'scheduleGrid',
          props: {
            tracks: [], // Will be populated with track data
            sessions: [], // Will be populated with session data
            showTime: true,
            showRoom: true,
            showSpeakers: true,
            enableFiltering: true,
            enableFavorites: true
          }
        }
      ]
    },

    // Speakers Grid
    {
      type: 'container',
      id: 'speakers-section',
      props: {
        bgColor: '#f7fafc',
        paddingTop: '96',
        paddingBottom: '96'
      },
      components: [
        {
          id: 'speakers-title',
          type: 'title',
          props: {
            text: 'Featured Speakers',
            fontSize: '40',
            color: '#1a202c',
            marginBottom: '48',
            textAlign: 'center'
          }
        },
        {
          id: 'speakers-grid',
          type: 'speakersGrid',
          props: {
            speakers: [], // Will be populated with speaker data
            columns: 4,
            gap: '32',
            showSocial: true,
            showBio: true
          }
        }
      ]
    },

    // Sponsors Section
    {
      type: 'container',
      id: 'sponsors-section',
      props: {
        bgColor: '#ffffff',
        paddingTop: '96',
        paddingBottom: '96'
      },
      components: [
        {
          id: 'sponsors-title',
          type: 'title',
          props: {
            text: 'Our Sponsors',
            fontSize: '40',
            color: '#1a202c',
            marginBottom: '48',
            textAlign: 'center'
          }
        },
        {
          id: 'sponsor-tiers',
          type: 'sponsorTiers',
          props: {
            tiers: [], // Will be populated with sponsor tier data
            showLogos: true,
            enableLinks: true,
            layout: 'grid'
          }
        }
      ]
    },

    // Venue Information
    {
      type: 'container',
      id: 'venue-section',
      props: {
        bgColor: '#f7fafc',
        paddingTop: '96',
        paddingBottom: '96'
      },
      components: [
        {
          id: 'venue-title',
          type: 'title',
          props: {
            text: 'Conference Venue',
            fontSize: '40',
            color: '#1a202c',
            marginBottom: '48',
            textAlign: 'center'
          }
        },
        {
          id: 'venue-details',
          type: 'venue',
          props: {
            name: '', // Will be populated
            address: '', // Will be populated
            showMap: true,
            showDirections: true,
            showParking: true,
            showTransit: true
          }
        }
      ]
    },

    // Registration & Tickets
    {
      type: 'container',
      id: 'registration-section',
      props: {
        bgColor: '#0a2463',
        paddingTop: '96',
        paddingBottom: '96'
      },
      components: [
        {
          id: 'registration-title',
          type: 'title',
          props: {
            text: 'Register Now',
            fontSize: '40',
            color: '#ffffff',
            marginBottom: '24',
            textAlign: 'center'
          }
        },
        {
          id: 'early-bird-banner',
          type: 'banner',
          props: {
            text: 'Early Bird Pricing Ends Soon!',
            visible: false, // Will be dynamically set based on dates
            style: 'warning'
          }
        },
        {
          id: 'ticket-sales',
          type: 'ticketSalesWidget',
          props: {
            tickets: [], // Will be populated from event data
            layout: 'cards',
            showTiers: true,
            showBenefits: true,
            enableBulkDiscounts: true,
            highlightPopular: true
          }
        }
      ]
    }
  ]
};