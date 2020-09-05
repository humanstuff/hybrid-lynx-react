// simulate Lynx+JSON services/resources
module.exports = exports = function (app) {
  app.get('/lynx/first', function (req, res) {
    const doc = {
      spec: {
        hints: [ 'container' ],
        children: [
          { name: 'header' },
          { name: 'link' }
        ]
      },
      value: {
        header: {
          spec: {
            hints: [ 'header', 'container' ],
            children: [
              { name: 'label' }
            ]
          },
          value: {
            label: {
              spec: {
                hints: [ 'label', 'text' ]
              },
              value: 'Lynx App / First Page'
            }
          }
        },
        link: {
          spec: {
            hints: [ 'link' ],
            children: [
              { name: 'label' }
            ]
          },
          value: {
            label: {
              spec: {
                hints: [ 'label', 'text' ]
              },
              value: 'Go to second page of Lynx App'
            },
            href: '/lynx/second'
          }
        }
      }
    };

    res.writeHead(200, { 'content-type': 'application/lynx+json' });
    res.end(JSON.stringify(doc));
  });

  app.get('/lynx/second', function (req, res) {
    const doc = {
      spec: {
        hints: [ 'container' ],
        children: [
          { name: 'header' },
          { name: 'link' }
        ]
      },
      value: {
        header: {
          spec: {
            hints: [ 'header', 'container' ],
            children: [
              { name: 'label' },
              { name: 'react' }
            ]
          },
          value: {
            label: {
              spec: {
                hints: [ 'label', 'text' ]
              },
              value: 'Lynx App / Second Page'
            },
            react: {
              spec: {
                hints: [ 'content' ]
              },
              value: {
                type: 'application/react+json',
                data: {
                  component: 'ReactNested',
                  props: {
                    message: 'This is a React component nested inside of a Lynx page.'
                  }
                }
              }
            }
          }
        },
        link: {
          spec: {
            hints: [ 'link' ],
            children: [
              { name: 'label' }
            ]
          },
          value: {
            label: {
              spec: {
                hints: [ 'label', 'text' ]
              },
              value: 'Go to first component of React App'
            },
            href: 'react:/first'
          }
        }
      }
    };

    res.writeHead(200, { 'content-type': 'application/lynx+json' });
    res.end(JSON.stringify(doc));
  });
};
