export const workshopTemplate = {
  id: 'modern-workshop',
  name: 'Workshop & Training',
  description: 'Perfect for workshops, training sessions and educational events',
  thumbnail: '/templates/workshop-preview.jpg',
  category: 'Education',
  data: [
    // Hero Section with Training Focus
    {
      type: 'container',
      id: 'hero-section',
      props: {
        bgColor: '#1a365d',
        paddingTop: '80',
        paddingBottom: '80',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      },
      components: [
        {
          id: 'workshop-badge',
          type: 'text',
          props: {
            text: 'WORKSHOP',
            fontSize: '16',
            fontWeight: '600',
            color: '#90cdf4',
            letterSpacing: '2px',
            marginBottom: '24'
          }
        },
        {
          id: 'event-title',
          type: 'title',
          props: {
            text: 'Workshop Title',
            fontSize: '42',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '16',
            textAlign: 'center'
          }
        },
        {
          id: 'event-description',
          type: 'text',
          props: {
            text: 'Workshop description',
            fontSize: '18',
            color: '#e2e8f0',
            maxWidth: '700px',
            textAlign: 'center',
            marginBottom: '32'
          }
        },
        {
          id: 'registration-cta',
          type: 'button',
          props: {
            text: 'Register Now',
            backgroundColor: '#4299e1',
            color: '#ffffff',
            size: 'large',
            borderRadius: '8',
            marginTop: '24'
          }
        }
      ]
    },

    // Learning Outcomes Section
    {
      type: 'container',
      id: 'outcomes-section',
      props: {
        bgColor: '#ffffff',
        paddingTop: '64',
        paddingBottom: '64'
      },
      components: [
        {
          id: 'outcomes-title',
          type: 'title',
          props: {
            text: 'What You\'ll Learn',
            fontSize: '32',
            color: '#2d3748',
            marginBottom: '48',
            textAlign: 'center'
          }
        },
        {
          id: 'learning-outcomes',
          type: 'list',
          props: {
            items: [], // Will be populated from event data
            iconType: 'checkmark',
            iconColor: '#48bb78',
            spacing: '24'
          }
        }
      ]
    },

    // Workshop Schedule
    {
      type: 'container',
      id: 'schedule-section',
      props: {
        bgColor: '#f7fafc',
        paddingTop: '64',
        paddingBottom: '64'
      },
      components: [
        {
          id: 'schedule-title',
          type: 'title',
          props: {
            text: 'Workshop Schedule',
            fontSize: '32',
            color: '#2d3748',
            marginBottom: '32',
            textAlign: 'center'
          }
        },
        {
          id: 'schedule-agenda',
          type: 'scheduleAgenda',
          props: {
            showDuration: true,
            showBreaks: true,
            compactView: true,
            highlightCurrentSession: true
          }
        }
      ]
    },

    // Instructor Section
    {
      type: 'container',
      id: 'instructor-section',
      props: {
        bgColor: '#ffffff',
        paddingTop: '64',
        paddingBottom: '64'
      },
      components: [
        {
          id: 'instructor-title',
          type: 'title',
          props: {
            text: 'Your Instructor',
            fontSize: '32',
            color: '#2d3748',
            marginBottom: '48',
            textAlign: 'center'
          }
        },
        {
          id: 'instructor-profile',
          type: 'profile',
          props: {
            imageSize: 'large',
            showSocialLinks: true,
            showBio: true,
            layout: 'centered'
          }
        }
      ]
    },

    // Registration Section
    {
      type: 'container',
      id: 'registration-section',
      props: {
        bgColor: '#2d3748',
        paddingTop: '64',
        paddingBottom: '64',
        textAlign: 'center'
      },
      components: [
        {
          id: 'registration-title',
          type: 'title',
          props: {
            text: 'Secure Your Spot',
            fontSize: '32',
            color: '#ffffff',
            marginBottom: '24'
          }
        },
        {
          id: 'countdown-timer',
          type: 'countdownTimer',
          props: {
            eventDate: '', // Will be populated with event start date
            fontSize: '20',
            color: '#ffffff',
            layout: 'horizontal',
            showLabels: true,
            labelColor: '#a0aec0'
          }
        },
        {
          id: 'ticket-sales',
          type: 'ticketSalesWidget',
          props: {
            tickets: [], // Will be populated from event data
            layout: 'vertical',
            showAvailability: true,
            showEarlyBirdPricing: true,
            highlightRecommended: true
          }
        }
      ]
    }
  ]
};