export const concertTemplate = {
    id: 'concert',
    name: 'Music Concert',
    description: 'Vibrant design for concerts, festivals, and music events',
    thumbnail: '/api/placeholder/400/250',
    category: 'Entertainment',
    data: [
        // Dynamic concert template data would go here
        {
          type: 'container',
          id: 'nav-container',
          props: {
            bgColor: 'rgba(0,0,0,0.8)',
            paddingTop: '16',
            paddingBottom: '16',
            paddingLeft: '24',
            paddingRight: '24',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          },
          components: [
            {
              id: 'nav-logo',
              type: 'title',
              props: {
                text: 'SOUNDWAVE 2025',
                fontSize: '24',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '0'
              }
            },
            {
              id: 'nav-button',
              type: 'button',
              props: {
                label: 'GET TICKETS',
                bgColor: '#F24405',
                color: '#ffffff',
                borderRadius: '50',
                padding: '12px 24px',
                fontWeight: '700'
              }
            }
          ]
        },
        {
          type: 'container',
          id: 'hero-section',
          props: {
            bgColor: '#000000',
            bgImage: '/api/placeholder/1920/1080',
            paddingTop: '160',
            paddingBottom: '160',
            paddingLeft: '24',
            paddingRight: '24',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          },
          components: [
            {
              id: 'hero-date',
              type: 'text',
              props: {
                text: 'JULY 12-14, 2025',
                fontSize: '18',
                fontWeight: '700',
                color: '#F24405',
                letterSpacing: '3px',
                marginBottom: '16'
              }
            },
            {
              id: 'hero-title',
              type: 'title',
              props: {
                text: 'THE ULTIMATE MUSIC EXPERIENCE',
                fontSize: '64',
                fontWeight: '900',
                color: '#ffffff',
                alignment: 'center',
                letterSpacing: '2px',
                lineHeight: '1.1'
              }
            },
            {
              id: 'hero-location',
              type: 'text',
              props: {
                text: 'CENTRAL PARK, NEW YORK CITY',
                fontSize: '24',
                fontWeight: '600',
                color: '#ffffff',
                alignment: 'center',
                letterSpacing: '1px',
                marginTop: '24',
                marginBottom: '48'
              }
            },
            {
              id: 'hero-button',
              type: 'button',
              props: {
                label: 'GET TICKETS NOW',
                bgColor: '#F24405',
                color: '#ffffff',
                borderRadius: '50',
                padding: '20px 40px',
                fontSize: '18',
                fontWeight: '700',
                letterSpacing: '1px',
                boxShadow: '0 10px 25px rgba(242, 68, 5, 0.4)'
              }
            }
          ]
        }
      ]
    };