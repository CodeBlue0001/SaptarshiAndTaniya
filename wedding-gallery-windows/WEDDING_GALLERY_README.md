# Wedding Photo Gallery 💒📸

A beautiful, feature-rich wedding photo gallery application with AI-powered face detection, secure authentication, and intelligent photo organization. Built with React, TypeScript, and modern web technologies.

## ✨ Features

### 🔐 Authentication & Security

- **User Registration & Login**: Secure authentication system
- **Role-based Access**: Admin and user roles with different permissions
- **Private Galleries**: Only authenticated users can upload and download photos
- **Guest Access**: Unauthenticated users can browse but with limited access

### 📁 Photo Management

- **Smart Upload**: Drag & drop interface supporting multiple files
- **File Organization**: Create and manage folders to organize photos
- **Storage Management**: 50GB storage limit with usage tracking
- **Bulk Operations**: Upload multiple photos simultaneously
- **File Validation**: Automatic file type and size validation

### 🤖 AI-Powered Features

- **Face Detection**: Automatic face recognition in uploaded photos
- **People Classification**: AI categorizes photos by detected faces
- **Smart Grouping**: Photos automatically grouped by people
- **Face Confidence Scoring**: AI confidence levels for face matches

### 🖼️ Gallery Experience

- **Beautiful UI**: Modern, responsive design with smooth animations
- **Multiple View Modes**: Grid view, people view, and folder view
- **Advanced Search**: Search photos by filename, tags, or content
- **Photo Modal**: Full-screen photo viewing with navigation
- **Face Highlighting**: Visual indication of detected faces
- **Download Options**: High-quality photo downloads for authenticated users

### 📱 Responsive Design

- **Mobile Optimized**: Works perfectly on all device sizes
- **Touch Friendly**: Optimized for touch interactions
- **Progressive Enhancement**: Graceful degradation for older browsers

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm, yarn, or pnpm

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the provided localhost URL

## 🔧 Technical Architecture

### Frontend Technologies

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development experience
- **Vite**: Fast build tool and development server
- **TailwindCSS**: Utility-first styling framework
- **Radix UI**: Accessible component primitives
- **React Router**: Client-side routing
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation

### AI & ML Features

- **face-api.js**: Face detection and recognition (currently simulated)
- **Face Descriptors**: Mathematical face representations for matching
- **Confidence Scoring**: AI confidence levels for face matches

### State Management

- **React Context**: Global state management for authentication
- **Local Storage**: Client-side data persistence
- **Service Layer**: Organized business logic separation

## 📋 User Guide

### For Guests (Unauthenticated Users)

1. **Browse Gallery**: View photos in the main gallery
2. **Limited Access**: Can see photos but cannot download or upload
3. **Sign Up**: Create an account to access full features

### For Registered Users

1. **Sign In**: Use your credentials to access full features
2. **Upload Photos**:
   - Go to Upload page
   - Select or create folders
   - Drag & drop photos or click to select
   - Photos are automatically processed for faces
3. **Organize Photos**:
   - Create folders for events or dates
   - Move photos between folders
   - Tag photos for easier searching
4. **Browse & Download**:
   - View photos in multiple formats
   - Use search to find specific photos
   - Download high-quality versions
   - Browse by people or folders

### Face Detection & Classification

- **Automatic Processing**: All uploaded photos are processed for faces
- **People Groups**: Photos are automatically grouped by detected people
- **Manual Override**: Admins can manually adjust person classifications
- **Privacy**: Face data is stored locally and securely

## 🎨 Customization

### Themes & Styling

- The application uses TailwindCSS for styling
- Modify `tailwind.config.ts` to customize colors and design tokens
- Dark/light mode support built-in

### Storage Configuration

- Currently uses browser localStorage for demo purposes
- Can be easily adapted to use cloud storage services
- Storage limits and quotas are configurable

### Face Detection

- Currently simulated for demo purposes
- Can be integrated with real ML services like AWS Rekognition, Google Vision, or local ML models
- Face detection models can be swapped easily

## 🔒 Security Features

### Data Protection

- **Client-side Storage**: All data stored locally in browser
- **No External APIs**: No data sent to third-party services
- **Secure Authentication**: JWT-style token management
- **Input Validation**: All user inputs are validated

### Privacy

- **Face Data**: Face descriptors stored locally, not shared
- **Photo Access**: Role-based access control
- **Guest Limitations**: Unauthenticated users have restricted access

## 🚀 Production Deployment

### Environment Setup

1. Build the application:

   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your web server

### Configuration for Production

- Set up proper backend services for:
  - User authentication
  - File storage (AWS S3, Google Cloud Storage, etc.)
  - Face detection APIs
  - Database for metadata storage

### Recommended Services

- **Storage**: AWS S3, Cloudflare R2, or Google Cloud Storage
- **Face Detection**: AWS Rekognition, Google Vision API, or Azure Face API
- **Authentication**: Auth0, Firebase Auth, or custom JWT
- **Database**: PostgreSQL, MongoDB, or Firebase Firestore

## 🛠️ Development

### Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── gallery/         # Gallery-specific components
│   ├── layout/          # Layout components
│   └── ui/              # Basic UI components
├── contexts/            # React contexts
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── pages/               # Page components
├── services/            # Business logic services
└── types/               # TypeScript type definitions
```

### Key Services

- **authService**: Handles user authentication
- **galleryService**: Manages photos and folders
- **faceDetectionService**: AI face detection and classification

### Adding New Features

1. Define types in `src/types/index.ts`
2. Create service functions for business logic
3. Build UI components in appropriate directories
4. Add routes in `src/App.tsx`

## 📝 Future Enhancements

### Planned Features

- **Real-time Sync**: Multi-user real-time photo sharing
- **Advanced Search**: AI-powered content search
- **Photo Editing**: Basic photo editing tools
- **Event Management**: Organize photos by wedding events
- **Guest Invitations**: Invite system for guests
- **Social Features**: Comments, likes, and sharing
- **Mobile App**: Native mobile applications
- **Video Support**: Video uploads and playback
- **Print Services**: Integration with photo printing services

### Technical Improvements

- **Offline Support**: PWA capabilities for offline access
- **Performance**: Image optimization and lazy loading
- **Accessibility**: Enhanced accessibility features
- **SEO**: Server-side rendering for better SEO
- **Analytics**: Usage analytics and insights

## 🤝 Contributing

### Development Guidelines

1. Follow TypeScript best practices
2. Use existing UI components when possible
3. Write meaningful commit messages
4. Test new features thoroughly
5. Update documentation for new features

### Code Style

- Use ESLint and Prettier for code formatting
- Follow React functional component patterns
- Use TypeScript for type safety
- Write self-documenting code

## 📄 License

This project is built as a demonstration of modern web development practices for wedding photo galleries. Feel free to use and modify for your own projects.

## 🎉 Conclusion

This wedding photo gallery application demonstrates a complete, production-ready solution for managing and sharing wedding photos with modern web technologies, AI-powered features, and beautiful user experience. It's designed to be scalable, maintainable, and easily deployable to production environments.

Perfect for couples who want a private, secure, and intelligent way to share their special day with family and friends! 💕
