export const conferenceTemplate = {
    id: 'conference',
    name: 'Professional Conference',
    description: 'Perfect for tech conferences, summits, and professional gatherings',
    thumbnail: '/api/placeholder/400/250',
    category: 'Conferences',
    data: [
        {
          type: 'container',
          id: 'nav-container',
          props: {
            bgColor: '#ffffff',
            paddingTop: '16',
            paddingBottom: '16',
            paddingLeft: '24',
            paddingRight: '24',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          },
          components: [
            {
              id: 'nav-logo',
              type: 'title',
              props: {
                text: 'TechSummit 2025',
                fontSize: '24',
                fontWeight: '700',
                color: '#3182ce',
                marginBottom: '0'
              }
            },
            {
              id: 'nav-button',
              type: 'button',
              props: {
                label: 'Register Now',
                bgColor: '#3182ce',
                color: '#ffffff',
                borderRadius: '4',
                fontWeight: '600'
              }
            }
          ]
        },
        {
          type: 'container',
          id: 'hero-section',
          props: {
            bgColor: '#f7fafc',
            paddingTop: '100',
            paddingBottom: '100',
            paddingLeft: '24',
            paddingRight: '24',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          },
          components: [
            {
              id: 'hero-badge',
              type: 'text',
              props: {
                text: 'JUNE 15-17, 2025 • SAN FRANCISCO',
                fontSize: '14',
                fontWeight: '600',
                color: '#3182ce',
                letterSpacing: '1px',
                marginBottom: '16'
              }
            },
            {
              id: 'hero-title',
              type: 'title',
              props: {
                text: 'The Future of Technology Conference',
                fontSize: '48',
                fontWeight: '800',
                color: '#1a202c',
                alignment: 'center',
                maxWidth: '800px'
              }
            },
            {
              id: 'hero-subtitle',
              type: 'text',
              props: {
                text: 'Join industry leaders and innovators for three days of cutting-edge insights, networking, and inspiration.',
                fontSize: '20',
                fontWeight: '400',
                color: '#4a5568',
                alignment: 'center',
                maxWidth: '600px',
                marginBottom: '32'
              }
            },
            {
              id: 'hero-buttons',
              type: 'container',
              props: {
                display: 'flex',
                gap: '16px',
                justifyContent: 'center'
              },
              components: [
                {
                  id: 'hero-button-1',
                  type: 'button',
                  props: {
                    label: 'Register Now',
                    bgColor: '#3182ce',
                    color: '#ffffff',
                    borderRadius: '4',
                    padding: '12px 24px',
                    fontSize: '16',
                    fontWeight: '600'
                  }
                },
                {
                  id: 'hero-button-2',
                  type: 'button',
                  props: {
                    label: 'View Schedule',
                    bgColor: 'transparent',
                    color: '#3182ce',
                    borderWidth: '1',
                    borderColor: '#3182ce',
                    borderRadius: '4',
                    padding: '12px 24px',
                    fontSize: '16',
                    fontWeight: '600'
                  }
                }
              ]
            }
          ]
        },
        {
          type: 'container',
          id: 'features-section',
          props: {
            bgColor: '#ffffff',
            paddingTop: '80',
            paddingBottom: '80',
            paddingLeft: '24',
            paddingRight: '24',
            textAlign: 'center'
          },
          components: [
            {
              id: 'features-title',
              type: 'title',
              props: {
                text: 'Why Attend TechSummit 2025',
                fontSize: '36',
                fontWeight: '700',
                color: '#1a202c',
                alignment: 'center',
                marginBottom: '48'
              }
            },
            {
              id: 'features-container',
              type: 'container',
              props: {
                display: 'flex',
                justifyContent: 'space-between',
                gap: '24px',
                maxWidth: '1200px',
                marginLeft: 'auto',
                marginRight: 'auto'
              },
              components: [
                {
                  id: 'feature-1',
                  type: 'container',
                  props: {
                    padding: '24px',
                    textAlign: 'center',
                    bgColor: '#f7fafc',
                    borderRadius: '8',
                    width: '30%'
                  },
                  components: [
                    {
                      id: 'feature-1-title',
                      type: 'title',
                      props: {
                        text: '50+ Speakers',
                        fontSize: '24',
                        fontWeight: '700',
                        color: '#2d3748',
                        marginBottom: '16'
                      }
                    },
                    {
                      id: 'feature-1-text',
                      type: 'text',
                      props: {
                        text: 'Learn from the best minds in technology, including CTOs, founders, and researchers.',
                        fontSize: '16',
                        color: '#4a5568'
                      }
                    }
                  ]
                },
                {
                  id: 'feature-2',
                  type: 'container',
                  props: {
                    padding: '24px',
                    textAlign: 'center',
                    bgColor: '#f7fafc',
                    borderRadius: '8',
                    width: '30%'
                  },
                  components: [
                    {
                      id: 'feature-2-title',
                      type: 'title',
                      props: {
                        text: '20+ Workshops',
                        fontSize: '24',
                        fontWeight: '700',
                        color: '#2d3748',
                        marginBottom: '16'
                      }
                    },
                    {
                      id: 'feature-2-text',
                      type: 'text',
                      props: {
                        text: 'Get hands-on experience with new technologies in our interactive workshops.',
                        fontSize: '16',
                        color: '#4a5568'
                      }
                    }
                  ]
                },
                {
                  id: 'feature-3',
                  type: 'container',
                  props: {
                    padding: '24px',
                    textAlign: 'center',
                    bgColor: '#f7fafc',
                    borderRadius: '8',
                    width: '30%'
                  },
                  components: [
                    {
                      id: 'feature-3-title',
                      type: 'title',
                      props: {
                        text: 'Networking',
                        fontSize: '24',
                        fontWeight: '700',
                        color: '#2d3748',
                        marginBottom: '16'
                      }
                    },
                    {
                      id: 'feature-3-text',
                      type: 'text',
                      props: {
                        text: 'Connect with 2,000+ attendees, including industry leaders and potential partners.',
                        fontSize: '16',
                        color: '#4a5568'
                      }
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          type: 'container',
          id: 'cta-section',
          props: {
            bgColor: '#3182ce',
            paddingTop: '80',
            paddingBottom: '80',
            paddingLeft: '24',
            paddingRight: '24',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          },
          components: [
            {
              id: 'cta-title',
              type: 'title',
              props: {
                text: 'Ready to join us at TechSummit 2025?',
                fontSize: '36',
                fontWeight: '700',
                color: '#ffffff',
                alignment: 'center',
                marginBottom: '24'
              }
            },
            {
              id: 'cta-text',
              type: 'text',
              props: {
                text: 'Early bird tickets are available until March 15. Don\'t miss out!',
                fontSize: '18',
                color: '#e2e8f0',
                alignment: 'center',
                marginBottom: '32'
              }
            },
            {
              id: 'cta-button',
              type: 'button',
              props: {
                label: 'Register Now',
                bgColor: '#ffffff',
                color: '#3182ce',
                borderRadius: '4',
                padding: '16px 32px',
                fontSize: '18',
                fontWeight: '600',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }
            }
          ]
        },
        {
          type: 'container',
          id: 'footer-section',
          props: {
            bgColor: '#2d3748',
            paddingTop: '48',
            paddingBottom: '48',
            paddingLeft: '24',
            paddingRight: '24',
            textAlign: 'center'
          },
          components: [
            {
              id: 'footer-text',
              type: 'text',
              props: {
                text: '© 2025 TechSummit Conference. All rights reserved.',
                fontSize: '14',
                color: '#a0aec0',
                alignment: 'center'
              }
            }
          ]
        }
      ]
  };