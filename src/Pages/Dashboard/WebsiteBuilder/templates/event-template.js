export const eventTemplate = {
  id: 'modern-event',
  name: 'Modern Event Template',
  description: 'A modern, fully-featured event template with all essential sections',
  thumbnail: '/templates/modern-event-preview.jpg',
  category: 'Events',
  data: [
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
            eventDate: '',
            fontSize: '24',
            color: '#ffffff',
            layout: 'horizontal',
            showLabels: true
          }
        }
      ]
    },
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
            address: '',
            zoom: 15,
            height: '400px',
            marginBottom: '48'
          }
        }
      ]
    },
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
            tickets: [],
            layout: 'grid',
            showAvailability: true,
            enableQuantitySelector: true,
            buttonStyle: 'primary'
          }
        }
      ]
    }
  ]
};