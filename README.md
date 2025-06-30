# 🌸 Swasti - Daily Wellness for Indian Moms

<div align="center">
  <img src="https://images.pexels.com/photos/7282818/pexels-photo-7282818.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Swasti Logo" width="200" height="200" style="border-radius: 20px; object-fit: cover;">
  
  <p><em>Your daily companion for traditional wellness wisdom, tailored for Indian mothers.</em></p>
  
  [![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-Latest-green.svg)](https://supabase.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC.svg)](https://tailwindcss.com/)
  [![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF.svg)](https://vitejs.dev/)
</div>

## 📱 About Swasti

Swasti is a modern mobile-first web application that brings traditional Ayurvedic wisdom and wellness tips to Indian mothers. The app provides daily health tips, home remedies, and traditional practices in an engaging, social media-style interface.

### ✨ Key Features

- **🎯 Daily Wellness Tips**: Discover new health tips every day based on traditional Ayurvedic wisdom
- **💫 Swipeable Interface**: Tinder-style card interface for discovering tips
- **❤️ Social Features**: Like, comment, save, and share tips with the community
- **👥 User Profiles**: Create profiles, follow other users, and build a wellness community
- **📚 Categories**: Browse tips by categories like Digestion, Immunity, Children's Health, etc.
- **💾 Save for Later**: Save your favorite tips for easy access
- **📱 Mobile-First**: Optimized for mobile devices with responsive design
- **🔐 Secure Authentication**: Email/password and Google OAuth authentication
- **🌐 Real-time Updates**: Live comments, likes, and social interactions

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern React with hooks and functional components
- **TypeScript 5.5.3** - Type-safe development
- **Vite 5.4.2** - Fast build tool and development server
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **React Router 6.22.3** - Client-side routing
- **Zustand 4.5.1** - Lightweight state management
- **Lucide React** - Beautiful icons
- **React Spring** - Smooth animations
- **React Tinder Card** - Swipeable card interface

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication & authorization
  - Row Level Security (RLS)
  - File storage

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/swasti-wellness-app.git
   cd swasti-wellness-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the migrations in the `supabase/migrations/` folder
   - Configure authentication providers (optional: Google OAuth)

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 📊 Database Schema

The application uses a PostgreSQL database with the following main tables:

- **profiles** - User profiles with bio, avatar, follower counts
- **tips** - Health tips with content, categories, and engagement metrics
- **saved_tips** - Junction table for user's saved tips
- **likes** - Junction table for tip likes
- **comments** - Comments on tips
- **follows** - User follow relationships

All tables have Row Level Security (RLS) enabled for data protection.

## 🔐 Authentication

Swasti supports multiple authentication methods:

- **Email/Password** - Traditional email registration with verification
- **Google OAuth** - One-click Google sign-in
- **Email Verification** - Required for new accounts

## 📱 Features Overview

### Home Feed
- Personalized feed based on followed users
- Popular tips section
- Quick access to categories

### Discover
- Swipeable card interface
- Swipe right to save, left to skip
- Infinite scroll through tips

### Categories
- Browse tips by health categories
- Dedicated pages for each category
- Visual category icons and themes

### Profile Management
- Edit profile with avatar upload
- View user statistics
- Manage followers/following
- Create and manage tips

### Social Features
- Like and comment on tips
- Follow other users
- Share tips via WhatsApp
- Real-time engagement updates

## 🎨 Design System

### Colors
- **Primary Green**: `#15803d` - Sage green for wellness
- **Accent Yellow**: `#f59e0b` - Turmeric yellow for warmth
- **Light variants**: Soft backgrounds and hover states

### Typography
- **Font**: Inter - Clean, readable sans-serif
- **Hierarchy**: Clear heading structure with proper spacing

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Consistent styling with hover states
- **Forms**: Clean inputs with focus states
- **Navigation**: Bottom tab navigation for mobile

## 🚀 Deployment

### Development Environment
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Deployment Options

1. **Netlify** (Recommended)
   - Connect your GitHub repository
   - Set environment variables
   - Automatic deployments on push

2. **Vercel**
   - Import from GitHub
   - Configure environment variables
   - Deploy with zero configuration

3. **Supabase Hosting**
   - Use Supabase's built-in hosting
   - Deploy directly from the dashboard

## 📁 Project Structure

```
swasti-wellness-app/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── store/            # Zustand state management
│   ├── data/             # Static data and constants
│   ├── lib/              # Utility libraries (Supabase)
│   ├── types.ts          # TypeScript type definitions
│   └── main.tsx          # Application entry point
├── supabase/
│   └── migrations/       # Database migrations
├── .env.example          # Environment variables template
└── README.md            # Project documentation
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Maintain component modularity
- Write descriptive commit messages
- Test your changes thoroughly

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ayurvedic Wisdom** - Traditional Indian medicine practices
- **Pexels** - Beautiful stock photography
- **Supabase** - Excellent backend-as-a-service platform
- **React Community** - Amazing ecosystem and tools

## 📞 Support

If you have any questions or need help:

- 📧 Email: support@swasti-app.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/swasti-wellness-app/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/swasti-wellness-app/discussions)

## 🗺️ Roadmap

- [ ] Push notifications for daily tips
- [ ] Offline mode support
- [ ] Multi-language support (Hindi, Tamil, etc.)
- [ ] Advanced search and filtering
- [ ] Wellness tracking and analytics
- [ ] Integration with health apps
- [ ] Community challenges and goals

---

<div align="center">
  <p>Made with ❤️ for the wellness of Indian mothers</p>
  <p><strong>Swasti</strong> - <em>Health, Prosperity, Well-being</em></p>
</div>