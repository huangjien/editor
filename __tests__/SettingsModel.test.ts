import { Settings } from '../src/state/models';

describe('Settings Data Model', () => {
  it('should create a Settings object with default values', () => {
    const settings = new Settings();
    expect(settings.githubToken).toBe('');
    expect(settings.githubRepoUrl).toBe('');
    expect(settings.githubRepoBranch).toBe('');
    expect(settings.contentFolderPath).toBe('');
    expect(settings.displayFont).toBe('System');
    expect(settings.fontSize).toBe(16);
    expect(settings.playSpeed).toBe(1.0);
    expect(settings.currentChapterId).toBeUndefined();
    expect(settings.currentReadingOffset).toBe(0);
  });

  it('should allow setting and retrieving properties', () => {
    const settings = new Settings();
    settings.githubToken = 'test_token';
    settings.fontSize = 20;
    expect(settings.githubToken).toBe('test_token');
    expect(settings.fontSize).toBe(20);
  });
});
