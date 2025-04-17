// src/Pages/Dashboard/WebsiteBuilder/templates/Event/index.js
export const eventTemplate = {
    id: 'event',
    name: 'Complete Event',
    description: 'Comprehensive event template with all event features including schedule, speakers, ticket sales, and more',
    thumbnail: '/api/placeholder/400/250',
    category: 'Events',
    data: [
      // Hero Section with Countdown
      {
        type: 'container',
        id: 'hero-container',
        props: {
          bgColor: '#111827',
          bgImage: '/api/placeholder/1920/1080',
          paddingTop: '120',
          paddingBottom: '120',
          paddingLeft: '24',
          paddingRight: '24',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        },
        components: [
          {
            id: 'hero-badge',
            type: 'text',
            props: {
              text: 'SEPTEMBER 15-17, 2025',
              fontSize: '18',
              fontWeight: '600',
              color: '#F59E0B',
              letterSpacing: '1px',
              marginBottom: '16'
            }
          },
          {
            id: 'hero-title',
            type: 'title',
            props: {
              text: 'HORIZON TECH SUMMIT 2025',
              fontSize: '56',
              fontWeight: '800',
              color: '#ffffff',
              alignment: 'center',
              maxWidth: '800px',
              letterSpacing: '1px',
              marginBottom: '24'
            }
          },
          {
            id: 'hero-subtitle',
            type: 'text',
            props: {
              text: 'Join industry leaders and innovators for three days of cutting-edge insights, networking, and inspiration.',
              fontSize: '20',
              fontWeight: '400',
              color: '#D1D5DB',
              alignment: 'center',
              maxWidth: '600px',
              marginBottom: '40'
            }
          },
          {
            id: 'hero-countdown',
            type: 'countdownTimer',
            props: {
              eventDate: '2025-09-15T09:00:00',
              eventEndDate: '2025-09-17T18:00:00',
              title: 'Event Starts In',
              subtitle: 'Secure your tickets before they are gone!',
              bgColor: 'rgba(0,0,0,0.5)',
              borderRadius: '12',
              padding: '32px',
              boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)',
              showEventInfo: true,
              eventLocation: 'San Francisco Convention Center',
              titleColor: '#ffffff',
              subtitleColor: '#D1D5DB',
              countdownValueColor: '#ffffff',
              countdownBgColor: 'rgba(17, 24, 39, 0.7)',
              countdownBoxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
              countdownBorderRadius: '12',
              labelColor: '#D1D5DB',
              countdownFontSize: '48px',
              countdownFontWeight: '700',
              countdownItemSize: '100px',
              actionButtonText: 'Get Your Tickets Now',
              actionButtonUrl: '#tickets-section',
              buttonBgColor: '#F59E0B',
              buttonHoverBgColor: '#D97706'
            }
          },
          {
            id: 'hero-social',
            type: 'socialMediaSharing',
            props: {
              direction: 'row',
              alignment: 'center',
              marginTop: '40',
              shape: 'circle',
              size: '48px',
              networks: ['facebook', 'twitter', 'linkedin'],
              showTitle: true,
              title: 'Share Event:',
              textColor: '#ffffff',
              iconColor: '#ffffff',
              facebookBgColor: '#3b5998',
              twitterBgColor: '#1da1f2',
              linkedinBgColor: '#0077b5'
            }
          }
        ]
      },
      
      // About Section
      {
        type: 'container',
        id: 'about-section',
        props: {
          bgColor: '#ffffff',
          paddingTop: '96',
          paddingBottom: '96',
          paddingLeft: '24',
          paddingRight: '24',
          maxWidth: '1200px',
          marginLeft: 'auto',
          marginRight: 'auto'
        },
        components: [
          {
            id: 'about-title',
            type: 'title',
            props: {
              text: 'About the Event',
              fontSize: '36',
              fontWeight: '700',
              color: '#111827',
              alignment: 'center',
              marginBottom: '16'
            }
          },
          {
            id: 'about-subtitle',
            type: 'text',
            props: {
              text: 'The premier gathering for technology professionals and innovators',
              fontSize: '18',
              fontWeight: '400',
              color: '#4B5563',
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
              marginRight: 'auto',
              flexDirection: 'row',
              flexWrap: 'wrap'
            },
            components: [
              {
                id: 'feature-1',
                type: 'container',
                props: {
                  padding: '24px',
                  textAlign: 'center',
                  bgColor: '#F9FAFB',
                  borderRadius: '8',
                  width: '30%',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                },
                components: [
                  {
                    id: 'feature-1-title',
                    type: 'title',
                    props: {
                      text: '50+ Speakers',
                      fontSize: '24',
                      fontWeight: '700',
                      color: '#111827',
                      marginBottom: '16'
                    }
                  },
                  {
                    id: 'feature-1-text',
                    type: 'text',
                    props: {
                      text: 'Learn from the best minds in technology, including CTOs, founders, and researchers.',
                      fontSize: '16',
                      color: '#4B5563'
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
                  bgColor: '#F9FAFB',
                  borderRadius: '8',
                  width: '30%',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                },
                components: [
                  {
                    id: 'feature-2-title',
                    type: 'title',
                    props: {
                      text: '20+ Workshops',
                      fontSize: '24',
                      fontWeight: '700',
                      color: '#111827',
                      marginBottom: '16'
                    }
                  },
                  {
                    id: 'feature-2-text',
                    type: 'text',
                    props: {
                      text: 'Get hands-on experience with new technologies in our interactive workshops.',
                      fontSize: '16',
                      color: '#4B5563'
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
                  bgColor: '#F9FAFB',
                  borderRadius: '8',
                  width: '30%',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                },
                components: [
                  {
                    id: 'feature-3-title',
                    type: 'title',
                    props: {
                      text: '3,000+ Attendees',
                      fontSize: '24',
                      fontWeight: '700',
                      color: '#111827',
                      marginBottom: '16'
                    }
                  },
                  {
                    id: 'feature-3-text',
                    type: 'text',
                    props: {
                      text: 'Connect with 3,000+ attendees, including industry leaders and potential partners.',
                      fontSize: '16',
                      color: '#4B5563'
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      
      // Schedule Section
      {
        type: 'container',
        id: 'schedule-section',
        props: {
          bgColor: '#F3F4F6',
          paddingTop: '96',
          paddingBottom: '96',
          paddingLeft: '24',
          paddingRight: '24'
        },
        components: [
          {
            id: 'schedule-title',
            type: 'title',
            props: {
              text: 'Event Schedule',
              fontSize: '36',
              fontWeight: '700',
              color: '#111827',
              alignment: 'center',
              marginBottom: '16'
            }
          },
          {
            id: 'schedule-subtitle',
            type: 'text',
            props: {
              text: 'Plan your experience with our comprehensive schedule',
              fontSize: '18',
              fontWeight: '400',
              color: '#4B5563',
              alignment: 'center',
              marginBottom: '48'
            }
          },
          {
            id: 'schedule-agenda',
            type: 'scheduleAgenda',
            props: {
              bgColor: '#ffffff',
              borderRadius: '12',
              boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
              maxWidth: '1200px',
              marginLeft: 'auto',
              marginRight: 'auto',
              schedule: [
                {
                  day: 'Day 1',
                  date: 'September 15, 2025',
                  sessions: [
                    {
                      id: 'day1-session1',
                      time: '09:00',
                      duration: '60 min',
                      title: 'Welcome Keynote',
                      location: 'Main Stage',
                      speakers: [
                        { name: 'Sarah Johnson', role: 'CEO, TechHorizon', avatar: '/api/placeholder/48/48' }
                      ],
                      description: 'Opening keynote to kick off Horizon Tech Summit 2025 with insights on emerging technology trends.'
                    },
                    {
                      id: 'day1-session2',
                      time: '10:30',
                      duration: '90 min',
                      title: 'AI in Enterprise: Real-world Applications',
                      location: 'Workshop Room A',
                      speakers: [
                        { name: 'Michael Chen', role: 'AI Director, Future Systems', avatar: '/api/placeholder/48/48' },
                        { name: 'Lisa Rodriguez', role: 'CTO, AI Solutions', avatar: '/api/placeholder/48/48' }
                      ],
                      description: 'Panel discussion on how AI is transforming enterprise operations across industries.'
                    },
                    {
                      id: 'day1-session3',
                      time: '13:00',
                      duration: '90 min',
                      title: 'Networking Lunch',
                      location: 'Grand Hall',
                      speakers: [],
                      description: 'Connect with fellow attendees, speakers, and sponsors during our catered networking lunch.'
                    }
                  ]
                },
                {
                  day: 'Day 2',
                  date: 'September 16, 2025',
                  sessions: [
                    {
                      id: 'day2-session1',
                      time: '09:30',
                      duration: '120 min',
                      title: 'Cybersecurity Masterclass',
                      location: 'Training Center',
                      speakers: [
                        { name: 'David Kim', role: 'Security Expert, SecureNet', avatar: '/api/placeholder/48/48' }
                      ],
                      description: 'Hands-on workshop covering the latest cybersecurity threats and mitigation strategies.'
                    },
                    {
                      id: 'day2-session2',
                      time: '12:00',
                      duration: '60 min',
                      title: 'Future of Cloud Computing',
                      location: 'Conference Room B',
                      speakers: [
                        { name: 'James Wilson', role: 'Cloud Architect, CloudScale', avatar: '/api/placeholder/48/48' }
                      ],
                      description: 'An in-depth look at emerging cloud technologies and how they will reshape IT infrastructure.'
                    }
                  ]
                },
                {
                  day: 'Day 3',
                  date: 'September 17, 2025',
                  sessions: [
                    {
                      id: 'day3-session1',
                      time: '10:00',
                      duration: '90 min',
                      title: 'Blockchain in Finance',
                      location: 'Innovation Lab',
                      speakers: [
                        { name: 'Emma Davis', role: 'Blockchain Lead, FinTech Innovations', avatar: '/api/placeholder/48/48' }
                      ],
                      description: 'Exploring how blockchain technology is revolutionizing financial systems and services.'
                    },
                    {
                      id: 'day3-session2',
                      time: '14:00',
                      duration: '60 min',
                      title: 'Closing Keynote & Awards',
                      location: 'Main Stage',
                      speakers: [
                        { name: 'Robert Taylor', role: 'CIO, Global Technologies', avatar: '/api/placeholder/48/48' }
                      ],
                      description: 'Summit wrap-up, key takeaways, and recognition of outstanding contributions in technology.'
                    }
                  ]
                }
              ],
              accentColor: '#F59E0B',
              cardBorderColor: '#E5E7EB',
              timeColor: '#111827',
              sessionTitleColor: '#111827',
              detailsBgColor: '#F9FAFB'
            }
          }
        ]
      },
      
      // Speakers Section
      {
        type: 'container',
        id: 'speakers-section',
        props: {
          bgColor: '#ffffff',
          paddingTop: '96',
          paddingBottom: '96',
          paddingLeft: '24',
          paddingRight: '24'
        },
        components: [
          {
            id: 'speakers-title',
            type: 'title',
            props: {
              text: 'Meet Our Speakers',
              fontSize: '36',
              fontWeight: '700',
              color: '#111827',
              alignment: 'center',
              marginBottom: '16'
            }
          },
          {
            id: 'speakers-subtitle',
            type: 'text',
            props: {
              text: 'Learn from industry leaders and technology experts',
              fontSize: '18',
              fontWeight: '400',
              color: '#4B5563',
              alignment: 'center',
              marginBottom: '48'
            }
          },
          {
            id: 'speakers-gallery',
            type: 'speakerGallery',
            props: {
              columnWidth: '280px',
              gap: '24px',
              maxWidth: '1200px',
              marginLeft: 'auto',
              marginRight: 'auto',
              speakers: [
                {
                  name: 'Sarah Johnson',
                  role: 'CEO',
                  company: 'TechHorizon',
                  bio: 'Sarah has over 20 years of experience in technology leadership and has led multiple successful startups.',
                  image: '/api/placeholder/300/300',
                  socialLinks: {
                    linkedin: 'https://linkedin.com/in/sarah-johnson',
                    twitter: 'https://twitter.com/sarahjohnson',
                    website: 'https://techhorizon.com'
                  }
                },
                {
                  name: 'Michael Chen',
                  role: 'AI Director',
                  company: 'Future Systems',
                  bio: 'Michael specializes in artificial intelligence and machine learning, with a focus on enterprise applications.',
                  image: '/api/placeholder/300/300',
                  socialLinks: {
                    linkedin: 'https://linkedin.com/in/michael-chen',
                    twitter: 'https://twitter.com/michaelchen'
                  }
                },
                {
                  name: 'Lisa Rodriguez',
                  role: 'CTO',
                  company: 'AI Solutions',
                  bio: 'Lisa leads technology strategy and innovation at AI Solutions, focusing on scalable AI platforms.',
                  image: '/api/placeholder/300/300',
                  socialLinks: {
                    linkedin: 'https://linkedin.com/in/lisa-rodriguez',
                    website: 'https://lisarodriguez.com'
                  }
                },
                {
                  name: 'David Kim',
                  role: 'Security Expert',
                  company: 'SecureNet',
                  bio: 'David is a cybersecurity expert with expertise in threat detection and security architecture.',
                  image: '/api/placeholder/300/300',
                  socialLinks: {
                    linkedin: 'https://linkedin.com/in/david-kim',
                    twitter: 'https://twitter.com/davidkim'
                  }
                },
                {
                  name: 'Emma Davis',
                  role: 'Blockchain Lead',
                  company: 'FinTech Innovations',
                  bio: 'Emma pioneered several blockchain implementations in the financial sector.',
                  image: '/api/placeholder/300/300',
                  socialLinks: {
                    linkedin: 'https://linkedin.com/in/emma-davis',
                    website: 'https://emmadavis.com'
                  }
                },
                {
                  name: 'James Wilson',
                  role: 'Cloud Architect',
                  company: 'CloudScale',
                  bio: 'James specializes in cloud infrastructure and has designed systems for Fortune 500 companies.',
                  image: '/api/placeholder/300/300',
                  socialLinks: {
                    linkedin: 'https://linkedin.com/in/james-wilson',
                    twitter: 'https://twitter.com/jameswilson'
                  }
                }
              ],
              border: '1px solid #E5E7EB',
              borderRadius: '8',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              nameColor: '#111827',
              roleColor: '#4B5563',
              companyColor: '#6B7280'
            }
          }
        ]
      },
      
      // Location Section
      {
        type: 'container',
        id: 'location-section',
        props: {
          bgColor: '#F3F4F6',
          paddingTop: '96',
          paddingBottom: '96',
          paddingLeft: '24',
          paddingRight: '24'
        },
        components: [
          {
            id: 'location-title',
            type: 'title',
            props: {
              text: 'Event Location',
              fontSize: '36',
              fontWeight: '700',
              color: '#111827',
              alignment: 'center',
              marginBottom: '16'
            }
          },
          {
            id: 'location-subtitle',
            type: 'text',
            props: {
              text: 'San Francisco Convention Center, 747 Howard St, San Francisco, CA 94103',
              fontSize: '18',
              fontWeight: '400',
              color: '#4B5563',
              alignment: 'center',
              marginBottom: '48'
            }
          },
          {
            id: 'location-map',
            type: 'googleMaps',
            props: {
              address: 'San Francisco Convention Center, 747 Howard St, San Francisco, CA 94103',
              height: '500px',
              borderRadius: '12',
              boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
              maxWidth: '1200px',
              marginLeft: 'auto',
              marginRight: 'auto',
              showLocationDetails: true,
              locationDetailsPosition: 'overlay',
              accentColor: '#F59E0B',
              locationName: 'San Francisco Convention Center',
              showDirectionsButton: true,
              buttonBgColor: '#F59E0B'
            }
          }
        ]
      },
      
      // Tickets Section
      {
        type: 'container',
        id: 'tickets-section',
        props: {
          bgColor: '#ffffff',
          paddingTop: '96',
          paddingBottom: '96',
          paddingLeft: '24',
          paddingRight: '24'
        },
        components: [
          {
            id: 'tickets-title',
            type: 'title',
            props: {
              text: 'Get Your Tickets',
              fontSize: '36',
              fontWeight: '700',
              color: '#111827',
              alignment: 'center',
              marginBottom: '16'
            }
          },
          {
            id: 'tickets-subtitle',
            type: 'text',
            props: {
              text: 'Secure your spot at Horizon Tech Summit 2025',
              fontSize: '18',
              fontWeight: '400',
              color: '#4B5563',
              alignment: 'center',
              marginBottom: '48'
            }
          },
          {
            id: 'tickets-widget',
            type: 'ticketSalesWidget',
            props: {
              title: 'Select Your Ticket Package',
              description: 'All tickets include full access to the venue, sessions, and workshops.',
              bgColor: '#ffffff',
              borderRadius: '12',
              boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
              padding: '32px',
              maxWidth: '800px',
              marginLeft: 'auto',
              marginRight: 'auto',
              titleColor: '#111827',
              descriptionColor: '#4B5563',
              accentColor: '#F59E0B',
              iconBgColor: '#FEF3C7',
              iconColor: '#F59E0B',
              cardBorderColor: '#E5E7EB',
              cardHeaderBgColor: '#ffffff',
              cardTitleColor: '#111827',
              cardPriceColor: '#4B5563',
              addButtonBgColor: '#F59E0B',
              addButtonHoverBgColor: '#D97706',
              checkoutButtonBgColor: '#059669',
              checkoutButtonHoverBgColor: '#047857',
              tickets: [
                {
                  id: 'early-bird',
                  name: 'Early Bird',
                  price: 499.99,
                  description: 'Limited time offer. Full access to all three days of the summit.',
                  date: 'Valid until July 15, 2025',
                  remainingTickets: 150,
                  maxPerOrder: 4
                },
                {
                  id: 'standard',
                  name: 'Standard Admission',
                  price: 699.99,
                  description: 'Full access to all events, sessions, workshops, and networking opportunities.',
                  date: 'Valid for all event dates',
                  remainingTickets: 500,
                  maxPerOrder: 8
                },
                {
                  id: 'vip',
                  name: 'VIP Experience',
                  price: 1299.99,
                  description: 'Premium experience with exclusive access, priority seating, special events, and VIP lounge access.',
                  date: 'Valid for all event dates',
                  remainingTickets: 75,
                  maxPerOrder: 2
                }
              ],
              eventId: 'techsummit2025'
            }
          }
        ]
      },
      
      // Call to Action
      {
        type: 'container',
        id: 'cta-section',
        props: {
          bgColor: '#F59E0B',
          paddingTop: '80',
          paddingBottom: '80',
          paddingLeft: '24',
          paddingRight: '24',
          textAlign: 'center'
        },
        components: [
          {
            id: 'cta-title',
            type: 'title',
            props: {
              text: 'Ready to join us at Horizon Tech Summit 2025?',
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
              text: 'Early bird tickets available now. Don\'t miss this opportunity to be part of the future of technology.',
              fontSize: '18',
              color: '#ffffff',
              alignment: 'center',
              marginBottom: '32',
              maxWidth: '700px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }
          },
          {
            id: 'cta-button',
            type: 'button',
            props: {
              label: 'Get Your Tickets Now',
              bgColor: '#ffffff',
              color: '#D97706',
              borderRadius: '8',
              padding: '16px 32px',
              fontSize: '18',
              fontWeight: '600',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }
          },
          {
            id: 'cta-social',
            type: 'socialMediaSharing',
            props: {
              direction: 'row',
              alignment: 'center',
              marginTop: '32',
              showTitle: true,
              title: 'Share with your network:',
              textColor: '#ffffff',
              fontWeight: '500',
              iconColor: '#ffffff',
              bgColor: 'rgba(255,255,255,0.2)',
              hoverBgColor: 'rgba(255,255,255,0.3)'
            }
          }
        ]
      },
      
      // Footer
      {
        type: 'container',
        id: 'footer-section',
        props: {
          bgColor: '#111827',
          paddingTop: '64',
          paddingBottom: '64',
          paddingLeft: '24',
          paddingRight: '24',
          textAlign: 'center'
        },
        components: [
          {
            id: 'footer-logo',
            type: 'title',
            props: {
              text: 'HORIZON TECH SUMMIT',
              fontSize: '24',
              fontWeight: '700',
              color: '#ffffff',
              alignment: 'center',
              marginBottom: '24'
            }
          },
          {
            id: 'footer-text',
            type: 'text',
            props: {
              text: '© 2025 Horizon Tech Summit. All rights reserved.',
              fontSize: '14',
              color: '#9CA3AF',
              alignment: 'center',
              marginBottom: '16'
            }
          },
          {
            id: 'footer-contact',
            type: 'text',
            props: {
              text: 'Contact: info@techhorizonsummit.com | (555) 123-4567',
              fontSize: '14',
              color: '#9CA3AF',
              alignment: 'center'
            }
          }
        ]
      }
    ]
  };