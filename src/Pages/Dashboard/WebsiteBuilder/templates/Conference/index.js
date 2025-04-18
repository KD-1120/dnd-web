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
          alignItems: 'center',
          position: 'sticky',
          top: '0',
          zIndex: '100'
        },
        components: [
          {
            id: 'nav-logo-container',
            type: 'container',
            props: {
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            },
            components: [
              {
                id: 'nav-logo-icon',
                type: 'image',
                props: {
                  src: '/api/placeholder/40/40',
                  alt: 'Conference Logo',
                  width: '40',
                  height: '40'
                }
              },
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
              }
            ]
          },
          {
            id: 'nav-links',
            type: 'container',
            props: {
              display: 'flex',
              gap: '24px',
              alignItems: 'center'
            },
            components: [
              {
                id: 'nav-link-1',
                type: 'text',
                props: {
                  text: 'Speakers',
                  fontSize: '16',
                  fontWeight: '500',
                  color: '#4a5568',
                  cursor: 'pointer'
                }
              },
              {
                id: 'nav-link-2',
                type: 'text',
                props: {
                  text: 'Schedule',
                  fontSize: '16',
                  fontWeight: '500',
                  color: '#4a5568',
                  cursor: 'pointer'
                }
              },
              {
                id: 'nav-link-3',
                type: 'text',
                props: {
                  text: 'Venue',
                  fontSize: '16',
                  fontWeight: '500',
                  color: '#4a5568',
                  cursor: 'pointer'
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
                  fontWeight: '600',
                  hoverBgColor: '#2c5282',
                  transition: 'all 0.3s ease'
                }
              }
            ]
          }
        ]
      },
      {
        type: 'container',
        id: 'hero-section',
        props: {
          bgImage: '/api/placeholder/1440/600',
          bgSize: 'cover',
          bgPosition: 'center',
          bgOverlay: 'rgba(0,0,0,0.5)',
          paddingTop: '120',
          paddingBottom: '120',
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
            type: 'container',
            props: {
              bgColor: 'rgba(255,255,255,0.15)',
              padding: '8px 16px',
              borderRadius: '20px',
              marginBottom: '24'
            },
            components: [
              {
                id: 'hero-badge-text',
                type: 'text',
                props: {
                  text: 'JUNE 15-17, 2025 • SAN FRANCISCO',
                  fontSize: '14',
                  fontWeight: '600',
                  color: '#ffffff',
                  letterSpacing: '1px'
                }
              }
            ]
          },
          {
            id: 'hero-title',
            type: 'title',
            props: {
              text: 'The Future of Technology Conference',
              fontSize: '52',
              fontWeight: '800',
              color: '#ffffff',
              alignment: 'center',
              maxWidth: '800px',
              marginBottom: '16',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }
          },
          {
            id: 'hero-subtitle',
            type: 'text',
            props: {
              text: 'Join industry leaders and innovators for three days of cutting-edge insights, networking, and inspiration.',
              fontSize: '22',
              fontWeight: '400',
              color: '#e2e8f0',
              alignment: 'center',
              maxWidth: '700px',
              marginBottom: '40',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)'
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
                  padding: '16px 32px',
                  fontSize: '18',
                  fontWeight: '600',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  hoverBgColor: '#2c5282',
                  hoverTransform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                }
              },
              {
                id: 'hero-button-2',
                type: 'button',
                props: {
                  label: 'View Schedule',
                  bgColor: 'transparent',
                  color: '#ffffff',
                  borderWidth: '2',
                  borderColor: '#ffffff',
                  borderRadius: '4',
                  padding: '16px 32px',
                  fontSize: '18',
                  fontWeight: '600',
                  hoverBgColor: 'rgba(255,255,255,0.1)',
                  transition: 'all 0.3s ease'
                }
              }
            ]
          },
          {
            id: 'hero-countdown',
            type: 'container',
            props: {
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              marginTop: '48'
            },
            components: [
              {
                id: 'countdown-days',
                type: 'container',
                props: {
                  bgColor: 'rgba(255,255,255,0.1)',
                  padding: '16px',
                  borderRadius: '8px',
                  minWidth: '80px',
                  textAlign: 'center'
                },
                components: [
                  {
                    id: 'days-number',
                    type: 'text',
                    props: {
                      text: '58',
                      fontSize: '28',
                      fontWeight: '700',
                      color: '#ffffff'
                    }
                  },
                  {
                    id: 'days-label',
                    type: 'text',
                    props: {
                      text: 'Days',
                      fontSize: '14',
                      color: '#e2e8f0'
                    }
                  }
                ]
              },
              {
                id: 'countdown-hours',
                type: 'container',
                props: {
                  bgColor: 'rgba(255,255,255,0.1)',
                  padding: '16px',
                  borderRadius: '8px',
                  minWidth: '80px',
                  textAlign: 'center'
                },
                components: [
                  {
                    id: 'hours-number',
                    type: 'text',
                    props: {
                      text: '14',
                      fontSize: '28',
                      fontWeight: '700',
                      color: '#ffffff'
                    }
                  },
                  {
                    id: 'hours-label',
                    type: 'text',
                    props: {
                      text: 'Hours',
                      fontSize: '14',
                      color: '#e2e8f0'
                    }
                  }
                ]
              },
              {
                id: 'countdown-minutes',
                type: 'container',
                props: {
                  bgColor: 'rgba(255,255,255,0.1)',
                  padding: '16px',
                  borderRadius: '8px',
                  minWidth: '80px',
                  textAlign: 'center'
                },
                components: [
                  {
                    id: 'minutes-number',
                    type: 'text',
                    props: {
                      text: '36',
                      fontSize: '28',
                      fontWeight: '700',
                      color: '#ffffff'
                    }
                  },
                  {
                    id: 'minutes-label',
                    type: 'text',
                    props: {
                      text: 'Minutes',
                      fontSize: '14',
                      color: '#e2e8f0'
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
        id: 'stats-section',
        props: {
          bgColor: '#ffffff',
          paddingTop: '48',
          paddingBottom: '48',
          paddingLeft: '24',
          paddingRight: '24',
          boxShadow: '0 -4px 6px rgba(0,0,0,0.05)',
          zIndex: '10'
        },
        components: [
          {
            id: 'stats-container',
            type: 'container',
            props: {
              display: 'flex',
              justifyContent: 'space-around',
              flexWrap: 'wrap',
              gap: '24px',
              maxWidth: '1200px',
              marginLeft: 'auto',
              marginRight: 'auto'
            },
            components: [
              {
                id: 'stat-1',
                type: 'container',
                props: {
                  textAlign: 'center'
                },
                components: [
                  {
                    id: 'stat-1-number',
                    type: 'text',
                    props: {
                      text: '50+',
                      fontSize: '36',
                      fontWeight: '800',
                      color: '#3182ce'
                    }
                  },
                  {
                    id: 'stat-1-label',
                    type: 'text',
                    props: {
                      text: 'Expert Speakers',
                      fontSize: '16',
                      fontWeight: '500',
                      color: '#4a5568'
                    }
                  }
                ]
              },
              {
                id: 'stat-2',
                type: 'container',
                props: {
                  textAlign: 'center'
                },
                components: [
                  {
                    id: 'stat-2-number',
                    type: 'text',
                    props: {
                      text: '2,000+',
                      fontSize: '36',
                      fontWeight: '800',
                      color: '#3182ce'
                    }
                  },
                  {
                    id: 'stat-2-label',
                    type: 'text',
                    props: {
                      text: 'Attendees',
                      fontSize: '16',
                      fontWeight: '500',
                      color: '#4a5568'
                    }
                  }
                ]
              },
              {
                id: 'stat-3',
                type: 'container',
                props: {
                  textAlign: 'center'
                },
                components: [
                  {
                    id: 'stat-3-number',
                    type: 'text',
                    props: {
                      text: '20+',
                      fontSize: '36',
                      fontWeight: '800',
                      color: '#3182ce'
                    }
                  },
                  {
                    id: 'stat-3-label',
                    type: 'text',
                    props: {
                      text: 'Workshops',
                      fontSize: '16',
                      fontWeight: '500',
                      color: '#4a5568'
                    }
                  }
                ]
              },
              {
                id: 'stat-4',
                type: 'container',
                props: {
                  textAlign: 'center'
                },
                components: [
                  {
                    id: 'stat-4-number',
                    type: 'text',
                    props: {
                      text: '3',
                      fontSize: '36',
                      fontWeight: '800',
                      color: '#3182ce'
                    }
                  },
                  {
                    id: 'stat-4-label',
                    type: 'text',
                    props: {
                      text: 'Days',
                      fontSize: '16',
                      fontWeight: '500',
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
        id: 'features-section',
        props: {
          bgColor: '#f7fafc',
          paddingTop: '80',
          paddingBottom: '80',
          paddingLeft: '24',
          paddingRight: '24',
          textAlign: 'center'
        },
        components: [
          {
            id: 'features-title-container',
            type: 'container',
            props: {
              maxWidth: '800px',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginBottom: '64'
            },
            components: [
              {
                id: 'features-badge',
                type: 'text',
                props: {
                  text: 'EXPERIENCE',
                  fontSize: '14',
                  fontWeight: '600',
                  color: '#3182ce',
                  letterSpacing: '1px',
                  marginBottom: '16'
                }
              },
              {
                id: 'features-title',
                type: 'title',
                props: {
                  text: 'Why Attend TechSummit 2025',
                  fontSize: '36',
                  fontWeight: '700',
                  color: '#1a202c',
                  alignment: 'center',
                  marginBottom: '16'
                }
              },
              {
                id: 'features-subtitle',
                type: 'text',
                props: {
                  text: 'An unparalleled opportunity to learn, connect, and grow with the tech community.',
                  fontSize: '18',
                  color: '#4a5568',
                  alignment: 'center'
                }
              }
            ]
          },
          {
            id: 'features-container',
            type: 'container',
            props: {
              display: 'flex',
              justifyContent: 'space-between',
              gap: '24px',
              flexWrap: 'wrap',
              maxWidth: '1200px',
              marginLeft: 'auto',
              marginRight: 'auto'
            },
            components: [
              {
                id: 'feature-1',
                type: 'container',
                props: {
                  padding: '32px',
                  textAlign: 'center',
                  bgColor: '#ffffff',
                  borderRadius: '8',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                  flexBasis: '30%',
                  minWidth: '280px',
                  flexGrow: '1',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  hoverTransform: 'translateY(-8px)',
                  hoverBoxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                },
                components: [
                  {
                    id: 'feature-1-icon',
                    type: 'image',
                    props: {
                      src: '/api/placeholder/64/64',
                      alt: 'Speakers Icon',
                      width: '64',
                      height: '64',
                      marginBottom: '16'
                    }
                  },
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
                      text: 'Learn from the best minds in technology, including CTOs, founders, and pioneering researchers sharing insights on the latest innovations.',
                      fontSize: '16',
                      color: '#4a5568',
                      lineHeight: '1.6'
                    }
                  }
                ]
              },
              {
                id: 'feature-2',
                type: 'container',
                props: {
                  padding: '32px',
                  textAlign: 'center',
                  bgColor: '#ffffff',
                  borderRadius: '8',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                  flexBasis: '30%',
                  minWidth: '280px',
                  flexGrow: '1',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  hoverTransform: 'translateY(-8px)',
                  hoverBoxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                },
                components: [
                  {
                    id: 'feature-2-icon',
                    type: 'image',
                    props: {
                      src: '/api/placeholder/64/64',
                      alt: 'Workshops Icon',
                      width: '64',
                      height: '64',
                      marginBottom: '16'
                    }
                  },
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
                      text: 'Get hands-on experience with cutting-edge technologies in our interactive workshops led by industry experts and technology creators.',
                      fontSize: '16',
                      color: '#4a5568',
                      lineHeight: '1.6'
                    }
                  }
                ]
              },
              {
                id: 'feature-3',
                type: 'container',
                props: {
                  padding: '32px',
                  textAlign: 'center',
                  bgColor: '#ffffff',
                  borderRadius: '8',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                  flexBasis: '30%',
                  minWidth: '280px',
                  flexGrow: '1',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  hoverTransform: 'translateY(-8px)',
                  hoverBoxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                },
                components: [
                  {
                    id: 'feature-3-icon',
                    type: 'image',
                    props: {
                      src: '/api/placeholder/64/64',
                      alt: 'Networking Icon',
                      width: '64',
                      height: '64',
                      marginBottom: '16'
                    }
                  },
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
                      text: 'Connect with 2,000+ attendees, including industry leaders, investors, and potential partners in dedicated networking sessions and social events.',
                      fontSize: '16',
                      color: '#4a5568',
                      lineHeight: '1.6'
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
        id: 'speakers-section',
        props: {
          bgColor: '#ffffff',
          paddingTop: '80',
          paddingBottom: '80',
          paddingLeft: '24',
          paddingRight: '24'
        },
        components: [
          {
            id: 'speakers-title-container',
            type: 'container',
            props: {
              maxWidth: '800px',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginBottom: '64',
              textAlign: 'center'
            },
            components: [
              {
                id: 'speakers-badge',
                type: 'text',
                props: {
                  text: 'KEYNOTE SPEAKERS',
                  fontSize: '14',
                  fontWeight: '600',
                  color: '#3182ce',
                  letterSpacing: '1px',
                  marginBottom: '16'
                }
              },
              {
                id: 'speakers-title',
                type: 'title',
                props: {
                  text: 'Learn from Industry Leaders',
                  fontSize: '36',
                  fontWeight: '700',
                  color: '#1a202c',
                  alignment: 'center',
                  marginBottom: '16'
                }
              },
              {
                id: 'speakers-subtitle',
                type: 'text',
                props: {
                  text: 'Our carefully selected speakers are at the forefront of technological innovation.',
                  fontSize: '18',
                  color: '#4a5568',
                  alignment: 'center'
                }
              }
            ]
          },
          {
            id: 'speakers-container',
            type: 'container',
            props: {
              display: 'flex',
              justifyContent: 'center',
              gap: '32px',
              flexWrap: 'wrap',
              maxWidth: '1200px',
              marginLeft: 'auto',
              marginRight: 'auto'
            },
            components: [
              {
                id: 'speaker-1',
                type: 'container',
                props: {
                  width: '280px',
                  textAlign: 'center'
                },
                components: [
                  {
                    id: 'speaker-1-image',
                    type: 'image',
                    props: {
                      src: '/api/placeholder/200/200',
                      alt: 'Speaker 1',
                      width: '200',
                      height: '200',
                      borderRadius: '100%',
                      marginBottom: '16',
                      objectFit: 'cover'
                    }
                  },
                  {
                    id: 'speaker-1-name',
                    type: 'title',
                    props: {
                      text: 'Dr. Sarah Chen',
                      fontSize: '20',
                      fontWeight: '700',
                      color: '#2d3748',
                      marginBottom: '4'
                    }
                  },
                  {
                    id: 'speaker-1-title',
                    type: 'text',
                    props: {
                      text: 'CTO, FutureTech Inc.',
                      fontSize: '16',
                      color: '#3182ce',
                      fontWeight: '500',
                      marginBottom: '8'
                    }
                  },
                  {
                    id: 'speaker-1-bio',
                    type: 'text',
                    props: {
                      text: 'Leading expert in AI and machine learning with over 15 years of experience.',
                      fontSize: '14',
                      color: '#4a5568'
                    }
                  }
                ]
              },
              {
                id: 'speaker-2',
                type: 'container',
                props: {
                  width: '280px',
                  textAlign: 'center'
                },
                components: [
                  {
                    id: 'speaker-2-image',
                    type: 'image',
                    props: {
                      src: '/api/placeholder/200/200',
                      alt: 'Speaker 2',
                      width: '200',
                      height: '200',
                      borderRadius: '100%',
                      marginBottom: '16',
                      objectFit: 'cover'
                    }
                  },
                  {
                    id: 'speaker-2-name',
                    type: 'title',
                    props: {
                      text: 'James Wilson',
                      fontSize: '20',
                      fontWeight: '700',
                      color: '#2d3748',
                      marginBottom: '4'
                    }
                  },
                  {
                    id: 'speaker-2-title',
                    type: 'text',
                    props: {
                      text: 'Founder & CEO, NextGen Systems',
                      fontSize: '16',
                      color: '#3182ce',
                      fontWeight: '500',
                      marginBottom: '8'
                    }
                  },
                  {
                    id: 'speaker-2-bio',
                    type: 'text',
                    props: {
                      text: 'Serial entrepreneur with multiple successful tech startups and exits.',
                      fontSize: '14',
                      color: '#4a5568'
                    }
                  }
                ]
              },
              {
                id: 'speaker-3',
                type: 'container',
                props: {
                  width: '280px',
                  textAlign: 'center'
                },
                components: [
                  {
                    id: 'speaker-3-image',
                    type: 'image',
                    props: {
                      src: '/api/placeholder/200/200',
                      alt: 'Speaker 3',
                      width: '200',
                      height: '200',
                      borderRadius: '100%',
                      marginBottom: '16',
                      objectFit: 'cover'
                    }
                  },
                  {
                    id: 'speaker-3-name',
                    type: 'title',
                    props: {
                      text: 'Maria Rodriguez',
                      fontSize: '20',
                      fontWeight: '700',
                      color: '#2d3748',
                      marginBottom: '4'
                    }
                  },
                  {
                    id: 'speaker-3-title',
                    type: 'text',
                    props: {
                      text: 'Director of Research, Global Tech',
                      fontSize: '16',
                      color: '#3182ce',
                      fontWeight: '500',
                      marginBottom: '8'
                    }
                  },
                  {
                    id: 'speaker-3-bio',
                    type: 'text',
                    props: {
                      text: 'Pioneer in quantum computing and emerging technologies research.',
                      fontSize: '14',
                      color: '#4a5568'
                    }
                  }
                ]
              }
            ]
          },
          {
            id: 'speakers-button-container',
            type: 'container',
            props: {
              marginTop: '48',
              textAlign: 'center'
            },
            components: [
              {
                id: 'speakers-button',
                type: 'button',
                props: {
                  label: 'View All Speakers',
                  bgColor: 'transparent',
                  color: '#3182ce',
                  borderWidth: '1',
                  borderColor: '#3182ce',
                  borderRadius: '4',
                  padding: '12px 24px',
                  fontSize: '16',
                  fontWeight: '600',
                  hoverBgColor: '#ebf8ff',
                  transition: 'all 0.3s ease'
                }
              }
            ]
          }
        ]
      },
      {
        type: 'container',
        id: 'schedule-preview-section',
        props: {
          bgColor: '#f7fafc',
          paddingTop: '80',
          paddingBottom: '80',
          paddingLeft: '24',
          paddingRight: '24'
        },
        components: [
          {
            id: 'schedule-title-container',
            type: 'container',
            props: {
              maxWidth: '800px',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginBottom: '48',
              textAlign: 'center'
            },
            components: [
              {
                id: 'schedule-badge',
                type: 'text',
                props: {
                  text: 'AGENDA',
                  fontSize: '14',
                  fontWeight: '600',
                  color: '#3182ce',
                  letterSpacing: '1px',
                  marginBottom: '16'
                }
              },
              {
                id: 'schedule-title',
                type: 'title',
                props: {
                  text: 'Explore the Schedule',
                  fontSize: '36',
                  fontWeight: '700',
                  color: '#1a202c',
                  alignment: 'center',
                  marginBottom: '16'
                }
              },
              {
                id: 'schedule-subtitle',
                type: 'text',
                props: {
                  text: 'Dive into our diverse range of sessions, workshops, and networking opportunities.',
                  fontSize: '18',
                  color: '#4a5568',
                  alignment: 'center'
                }
              }
            ]
          },
          {
            id: 'schedule-preview-container',
            type: 'container',
            props: {
              display: 'flex',
              justifyContent: 'center',
              gap: '32px',
              flexWrap: 'wrap',
              maxWidth: '1200px',
              marginLeft: 'auto',
              marginRight: 'auto'
            },
            components: [
              {
                id: 'schedule-preview-1',
                type: 'container',
                props: {
                  width: '280px',
                  textAlign: 'center'
                },
                components: [
                  {
                    id: 'schedule-preview-1-image',
                    type: 'image',
                    props: {
                      src: '/api/placeholder/200/200',
                      alt: 'Session 1',
                      width: '200',
                      height: '200',
                      borderRadius: '8px',
                      marginBottom: '16',
                      objectFit: 'cover'
                    }
                  },
                  {
                    id: 'schedule-preview-1-title',
                    type: 'title',
                    props: {
                      text: 'Keynote Address by Dr. Sarah Chen',
                      fontSize: '20',
                      fontWeight: '700',
                      color: '#2d3748',
                      marginBottom: '4'
                    }
                  },
                  {
                    id: 'schedule-preview-1-time',
                    type: 'text',
                    props: {
                      text: 'June 15, 2025 | 10 AM - 11 AM | Main Hall A',
                      fontSize: '16',
                      color: '#3182ce',
                      fontWeight: '500'
                    }
                  }
                ]
              },
              {
                id: 'schedule-preview-2',
                type: 'container',
                props: {
                  width: '280px',
                  textAlign: 'center'
                },
                components: [
                  {
                    id: 'schedule-preview-2-image',
                    type: 'image',
                    props: {
                      src: '/api/placeholder/200/200',
                      alt: 'Session 2',
                      width: '200',
                      height: '200',
                      borderRadius: '8px',
                      marginBottom: '16',
                      objectFit: 'cover'
                    }
                  },
                  {
                    id: 'schedule-preview-2-title',
                    type: 'title',
                    props: {
                      text: "Workshop on AI Ethics",
                      fontSize: "20",
                      fontWeight: "700",
                      color: "#2d3748",
                      marginBottom: "4"
                    }
                  },
                  {
                    id: 'schedule-preview-2-time',
                    type: 'text',
                    props: {
                      text: 'June 15, 2025 | 1 PM - 3 PM | Room 202',
                      fontSize: '16',
                      color: '#3182ce',
                      fontWeight: '500'
                    }
                  }
                ]
              },
              {
                id: 'schedule-preview-3',
                type: 'container',
                props: {
                  width: '280px',
                  textAlign: 'center'
                },
                components: [
                  {
                    id: 'schedule-preview-3-image',
                    type: 'image',
                    props: {
                      src: '/api/placeholder/200/200',
                      alt: 'Session 3',
                      width: '200',
                      height: '200',
                      borderRadius: '8px',
                      marginBottom: '16',
                      objectFit: 'cover'
                    }
                  },
                  {
                    id: 'schedule-preview-3-title',
                    type: 'title',
                    props: {
                      text: "Panel Discussion on Future of Tech",
                      fontSize: "20",
                      fontWeight: "700",
                      color: "#2d3748",
                      marginBottom: "4"
                    }
                  },
                  {
                    id: 'schedule-preview-3-time',
                    type: 'text',
                    props: {
                      text: 'June 15, 2025 | 4 PM - 5 PM | Main Hall B',
                      fontSize: '16',
                      color: '#3182ce',
                      fontWeight: '500'
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
  ]
}