import React from 'react';
import { render } from '@testing-library/react-native';
import { LandingScreen } from '../src/screens/LandingScreen';

describe('LandingScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<LandingScreen />);
    expect(getByText('Welcome to Modern Fleet App')).toBeTruthy();
    expect(getByText('Your journey into novels begins here.')).toBeTruthy();
  });
});
