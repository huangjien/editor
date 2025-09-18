import { GitHubService } from '../src/services/GitHubService';

// Mock axios to avoid actual network calls
jest.mock('axios');

describe('GitHubService', () => {
  it('can be imported', () => {
    expect(GitHubService).toBeDefined();
  });

  it('should have required static methods', () => {
    expect(typeof GitHubService.fetchChapterList).toBe('function');
    expect(typeof GitHubService.fetchChapterContent).toBe('function');
  });

  it('should handle fetchChapterList method signature', () => {
    const method = GitHubService.fetchChapterList;
    expect(method.length).toBe(4); // Should accept 4 parameters
  });

  it('should handle fetchChapterContent method signature', () => {
    const method = GitHubService.fetchChapterContent;
    expect(method.length).toBe(4); // Should accept 4 parameters
  });
});
