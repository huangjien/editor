import React from 'react';
import { render } from '@testing-library/react-native';
import { AboutScreen } from '../src/screens/AboutScreen';
import { ThemeProvider } from '../src/contexts/ThemeContext';

describe('AboutScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <ThemeProvider>
        <AboutScreen />
      </ThemeProvider>,
    );
    expect(getByText('About Modern Fleet App')).toBeTruthy();
    expect(
      getByText(/Your personal reading companion with powerful features/),
    ).toBeTruthy();
    expect(getByText('Version: 1.0.0')).toBeTruthy();
  });
});
