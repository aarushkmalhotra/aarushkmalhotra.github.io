# Example Project Data

This directory contains example data files to help you set up your own portfolio content.

## Getting Started

1. **Copy the example files**: Copy `projects.json` from this directory to `src/lib/data/projects.json`
2. **Replace with your content**: Update the example projects with your own project information
3. **Add your images**: Make sure the image IDs in your projects match files in your `public/` folder

## Project Structure

Each project in `projects.json` can have the following fields:

### Required Fields
- `id`: Unique identifier for the project (used in URLs)
- `name`: Display name of the project
- `tagline`: Short, catchy description
- `description`: Full project description (can be multiple paragraphs)
- `techStack`: Technologies used (comma-separated string)
- `keywords`: Array of category keywords
- `startDate`: Project start date (YYYY-MM-DD format)
- `type`: Usually "project"

### Optional Fields
- `role`: Your specific role in the project
- `problem`: Problem the project solved
- `approach`: How you approached the solution
- `challenges`: Obstacles you overcame
- `keyFeatures`: Array of main features
- `outcomes`: Results and impact
- `repoUrl`: GitHub repository URL
- `demoUrl`: Live demo URL
- `endDate`: Project end date (null for ongoing projects)
- `images`: Array of image IDs (should match filenames in public folder)
- `videoPreview`: Path to preview video
- `hoverVideo`: Path to video that plays on hover
- `documents`: Array of document objects with id, title, and file path
- `audioFiles`: Array of audio objects (for music/audio projects)
- `downloadableAudioFiles`: Array of downloadable audio files
- `theme`: Color theme with primary and secondary HSL colors

## Image Naming

Make sure your image files in the `public/` folder match the IDs you use in the `images` array. For example:
- `"images": ["my-project-1", "my-project-2"]` 
- Should correspond to files like `my-project-1.jpg` and `my-project-2.png` in your `public/` folder

## Theme Colors

Use HSL color format for themes:
```json
"theme": {
  "primary": "hsl(220, 70%, 50%)",
  "secondary": "hsl(280, 70%, 60%)"
}
```