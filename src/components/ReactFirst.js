import React from 'react';
import { Link } from 'react-router-dom';

function ReactFirst() {
  return (
    <div>
      <div>React App / First Component</div>
      <Link to="/react/second">Go to second component of React App</Link>
    </div>
  );
}

export default ReactFirst;
