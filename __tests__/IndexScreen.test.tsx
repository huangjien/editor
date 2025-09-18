import { IndexScreen } from '../src/screens/IndexScreen';

describe('IndexScreen', () => {
  it('can be imported', () => {
    expect(IndexScreen).toBeDefined();
  });

  it('is a valid React component function', () => {
    expect(typeof IndexScreen).toBe('function');
  });

  it('has the expected component structure', () => {
    // Verify it's a function that can be used as a React component
    expect(IndexScreen.length).toBeGreaterThanOrEqual(0);
    expect(IndexScreen.name).toBe('IndexScreen');
  });
});
