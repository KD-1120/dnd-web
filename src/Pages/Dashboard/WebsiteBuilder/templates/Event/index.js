// src/Pages/Dashboard/WebsiteBuilder/templates/Event/index.js
export const eventTemplate = {
  id: 'modern-event',
  name: 'Modern Event Template',
  description: 'A modern, fully-featured event template with all essential sections',
  thumbnail: '/api/placeholder/400/250',
  category: 'Events',
  data: [
    // Hero Section with Countdown
    {
      type: 'container',
      id: 'hero-section',
      props: {
        bgColor: '#111827',
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
          id: 'event-title',
          type: 'title',
          props: {
            text: 'Event Title',
            fontSize: '48',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '24'
          }
        },
        {
          id: 'event-description',
          type: 'text',
          props: {
            text: 'Event description goes here',
            fontSize: '20',
            color: '#ffffff',
            maxWidth: '800px',
            marginBottom: '48'
          }
        },
        {
          id: 'event-countdown',
          type: 'countdownTimer',
          props: {
            eventDate: '', // Will be populated with event start date
            fontSize: '24',
            color: '#ffffff',
            layout: 'horizontal',
            showLabels: true
          }
        }
      ]
    },

    // Event Details Section
    {
      type: 'container',
      id: 'details-section',
      props: {
        bgColor: '#ffffff',
        paddingTop: '96',
        paddingBottom: '96'
      },
      components: [
        {
          id: 'details-title',
          type: 'title',
          props: {
            text: 'Event Details',
            fontSize: '36',
            color: '#111827',
            alignment: 'center',
            marginBottom: '48'
          }
        },
        {
          id: 'details-map',
          type: 'googleMaps',
          props: {
            address: '', // Will be populated with event venue
            zoom: 15,
            height: '400px',
            marginBottom: '48'
          }
        }
      ]
    },

    // Tickets Section
    {
      type: 'container',
      id: 'tickets-section',
      props: {
        bgColor: '#f3f4f6',
        paddingTop: '96',
        paddingBottom: '96'
      },
      components: [
        {
          id: 'tickets-title',
          type: 'title',
          props: {
            text: 'Get Your Tickets',
            fontSize: '36',
            color: '#111827',
            alignment: 'center',
            marginBottom: '48'
          }
        },
        {
          id: 'ticket-sales',
          type: 'ticketSalesWidget',
          props: {
            tickets: [], // Will be populated with event ticket types
            layout: 'grid',
            showAvailability: true,
            enableQuantitySelector: true,
            buttonStyle: 'primary'
          }
        }
      ]
    },

    // Image Gallery Section
    {
      type: 'container',
      id: 'gallery-section',
      props: {
        bgColor: '#ffffff',
        paddingTop: '96',
        paddingBottom: '96'
      },
      components: [
        {
          id: 'gallery-title',
          type: 'title',
          props: {
            text: 'Event Gallery',
            fontSize: '36',
            color: '#111827',
            alignment: 'center',
            marginBottom: '48'
          }
        },
        {
          id: 'gallery',
          type: 'image',
          props: {
            images: [], // Can be populated with event images
            layout: 'grid',
            columnCount: 3,
            gapSize: '24'
          }
        }
      ]
    },

    // Social Sharing Section
    {
      type: 'container',
      id: 'social-section',
      props: {
        bgColor: '#f3f4f6',
        paddingTop: '64',
        paddingBottom: '64',
        textAlign: 'center'
      },
      components: [
        {
          id: 'social-title',
          type: 'title',
          props: {
            text: 'Share This Event',
            fontSize: '24',
            color: '#111827',
            marginBottom: '24'
          }
        },
        {
          id: 'social-sharing',
          type: 'socialMediaSharing',
          props: {
            networks: ['facebook', 'twitter', 'linkedin', 'email'],
            shareText: '', // Will be populated with event title and description
            buttonStyle: 'rounded',
            buttonSize: 'large',
            spacing: '16'
          }
        }
      ]
    }
  ]
};