import React, { useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import * as jsua from '@lynx-json/jsua';
import * as lynx from '@lynx-json/jsua-lynx';
import * as url from 'url';

// a reference to the root/page view for the Lynx app
const rootView = document.querySelector('#lynx');

// this is where a Lynx app JavaScript bundle could be
// imported into a React app and customized

// register a custom react: protocol scheme handler
// when the Lynx app needs to link to the React app
// the Lynx app can use a URL like react:/foo/bar
// to transition control back to the React app
jsua.transferring.register('react', function (request) {
  // remove all HTML elements from the Lynx app view
  while (rootView.firstElementChild) {
    rootView.removeChild(rootView.firstElementChild);
  }

  const requestUri = url.parse(request.url);
  // notify React router about the navigation
  jsua.extensions.react.history.push(`/react${requestUri.pathname}`);

  // respond with empty content to Lynx app process
  request.blob = new Blob([''], { type: 'text/plain' });
  return Promise.resolve(request);
});

// register the view builder function that converts Lynx+JSON into HTML
jsua.building.register('application/lynx+json', lynx.building.build);

// register the view builder function that converts plain text into HTML
jsua.building.register('text/plain', function (content) {
  const view = document.createElement('div');
  return Promise.resolve(view);
});

// register the root/page attacher to connect the newly built view to the DOM
const rootAttacher = lynx.attaching.createRootAttacher(rootView);
jsua.attaching.register('root-attacher', rootAttacher);

// apply some basic styling to match theme of React App
jsua.finishing.register('basic-styling', function (result) {
  const fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif";
  Array.from(result.view.querySelectorAll('pre')).forEach(pre => {
    pre.style.fontFamily = fontFamily;
    pre.style.margin = '0';
  });
});

// update React router with the current location in the Lynx app
// this keeps the browser's address bar accurate
jsua.finishing.register('react-location', function (result) {
  const urlObj = url.parse(result.content.url);
  if (urlObj.protocol === 'react:') return;
  jsua.extensions.react.setLocation(urlObj.pathname);
});

// a React component for the Lynx app
// this component responds with a 0wx0h view
// so the React app's root element is not visible
// when the Lynx app's root element is visible
function LynxApp({ startAtPath, location }) {
  const history = useHistory();
  const [nextLocation, setNextLocation] = useState(null);

  // add some extensions to JSUA for coordination with React
  jsua.extensions = {
    react: {
      history: history,
      setLocation: function (lynxPath) {
        setNextLocation(lynxPath);
      }
    }
  };

  // Lynx app is navigating to a new location
  // so update React with new location
  if (nextLocation) {
    return (
      <Redirect to={nextLocation} />
    );
  } else if (startAtPath === location.pathname) {
    // Lynx app is navigating to its first resource
    // so start the Lynx cycle with jsua.fetch
    const lynxUrl = `http:${startAtPath}`;
    jsua.fetch(lynxUrl, { origin: rootView });
  }

  // an empty React view
  return (
    <div></div>
  );
}

export default LynxApp;
