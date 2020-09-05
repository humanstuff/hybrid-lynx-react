import React from 'react';
import ReactDOM from 'react-dom';
import * as jsua from '@lynx-json/jsua';
import * as lynx from '@lynx-json/jsua-lynx';
import * as url from 'url';
import ReactNested from './ReactNested';

const nestedComponentRegistry = {
  'ReactNested': ReactNested
};

// this is where a Lynx app JavaScript bundle could be
// imported into a React app and customized

// register the view builder function that converts Lynx+JSON into HTML
jsua.building.register('application/lynx+json', lynx.building.build);

// register the view builder function that converts plain text into HTML
jsua.building.register('text/plain', function (content) {
  const view = document.createElement('div');
  return Promise.resolve(view);
});

// register the view builder function that converts React+JSON to React
jsua.building.register('application/react+json', function (content) {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader();

    reader.onload = function (evt) {
      try {
        const data = JSON.parse(evt.target.result);
        const view = document.createElement('div');
        ReactDOM.render(
          React.createElement(nestedComponentRegistry[data.component], data.props, null),
          view
        );
        resolve(view);
      } catch (e) {
        reject(e);
      }
    };

    reader.readAsText(content.blob);
  });
});

// apply some basic styling to match theme of React App
jsua.finishing.register('basic-styling', function (result) {
  const fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif";
  Array.from(result.view.querySelectorAll('pre')).forEach(pre => {
    pre.style.fontFamily = fontFamily;
    pre.style.margin = '0';
  });
});

class LynxApp extends React.PureComponent {
  constructor(props) {
    super(props);
    this.rootViewRef = React.createRef();
  }

  componentDidMount() {
    const self = this;
    const rootView = this.rootViewRef.current;

    // register a custom react: protocol scheme handler
    // when the Lynx app needs to link to the React app
    // the Lynx app can use a URL like react:/foo/bar
    // to transition control back to the React app
    jsua.transferring.register('react', function (request) {
      const requestUri = url.parse(request.url);
      // notify React router about the navigation
      self.props.history.push(`/react${requestUri.pathname}`);

      // respond with empty content to Lynx app process
      request.blob = new Blob([''], { type: 'text/plain' });
      return Promise.resolve(request);
    });

    // register the root/page attacher to connect the newly built view to the DOM
    const rootAttacher = lynx.attaching.createRootAttacher(rootView);
    jsua.attaching.register('root-attacher', rootAttacher);

    // update React router with the current location in the Lynx app
    // this keeps the browser's address bar accurate
    jsua.finishing.register('react-location', function (result) {
      const urlObj = url.parse(result.content.url);
      if (urlObj.protocol === 'react:') return;
      if (result.view.parentElement === rootView) {
        self.props.history.replace(urlObj.pathname, null);
      }
    });

    // Lynx app is navigating to its first resource
    // so start the Lynx cycle with jsua.fetch
    const lynxUrl = `http:${this.props.location.pathname}`;
    jsua.fetch(lynxUrl, { origin: rootView });
  }

  render() {
    return (
      <div ref={this.rootViewRef}></div>
    );
  }
}

export default LynxApp;
