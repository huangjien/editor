import React from 'react';
import { render } from '@testing-library/react-native';
import { AboutScreen } from '../src/screens/AboutScreen';

describe('AboutScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<AboutScreen />);
    expect(getByText('About Modern Fleet App')).toBeTruthy();
    expect(
      getByText(/This app allows you to read and listen to novel chapters/),
    ).toBeTruthy();
    expect(getByText('Version: 1.0.0')).toBeTruthy();
  });
});
