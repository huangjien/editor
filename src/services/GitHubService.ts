import axios from 'axios';
import { Chapter } from '../state/models';

export class GitHubService {
  static async fetchChapterList(
    token: string,
    repoUrl: string,
    branch: string,
    contentPath: string,
  ): Promise<Chapter[]> {
    try {
      const repoName = repoUrl.split('/').pop();
      const owner = repoUrl.split('/')[repoUrl.split('/').length - 2];

      const apiUrl = `https://api.github.com/repos/${owner}/${repoName}/contents/${contentPath}?ref=${branch}`;

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      const markdownFiles: Chapter[] = [];
      for (const item of response.data) {
        if (item.type === 'file' && item.name.endsWith('.md')) {
          markdownFiles.push({
            id: item.path,
            title: item.name.replace('.md', ''),
            content: '', // Content will be fetched separately
          });
        } else if (item.type === 'dir') {
          // Recursively fetch from subdirectories if needed
          // For now, we'll keep it flat as per initial spec, but this is where recursion would go.
        }
      }
      return markdownFiles;
    } catch (error) {
      console.error('Error fetching chapter list:', error);
      throw error;
    }
  }

  static async fetchChapterContent(
    token: string,
    repoUrl: string,
    branch: string,
    chapterPath: string,
  ): Promise<string> {
    try {
      const repoName = repoUrl.split('/').pop();
      const owner = repoUrl.split('/')[repoUrl.split('/').length - 2];

      const rawContentUrl = `https://raw.githubusercontent.com/${owner}/${repoName}/${branch}/${chapterPath}`;

      const response = await axios.get(rawContentUrl, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching chapter content:', error);
      throw error;
    }
  }
}
