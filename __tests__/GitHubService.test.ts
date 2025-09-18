import { GitHubService } from '../src/services/GitHubService';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GitHubService', () => {
  const mockToken = 'ghp_testtoken';
  const mockRepoUrl = 'https://github.com/testowner/testrepo';
  const mockBranch = 'main';
  const mockContentPath = 'chapters';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch chapter list correctly', async () => {
    const mockResponseData = [
      { type: 'file', name: 'chapter1.md', path: 'chapters/chapter1.md' },
      { type: 'file', name: 'chapter2.md', path: 'chapters/chapter2.md' },
      { type: 'dir', name: 'images', path: 'chapters/images' },
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: mockResponseData });

    const chapters = await GitHubService.fetchChapterList(
      mockToken,
      mockRepoUrl,
      mockBranch,
      mockContentPath,
    );

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `https://api.github.com/repos/testowner/testrepo/contents/chapters?ref=main`,
      {
        headers: {
          Authorization: `token ${mockToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      },
    );
    expect(chapters).toEqual([
      { id: 'chapters/chapter1.md', title: 'chapter1', content: '' },
      { id: 'chapters/chapter2.md', title: 'chapter2', content: '' },
    ]);
  });

  it('should fetch chapter content correctly', async () => {
    const mockContent = '# Chapter 1\nThis is the content of chapter 1.';
    mockedAxios.get.mockResolvedValueOnce({ data: mockContent });

    const content = await GitHubService.fetchChapterContent(
      mockToken,
      mockRepoUrl,
      mockBranch,
      'chapters/chapter1.md',
    );

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `https://raw.githubusercontent.com/testowner/testrepo/main/chapters/chapter1.md`,
      {
        headers: {
          Authorization: `token ${mockToken}`,
        },
      },
    );
    expect(content).toBe(mockContent);
  });

  it('should handle errors when fetching chapter list', async () => {
    const error = new Error('Network error');
    mockedAxios.get.mockRejectedValueOnce(error);

    await expect(
      GitHubService.fetchChapterList(
        mockToken,
        mockRepoUrl,
        mockBranch,
        mockContentPath,
      ),
    ).rejects.toThrow('Network error');
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching chapter list:',
      error,
    );
  });

  it('should handle errors when fetching chapter content', async () => {
    const error = new Error('File not found');
    mockedAxios.get.mockRejectedValueOnce(error);

    await expect(
      GitHubService.fetchChapterContent(
        mockToken,
        mockRepoUrl,
        mockBranch,
        'chapters/nonexistent.md',
      ),
    ).rejects.toThrow('File not found');
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching chapter content:',
      error,
    );
  });
});
