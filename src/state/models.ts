export class Settings {
  githubToken: string = '';
  githubRepoUrl: string = '';
  githubRepoBranch: string = '';
  contentFolderPath: string = '';
  displayFont: string = 'System';
  fontSize: number = 16;
  playSpeed: number = 1.0;
  theme: 'system' | 'light' | 'dark' = 'system';
  currentChapterId?: string;
  currentReadingOffset: number = 0;
}

export class Chapter {
  id: string = '';
  title: string = '';
  content: string = '';
}

export class User {
  isAuthenticated: boolean = false;
}
