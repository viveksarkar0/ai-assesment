# AI Assistant 🤖

A modern, conversational AI assistant built with Next.js that provides real-time weather information, Formula 1 updates, stock prices, and engaging conversations. Features instant messaging with ChatGPT-like UX, tool calling capabilities, and smart context awareness.

![AI Assistant Demo](https://img.shields.io/badge/Status-Live-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.12-38B2AC)

## ✨ Features

### 🗣️ **Conversational AI**
- **Natural Conversations**: Friendly, emoji-enhanced responses
- **Context Awareness**: Remembers conversation flow and provides relevant responses
- **Smart Corrections**: Handles location corrections and clarifications
- **Multiple Greeting Styles**: Responds to various greeting patterns

### 🌤️ **Weather Intelligence**
- **Global Weather Data**: Real-time weather for 200+ cities worldwide
- **Smart Location Detection**: Recognizes city names with typo tolerance
- **Multiple Query Formats**: 
  - "What's the weather in New York?"
  - "Delhi temperature"
  - "How's the weather like in London?"
- **Comprehensive Data**: Temperature, humidity, wind speed, conditions

### 🏎️ **Formula 1 Updates**
- **Latest Race Results**: Current F1 race standings and results
- **Championship Standings**: Driver and constructor standings
- **Race Schedules**: Upcoming race information
- **Real-time Updates**: Fresh F1 data integration

### 📈 **Stock Market Data**
- **Real-time Stock Prices**: Major stock exchanges
- **Market Insights**: Price changes and trends
- **Symbol Recognition**: Supports major stock symbols (AAPL, TSLA, MSFT, etc.)
- **Financial Data**: Comprehensive stock information

### 💬 **Chat Experience**
- **Instant Messaging**: Messages appear immediately when sent
- **Thinking Indicators**: Visual feedback while processing
- **Smooth Animations**: ChatGPT-like typing animations
- **Responsive Design**: Works perfectly on desktop and mobile
- **Chat History**: Persistent conversation storage

### 🔐 **Authentication & Security**
- **NextAuth Integration**: Secure user authentication
- **Session Management**: Persistent login sessions
- **Privacy Focused**: Secure data handling
- **User Profiles**: Personalized experience

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15.2.4** - React framework with App Router
- **React 19.1.0** - Latest React with concurrent features
- **TypeScript 5.9.2** - Type-safe development
- **Tailwind CSS 4.1.12** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

### **Backend & APIs**
- **Next.js API Routes** - Serverless API endpoints
- **AI Integration**: Multiple AI providers support
  - OpenAI GPT models
  - Google Gemini
  - Anthropic Claude
- **External APIs**:
  - OpenWeatherMap API
  - Formula 1 API
  - Stock Market APIs

### **Database & Storage**
- **Drizzle ORM** - Type-safe database toolkit
- **PostgreSQL** - Primary database (Vercel Postgres, Neon, PlanetScale)
- **Local Storage Fallback** - Offline-first approach
- **Multiple DB Support**: Flexibility for different deployment scenarios

### **Tools & Utilities**
- **Zod** - Schema validation
- **React Hook Form** - Form management
- **Date-fns** - Date manipulation
- **Sonner** - Toast notifications

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- npm/pnpm/yarn
- PostgreSQL database (optional - has local fallback)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ai-assistant.git
cd ai-assistant
```

2. **Install dependencies**
```bash
npm install
# or
pnpm install
# or
bun install
```

3. **Environment Setup**
Create a `.env.local` file:
```bash
cp .env.example .env.local
```

4. **Configure Environment Variables**
```env
# Database (Optional - uses local storage if not provided)
DATABASE_URL="postgresql://user:password@localhost:5432/ai_assistant"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# API Keys
OPENWEATHER_API_KEY="your-openweather-api-key"
F1_API_KEY="your-f1-api-key"
STOCK_API_KEY="your-stock-api-key"

# AI Providers (Choose one or multiple)
OPENAI_API_KEY="your-openai-key"
GOOGLE_API_KEY="your-google-ai-key"
ANTHROPIC_API_KEY="your-anthropic-key"
```

5. **Database Setup** (Optional)
```bash
# Generate database schema
npm run db:generate

# Push schema to database
npm run db:push

# View database (optional)
npm run db:studio
```

6. **Start Development Server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your AI assistant!

## 🔧 Configuration

### API Keys Setup

#### **Weather API (OpenWeatherMap)**
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your free API key
3. Add to `.env.local` as `OPENWEATHER_API_KEY`

#### **Stock Market API**
1. Choose a provider (Alpha Vantage, IEX Cloud, etc.)
2. Get API credentials
3. Add to `.env.local` as `STOCK_API_KEY`

#### **Formula 1 API**
1. Sign up for F1 data provider
2. Get API credentials
3. Add to `.env.local` as `F1_API_KEY`

### Database Options

#### **Option 1: Vercel Postgres (Recommended)**
```env
DATABASE_URL="postgres://username:password@host:port/database"
```

#### **Option 2: Local PostgreSQL**
```env
DATABASE_URL="postgresql://localhost:5432/ai_assistant"
```

#### **Option 3: No Database (Local Storage)**
Simply don't set `DATABASE_URL` - the app will use local storage automatically.

## 📖 Usage Examples

### Weather Queries
```
"What's the weather in New York?"
"Delhi temperature"
"How's the weather like in Tokyo?"
"What temp is London?"
```

### Formula 1
```
"Latest F1 race results"
"F1 standings"
"Next F1 race"
"Who won the last race?"
```

### Stock Market
```
"AAPL stock price"
"Tesla stock"
"Microsoft shares"
"How's NVDA doing?"
```

### General Conversation
```
"Hello!"
"How are you?"
"Thanks for the help"
"Tell me a joke"
```

## 🏗️ Project Structure

```
ai-assistant/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── chat/          # Chat endpoints
│   │   ├── chats/         # Chat management
│   │   └── auth/          # Authentication
│   ├── chat/              # Chat page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── chat/              # Chat-specific components
│   ├── ui/                # Reusable UI components
│   └── ChatSidebar.tsx    # Sidebar component
├── hooks/                 # Custom React hooks
│   ├── useChat.ts         # Chat management
│   └── useChatManager.ts  # Chat persistence
├── lib/                   # Utilities and configurations
│   ├── api/               # External API integrations
│   ├── db/                # Database schema and config
│   ├── tools/             # AI tool definitions
│   └── utils.ts           # Utility functions
├── drizzle/               # Database migrations
└── public/                # Static assets
```

## 🔧 Key Components

### **Chat Interface** (`components/chat/`)
- `ChatInterface.tsx` - Main chat container
- `ChatMessages.tsx` - Message display with animations
- `ChatInput.tsx` - Message input with auto-resize
- `MessageItem.tsx` - Individual message rendering
- `ChatTools.tsx` - Tool result visualization

### **Custom Hooks** (`hooks/`)
- `useChat.ts` - Real-time messaging with streaming
- `useChatManager.ts` - Chat persistence and management

### **API Integration** (`lib/api/`)
- `weather.ts` - OpenWeatherMap integration
- `f1.ts` - Formula 1 data fetching
- `stocks.ts` - Stock market data

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
```bash
npm i -g vercel
vercel
```

2. **Environment Variables**
Add all environment variables in Vercel dashboard

3. **Database Setup**
Use Vercel Postgres or your preferred provider

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Self-Hosted

```bash
npm run build
npm start
```

## 🎨 Customization

### **Styling**
- Modify `tailwind.config.js` for theme customization
- Update `app/globals.css` for global styles
- Components use CSS modules and Tailwind classes

### **AI Responses**
- Edit `app/api/chat/route.ts` for response logic
- Modify conversation patterns and responses
- Add new tool integrations

### **Database Schema**
- Update `lib/db/schema.ts` for data structure changes
- Run `npm run db:generate` after schema changes

## 🧪 Development

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate database migrations
npm run db:push      # Apply database changes
npm run db:studio    # Open database studio
```

### **Code Quality**
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Drizzle for type-safe database queries

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### **Guidelines**
- Follow TypeScript best practices
- Add tests for new features
- Update documentation
- Ensure responsive design
- Test with multiple API providers

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** team for the amazing framework
- **Vercel** for hosting and database solutions
- **Radix UI** for accessible components
- **OpenWeatherMap** for weather data
- **Tailwind CSS** for styling system

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/ai-assistant/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/ai-assistant/discussions)
- **Email**: your-email@example.com

---

**Made with ❤️ and ☕ by Vivek**

*Star ⭐ this repo if you find it helpful!*
