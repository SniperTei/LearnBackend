# Public Directory

This directory contains static files that are publicly accessible.

## Uploads

The `uploads` directory is used to store uploaded files such as images. This directory is ignored by git to avoid committing user-uploaded content.

Directory structure:
```
uploads/
  ├── YYYY/       # Year
  │   ├── MM/     # Month
  │   │   └── DD/ # Day
  │   │       └── [uploaded files]
```

Note: Make sure to create the `uploads` directory when deploying the application.
