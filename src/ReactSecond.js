import React from 'react';
import { Link } from 'react-router-dom';

function ReactSecond() {
  return (
    <div>
      <div>React App / Second Component</div>
      <Link to="/lynx/first">Go to first page of Lynx App</Link>
    </div>
  );
}

export default ReactSecond;
