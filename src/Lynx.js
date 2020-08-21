import React from 'react';
import { Link } from 'react-router-dom';
import * as jsua from '@lynx-json/jsua';
import * as lynx from '@lynx-json/jsua-lynx';

jsua.building.register('application/lynx+json', lynx.building.build);

const rootView = document.querySelector('#root');
const rootAttacher = lynx.attaching.createRootAttacher(rootView);
jsua.attaching.register('root-attacher', rootAttacher);

function Lynx() {
  return (
    <div>
      <div>Lynx App</div>
      <Link to="/react/first">Go to React</Link>
    </div>
  );
}

export default Lynx;
