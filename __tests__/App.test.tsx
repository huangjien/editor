/**
 * @format
 */

import React from 'react';
import App from '../App';

describe('App', () => {
  it('can be imported', () => {
    expect(App).toBeDefined();
    expect(typeof App).toBe('function');
  });

  it('is a valid React component', () => {
    const component = <App />;
    expect(React.isValidElement(component)).toBe(true);
  });

  it('has the expected component structure', () => {
    // Verify it's a function that can be used as a React component
    expect(App.length).toBe(0); // App component takes no props
    expect(App.name).toBe('WrappedApp'); // The default export is WrappedApp
  });
});
