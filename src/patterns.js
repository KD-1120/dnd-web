import { v4 as uuidv4 } from 'uuid';
import { Navigation, Layout } from 'react-feather';

// Create fixed IDs for global elements that won't change
export const GLOBAL_IDS = {
  NAVIGATION: 'global-navigation',
  FOOTER: 'global-footer'
};

export const patterns = [
  {
    name: 'Site Navigation',
    description: 'Main navigation bar for the site',
    category: 'Site Framework',
    icon: Navigation,
    bricks: [
      {
        type: 'navigation',
        id: GLOBAL_IDS.NAVIGATION,
        props: {
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          width: '100%'
        },
        children: [
          {
            type: 'navbar',
            id: uuidv4(),
            props: {
              bgColor: '#343a40',
              paddingY: '.5rem',
              paddingX: '1rem',
              position: 'static',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between'
            },
            children: [
              {
                type: 'navbarBrand',
                id: uuidv4(),
                props: {
                  text: 'Brand',
                  href: '#',
                  color: '#ffffff',
                  fontSize: '1.25rem',
                  padding: '.3125rem 0',
                  marginRight: '1rem',
                  textDecoration: 'none'
                }
              },
              {
                type: 'navbarToggler',
                id: uuidv4(),
                props: {
                  target: 'navbarNav',
                  padding: '.25rem .75rem',
                  fontSize: '1.25rem',
                  lineHeight: '1',
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(255,255,255,.1)',
                  borderRadius: '.25rem'
                }
              },
              {
                type: 'navbarCollapse',
                id: uuidv4(),
                props: {
                  id: 'navbarNav'
                },
                children: [
                  {
                    type: 'navbarNav',
                    id: uuidv4(),
                    props: {
                      display: 'flex',
                      flexDirection: 'row',
                      paddingLeft: '0',
                      marginBottom: '0',
                      listStyle: 'none'
                    },
                    children: [
                      {
                        type: 'navItem',
                        id: uuidv4(),
                        props: {
                          active: true
                        },
                        children: [
                          {
                            type: 'navLink',
                            id: uuidv4(),
                            props: {
                              label: 'Home',
                              href: '#',
                              padding: '.5rem 1rem',
                              color: 'rgba(255,255,255,.9)'
                            }
                          }
                        ]
                      },
                      {
                        type: 'navItem',
                        id: uuidv4(),
                        props: {},
                        children: [
                          {
                            type: 'navLink',
                            id: uuidv4(),
                            props: {
                              label: 'Features',
                              href: '#',
                              padding: '.5rem 1rem',
                              color: 'rgba(255,255,255,.5)'
                            }
                          }
                        ]
                      },
                      {
                        type: 'navItem',
                        id: uuidv4(),
                        props: {},
                        children: [
                          {
                            type: 'navLink',
                            id: uuidv4(),
                            props: {
                              label: 'Pricing',
                              href: '#',
                              padding: '.5rem 1rem',
                              color: 'rgba(255,255,255,.5)'
                            }
                          }
                        ]
                      },
                      {
                        type: 'navItem',
                        id: uuidv4(),
                        props: {},
                        children: [
                          {
                            type: 'navLink',
                            id: uuidv4(),
                            props: {
                              label: 'Contact',
                              href: '#',
                              padding: '.5rem 1rem',
                              color: 'rgba(255,255,255,.5)'
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    name: 'Site Footer',
    description: 'Global footer with multiple columns',
    category: 'Site Framework',
    icon: Layout,
    bricks: [
      {
        type: 'footer',
        id: GLOBAL_IDS.FOOTER,
        props: {
          width: '100%',
          padding: '4rem 0',
          bgColor: '#f8f9fa',
          borderTop: '1px solid #dee2e6'
        },
        children: [
          {
            type: 'container',
            id: uuidv4(),
            props: {
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              padding: '0 1rem'
            },
            children: [
              {
                type: 'column',
                id: uuidv4(),
                props: {
                  width: '25%',
                  padding: '0 15px'
                },
                children: [
                  {
                    type: 'heading',
                    id: uuidv4(),
                    props: {
                      text: 'About Us',
                      level: 3,
                      fontSize: '1.25rem',
                      marginBottom: '.75rem'
                    }
                  },
                  {
                    type: 'paragraph',
                    id: uuidv4(),
                    props: {
                      content: 'Learn more about our company and values.',
                      fontSize: '1rem',
                      color: '#6c757d'
                    }
                  }
                ]
              },
              {
                type: 'column',
                id: uuidv4(),
                props: {
                  width: '25%',
                  padding: '0 15px'
                },
                children: [
                  {
                    type: 'heading',
                    id: uuidv4(),
                    props: {
                      text: 'Services',
                      level: 3,
                      fontSize: '1.25rem',
                      marginBottom: '.75rem'
                    }
                  },
                  {
                    type: 'list',
                    id: uuidv4(),
                    props: {
                      items: [
                        { text: 'Web Development', href: '#' },
                        { text: 'App Design', href: '#' },
                        { text: 'SEO Optimization', href: '#' }
                      ],
                      fontSize: '1rem',
                      color: '#6c757d'
                    }
                  }
                ]
              },
              {
                type: 'column',
                id: uuidv4(),
                props: {
                  width: '25%',
                  padding: '0 15px'
                },
                children: [
                  {
                    type: 'heading',
                    id: uuidv4(),
                    props: {
                      text: 'Contact',
                      level: 3,
                      fontSize: '1.25rem',
                      marginBottom: '.75rem'
                    }
                  },
                  {
                    type: 'paragraph',
                    id: uuidv4(),
                    props: {
                      content: 'Get in touch with us for inquiries.',
                      fontSize: '1rem',
                      color: '#6c757d'
                    }
                  }
                ]
              },
              {
                type: 'column',
                id: uuidv4(),
                props: {
                  width: '25%',
                  padding: '0 15px'
                },
                children: [
                  {
                    type: 'heading',
                    id: uuidv4(),
                    props: {
                      text: 'Follow Us',
                      level: 3,
                      fontSize: '1.25rem',
                      marginBottom: '.75rem'
                    }
                  },
                  {
                    type: 'list',
                    id: uuidv4(),
                    props: {
                      items: [
                        { text: 'Facebook', href: '#' },
                        { text: 'Twitter', href: '#' },
                        { text: 'LinkedIn', href: '#' }
                      ],
                      fontSize: '1rem',
                      color: '#6c757d'
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

// Add default configuration that will be used to initialize global layouts
export const defaultGlobalLayouts = {
  navigation: patterns.find(p => p.name === 'Site Navigation')?.bricks[0],
  footer: patterns.find(p => p.name === 'Site Footer')?.bricks[0]
};