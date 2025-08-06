<div align="center">
  <img src="/public/logo.svg" alt="NeuralMeet Logo" width="120" height="120">
  
  # 🧠 NeuralMeet
  
  **AI-Powered Video Meetings with Intelligent Agents**
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Better Auth](https://img.shields.io/badge/Better_Auth-1.2.8-green?style=flat-square)](https://better-auth.com/)
  [![Stream](https://img.shields.io/badge/Stream-Video_&_Chat-00D4FF?style=flat-square&logo=stream)](https://getstream.io/)
  [![OpenAI](https://img.shields.io/badge/OpenAI-API-FF6B6B?style=flat-square&logo=openai)](https://openai.com/)
  
  ---
  
  🚧 **Currently Under Development** 🚧  
  🚀 **Launching Soon** 🚀
  
</div>

## ✨ Overview

NeuralMeet is a Software as a Service (SaaS) video calling platform powered by artificial intelligence. The core feature is that users can have real-time video calls with AI agents trained for specific roles, such as a language tutor, an interview coach, or a custom agent with a unique personality.

After a call, the platform automatically processes the meeting to provide a structured summary, a fully searchable transcript, and a complete call recording. It also includes a chat interface that understands the context of the meeting, allowing users to ask specific questions about the conversation.

## 🌟 Key Features

### 🎥 **Advanced Video & Audio**
- High-quality video calls with Stream Video SDK
- Real-time audio processing with OpenAI Realtime API
- Live transcription and recording capabilities
- Multi-participant support with advanced controls

### 🤖 **AI-Powered Intelligence**
- **Custom AI Agents** - Create personalized AI assistants for meetings
- **Real-time Transcription** - Instant speech-to-text conversion
- **Intelligent Summaries** - Auto-generated meeting summaries and notes
- **Background Processing** - Async AI tasks with Inngest

### 💬 **Rich Communication**
- Integrated chat during video calls
- File sharing and screen sharing
- Emoji reactions and interactive elements
- Real-time collaboration tools

### 🔐 **Enterprise-Grade Security**
- Multi-factor authentication with Better Auth
- Social login (Google, GitHub)
- WebAuthn biometric authentication
- Secure session management

### 📊 **Meeting Management**
- Meeting scheduling and organization
- Historical meeting records
- AI-generated insights and analytics
- Export capabilities for summaries

## 🛠 Tech Stack

### **Frontend**
- **Next.js 15.3.2** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn/UI** - Beautiful component library
- **React Hook Form** - Form handling with validation

### **Backend & APIs**
- **tRPC** - End-to-end typesafe APIs
- **Better Auth** - Modern authentication solution
- **Drizzle ORM** - Type-safe database operations
- **PostgreSQL** - Primary database (Neon serverless)

### **AI & Real-time Services**
- **OpenAI API** - GPT models for AI agents and summaries
- **OpenAI Realtime API** - Real-time audio processing
- **Stream Video SDK** - Video calling infrastructure
- **Stream Chat SDK** - Real-time messaging
- **Inngest** - Background job processing

### **Development & Deployment**
- **ESLint** - Code linting and formatting
- **TypeScript** - Static type checking
- **Drizzle Kit** - Database migrations
- **Vercel** - Deployment platform (ready)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Open AI API Key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/JigyasuRajput/neuralmeet.git
cd neuralmeet
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Fill in your environment variables:
```env
# Database
DATABASE_URL="your-postgresql-url"

# Authentication
NEXT_PUBLIC_APP_URL="http://localhost:3000"
BETTER_AUTH_SECRET="your-secret-key"

# OAuth Providers
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stream
NEXT_PUBLIC_STREAM_VIDEO_API_KEY="your-stream-video-key"
STREAM_VIDEO_SECRET_KEY="your-stream-video-secret"
NEXT_PUBLIC_STREAM_CHAT_API_KEY="your-stream-chat-key"
STREAM_CHAT_SECRET_KEY="your-stream-chat-secret"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# Inngest
INNGEST_EVENT_KEY="your-inngest-key"
```

4. **Set up the database**
```bash
npm run db:push
```

5. **Start the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
├── components/
│   └── ui/                # Shadcn/UI components
├── modules/
│   ├── auth/              # Authentication logic
│   ├── meetings/          # Meeting management
│   └── agents/            # AI agent functionality
├── lib/                   # Utility libraries
│   ├── auth.ts           # Better Auth configuration
│   ├── stream-video.ts   # Stream Video setup
│   ├── stream-chat.ts    # Stream Chat setup
│   └── trpc.ts           # tRPC configuration
├── db/
│   └── schema.ts         # Database schema
├── inngest/              # Background job functions
└── trpc/                 # API routes and procedures
```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push database schema
npm run db:studio    # Open Drizzle Studio
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- 📧 Email: jigyasu2021@gmail.com
- 💬 Discord: [Join our community](https://discord.gg/NzXczmCvA5)
- 🐛 Issues: [GitHub Issues](https://github.com/JigyasuRajput/neuralmeet/issues)

---

<div align="center">
  <p>Built with ❤️ by Jigyasu Rajput</p>
  <p>
    <a href="https://x.com/Jigyasu_rajput">Twitter</a> •
    <a href="https://www.linkedin.com/in/jigyasu-rajput-218657284/">LinkedIn</a> 
  </p>
</div>
