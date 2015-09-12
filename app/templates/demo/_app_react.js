/*global document:false*/
import React from 'react';
import <%= componentName %> from '../src/<%= componentName %>';

class App extends React.Component {
  render() {
    return (
      <<%= componentName %>/>
    );
  }
}

const content = document.getElementById('content');

React.render(<App/>, content);
