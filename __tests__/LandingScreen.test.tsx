import React from 'react';
import { render } from '@testing-library/react-native';
import { LandingScreen } from '../src/screens/LandingScreen';
import { ThemeProvider } from '../src/contexts/ThemeContext';

describe('LandingScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <ThemeProvider>
        <LandingScreen />
      </ThemeProvider>,
    );
    expect(getByText('Welcome to Editor')).toBeTruthy();
    expect(
      getByText(/Your personal reading companion with powerful features/),
    ).toBeTruthy();
  });
});
