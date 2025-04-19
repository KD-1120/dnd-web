export const eventTemplate = {
    id: 'modern-event',
    name: 'Event Landing Page',
    description: 'A modern event landing page template with countdown timer, schedule and ticket sales',
    thumbnail: '/templates/event-preview.jpg',
    category: 'Events',
    data: [
      // Full-screen Hero Header Section (100vw × 100vh)
      {
        type: 'container',
        id: 'hero-header',
        props: {
          bgColor: '#111827',
          bgImage: '/api/placeholder/1920/1080',
          bgOverlay: 'rgba(0, 0, 0, 0.6)',
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '64',
          position: 'relative'
        },
        components: [
          {
            type: 'text',
            id: 'event-date',
            props: {
              content: '{{startDateFormatted}} - {{endDateFormatted}}',
              fontSize: 'lg',
              fontWeight: 'medium',
              color: '#ffffff',
              marginBottom: '24'
            }
          },
          {
            type: 'text',
            id: 'event-title',
            props: {
              content: '{{title}}',
              fontSize: '6xl',
              fontWeight: 'bold',
              color: '#ffffff',
              marginBottom: '16',
              lineHeight: '1.1'
            }
          },
          {
            type: 'text',
            id: 'event-subtitle',
            props: {
              content: '{{description}}',
              fontSize: 'xl',
              fontWeight: 'normal',
              color: '#9ca3af',
              marginBottom: '40',
              maxWidth: '600px'
            }
          },
          {
            type: 'button',
            id: 'get-tickets-button',
            props: {
              text: 'GET TICKETS',
              href: '#tickets-section',
              bgColor: '#0df5e3',
              hoverBgColor: '#0ac9bb',
              textColor: '#111827',
              hoverTextColor: '#111827',
              borderRadius: '4',
              fontSize: 'md',
              fontWeight: 'bold',
              padding: '12px 32px'
            }
          }
        ]
      },
  
      // Main container for content sections
      {
        type: 'container',
        id: 'page-wrapper',
        props: {
          bgColor: '#111827',
          width: '100%',
          padding: '64px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '64'
        },
        components: [
          // Event Description Section
          {
            type: 'container',
            id: 'event-description-section',
            props: {
              width: '100%',
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '48px 0'
            },
            components: [
              {
                type: 'text',
                id: 'about-title',
                props: {
                  content: 'About The Event',
                  fontSize: '3xl',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  marginBottom: '24'
                }
              },
              {
                type: 'text',
                id: 'about-description',
                props: {
                  content: '{{description}}',
                  fontSize: 'lg',
                  fontWeight: 'normal',
                  color: '#9ca3af',
                  marginBottom: '24',
                  lineHeight: '1.6'
                }
              },
              {
                type: 'container',
                id: 'event-info-grid',
                props: {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '24',
                  marginTop: '32'
                },
                components: [
                  {
                    type: 'infoCard',
                    id: 'location-info',
                    props: {
                      icon: 'MapPin',
                      title: 'Venue',
                      description: '{{venue}}',
                      bgColor: '#1f2937',
                      iconColor: '#0df5e3',
                      titleColor: '#ffffff',
                      descriptionColor: '#9ca3af',
                      borderRadius: '8',
                      padding: '24'
                    }
                  },
                  {
                    type: 'infoCard',
                    id: 'date-info',
                    props: {
                      icon: 'Calendar',
                      title: 'Date & Time',
                      description: '{{startDateFormatted}} to {{endDateFormatted}}',
                      bgColor: '#1f2937',
                      iconColor: '#0df5e3',
                      titleColor: '#ffffff',
                      descriptionColor: '#9ca3af',
                      borderRadius: '8',
                      padding: '24'
                    }
                  },
                  {
                    type: 'infoCard',
                    id: 'capacity-info',
                    props: {
                      icon: 'Users',
                      title: 'Capacity',
                      description: '{{capacity}} Attendees',
                      bgColor: '#1f2937',
                      iconColor: '#0df5e3',
                      titleColor: '#ffffff',
                      descriptionColor: '#9ca3af',
                      borderRadius: '8',
                      padding: '24'
                    }
                  }
                ]
              }
            ]
          },

          {
            type: 'container',
            id: 'countdown-section',
            props: {
              width: '100%',
              maxWidth: '1200px',
              margin: '0 auto'
            },
            components: [
              {
                id: 'main-countdown',
                type: 'countdownTimer',
                props: {
                  eventDate: '{{startDate}}',
                  eventEndDate: '{{endDate}}',
                  showEventInfo: true,
                  eventLocation: '{{venue}}',
                  bgColor: '#1f2937',
                  borderRadius: '12',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  titleColor: '#ffffff',
                  subtitleColor: '#9ca3af',
                  countdownValueColor: '#ffffff',
                  countdownBgColor: '#374151',
                  labelColor: '#9ca3af',
                  buttonBgColor: '#0df5e3',
                  buttonHoverBgColor: '#0ac9bb',
                  buttonTextColor: '#111827'
                }
              }
            ]
          },

          {
            type: 'container',
            id: 'schedule-section',
            props: {
              width: '100%',
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '48px 0'
            },
            components: [
              {
                type: 'text',
                id: 'schedule-heading',
                props: {
                  content: 'Event Schedule',
                  fontSize: '3xl',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  marginBottom: '32',
                  textAlign: 'center'
                }
              },
              {
                id: 'schedule-agenda',
                type: 'scheduleAgenda',
                props: {
                  title: '',
                  titleColor: '#ffffff',
                  descriptionColor: '#9ca3af',
                  bgColor: '#1f2937',
                  borderColor: '#374151',
                  tabColor: '#9ca3af',
                  tabActiveColor: '#0df5e3',
                  tabActiveBgColor: '#374151',
                  cardBgColor: '#374151',
                  timeColor: '#ffffff',
                  sessionTitleColor: '#ffffff',
                  speakerColor: '#9ca3af',
                  schedule: '{{schedule}}'
                }
              }
            ]
          },

          {
            type: 'container',
            id: 'tickets-section',
            props: {
              width: '100%',
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '48px 0'
            },
            components: [
              {
                type: 'text',
                id: 'tickets-heading',
                props: {
                  content: 'Get Your Tickets',
                  fontSize: '3xl',
                  fontWeight: 'bold',
                  color: '#ffffff',
                  marginBottom: '32',
                  textAlign: 'center'
                }
              },
              {
                id: 'ticket-sales',
                type: 'ticketSalesWidget',
                props: {
                  title: '',
                  titleColor: '#ffffff',
                  descriptionColor: '#9ca3af',
                  bgColor: '#1f2937',
                  cardBorderColor: '#374151',
                  cardHeaderBgColor: '#374151',
                  cardTitleColor: '#ffffff',
                  cardPriceColor: '#0df5e3',
                  detailsTextColor: '#9ca3af',
                  buttonBgColor: '#0df5e3',
                  buttonHoverBgColor: '#0ac9bb',
                  buttonTextColor: '#111827',
                  tickets: '{{ticketTypes}}'
                }
              }
            ]
          },
  
          // Footer Section
          {
            type: 'container',
            id: 'footer-section',
            props: {
              width: '100%',
              padding: '32px 0',
              bgColor: '#1f2937',
              marginTop: '32'
            },
            components: [
              {
                type: 'text',
                id: 'footer-text',
                props: {
                  content: '© {{currentYear}} {{title}} | Organized by {{organizerName}} | Contact: {{contactEmail}}',
                  fontSize: 'sm',
                  fontWeight: 'normal',
                  color: '#9ca3af',
                  textAlign: 'center'
                }
              }
            ]
          }
        ]
      }
    ]
  };