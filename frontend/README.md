# Social Network - Frontend

A modern, feature-rich social media application built with React, TypeScript, and Material UI. This frontend provides a comprehensive social networking experience with real-time messaging, notifications, and social interactions.

## 🚀 Features

### Core Modules
- **🔐 Authentication System**: Login, registration, JWT token management, route protection
- **👥 User Management**: Profile management, avatar upload, user search, settings
- **📝 Post Management**: Create, edit, delete posts with image uploads, feed display
- **💬 Social Interactions**: Likes, comments, friendships, activity feeds
- **📨 Real-time Messaging**: WebSocket-powered chat with typing indicators
- **🔔 Notification System**: Real-time notifications with browser integration
- **🧭 Navigation & Routing**: Module-based routing with responsive layouts

### Technical Features
- **📱 Responsive Design**: Mobile-first approach with Material UI
- **🔄 Real-time Updates**: WebSocket integration for messaging and notifications
- **🎨 Dynamic Theming**: Material UI theme with light/dark mode support
- **💾 State Management**: Redux Toolkit with persistence
- **🔧 Type Safety**: Full TypeScript integration
- **⚡ Performance**: Lazy loading, infinite scroll, image optimization

## 🛠️ Tech Stack

### Core Technologies
- **React 19.1.0** - UI framework
- **TypeScript 5.8.3** - Type safety
- **Vite 6.3.5** - Build tool and development server
- **Material UI 7.1.0** - Component library and design system

### State Management & Data
- **Redux Toolkit 2.8.2** - State management
- **Redux Persist 6.0.0** - State persistence
- **Axios 1.9.0** - HTTP client with interceptors

### Real-time Communication
- **STOMP.js 7.1.1** - WebSocket messaging protocol
- **SockJS Client 1.6.1** - WebSocket fallback support

### Forms & Validation
- **Formik 2.4.6** - Form handling
- **Yup 1.6.1** - Schema validation

### Additional Libraries
- **React Router DOM 7.6.0** - Routing
- **Date-fns 4.1.0** - Date utilities
- **React Image Crop 11.0.10** - Image cropping functionality

## 📁 Project Structure

```
src/
├── modules/           # Feature modules
│   ├── auth/         # Authentication system
│   ├── user/         # User management
│   ├── post/         # Post management
│   ├── social/       # Social interactions
│   ├── messaging/    # Real-time messaging
│   └── notification/ # Notification system
├── shared/           # Shared components & utilities
│   ├── components/   # Reusable UI components
│   ├── services/     # API services
│   ├── types/        # TypeScript definitions
│   ├── utils/        # Utility functions
│   └── hooks/        # Custom React hooks
├── store/            # Redux store configuration
├── router/           # Routing configuration
└── assets/           # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Social Network/frontend"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_WS_BASE_URL=ws://localhost:8080/ws
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📝 Available Scripts

- **`npm run dev`** - Start development server with hot reload
- **`npm run build`** - Build production bundle
- **`npm run preview`** - Preview production build locally
- **`npm run lint`** - Run ESLint for code quality

## 🏗️ Architecture

### Module-Based Architecture
Each feature is organized into self-contained modules with:
- **Components**: UI components specific to the module
- **Pages**: Route-level components
- **Services**: API integration layer
- **Store**: Redux slices for state management
- **Types**: TypeScript interfaces
- **Hooks**: Module-specific custom hooks

### State Management Strategy
- **Global State**: Authentication, UI state, themes
- **Module State**: Feature-specific data and loading states
- **Local State**: Component-specific temporary state
- **Persistent State**: User preferences and authentication tokens

### Real-time Features
- **WebSocket Integration**: STOMP over SockJS for reliable messaging
- **Event-driven Updates**: Real-time notifications and message delivery
- **Offline Handling**: Graceful degradation when connectivity is lost

## 🔧 Development Guidelines

### Code Organization
- Use TypeScript for all components and services
- Implement proper error boundaries and loading states
- Follow Material UI design system guidelines
- Maintain separation of concerns between modules

### Performance Considerations
- Implement lazy loading for route components
- Use React.memo for expensive components
- Optimize images and implement progressive loading
- Implement virtual scrolling for large lists

### Testing Strategy
- Unit tests for utility functions and hooks
- Integration tests for API services
- Component testing with React Testing Library
- End-to-end testing for critical user flows

## 🌐 API Integration

The frontend integrates with a Spring Boot backend providing:
- **80+ REST API endpoints** across all feature modules
- **JWT-based authentication** with automatic token refresh
- **WebSocket connections** for real-time features
- **File upload support** with image processing
- **Comprehensive error handling** with correlation tracking

## 📱 Responsive Design

- **Mobile-first approach** with breakpoint-based layouts
- **Touch-friendly interactions** optimized for mobile devices
- **Adaptive navigation** with drawer for mobile, sidebar for desktop
- **Flexible grid system** using Material UI's responsive utilities

## 🔒 Security Features

- **JWT token management** with automatic refresh
- **Route protection** based on authentication state
- **API request interceptors** for security headers
- **Input validation** with Yup schemas
- **XSS protection** through proper data sanitization

## 🚀 Production Deployment

### Build Optimization
```bash
npm run build
```

### Environment Configuration
- Configure API endpoints for production
- Set up proper CORS settings
- Implement CDN for static assets
- Configure WebSocket endpoints

### Performance Monitoring
- Implement error tracking and monitoring
- Set up analytics for user interactions
- Monitor bundle size and loading performance

## 📈 Current Status

✅ **98% Complete** - All core features implemented
- Authentication and user management
- Post creation and social interactions
- Real-time messaging and notifications
- Responsive navigation and routing

🔄 **Remaining Tasks**:
- Advanced features and optimizations
- Production build and deployment setup

## 🤝 Contributing

1. Follow the established module structure
2. Maintain TypeScript type safety
3. Implement proper error handling
4. Write tests for new features
5. Follow Material UI design guidelines

## 📄 License

This project is part of a comprehensive social media application development effort.
