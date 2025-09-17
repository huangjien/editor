# Data Model

## Entities

### Chapter
- **description**: Represents a single novel chapter.
- **fields**:
    - `id`: string (unique identifier, e.g., file path)
    - `title`: string
    - `content`: string (markdown content)
    - `last_read_position`: number (e.g., line number or character offset)

### Settings
- **description**: Stores user-specific application settings.
- **fields**:
    - `github_token`: string (securely stored)
    - `github_repo`: string
    - `github_branch`: string
    - `content_folder`: string
    - `display_font`: string
    - `font_size`: number
    - `play_speed`: number
    - `language`: string (e.g., 'en', 'zh_CN')
