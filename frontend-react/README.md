# RAG AI Agent - React Frontend

A modern, feature-rich React/Next.js frontend for the RAG AI Agent with stunning UI/UX.

## 🚀 Features

- ✨ **Drag & Drop File Upload** - Intuitive file upload with progress indicators
- 🎨 **Advanced Animations** - Smooth Framer Motion animations throughout
- 📊 **Real-time Progress** - Visual feedback for all operations
- 💬 **AI Typing Indicators** - See when AI is processing
- 🎯 **Interactive Parallax** - Dynamic floating tech elements
- 📱 **Fully Responsive** - Perfect on mobile, tablet, and desktop
- 🌈 **Vibrant UI** - Modern glassmorphism design with gradients
- ⚡ **Lightning Fast** - Optimized Next.js 14 with React 18

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on http://localhost:8000

## 🛠️ Installation

1. Navigate to the frontend directory:
```bash
cd frontend-react
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser at http://localhost:3000

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Tech Stack

- **Framework**: Next.js 14 (React 18)
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **File Upload**: React Dropzone
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Icons**: Lucide React
- **Language**: TypeScript

## 📁 Project Structure

```
frontend-react/
├── app/
│   ├── components/
│   │   ├── FileUpload.tsx
│   │   ├── QueryForm.tsx
│   │   ├── AnswerDisplay.tsx
│   │   ├── ParallaxBackground.tsx
│   │   ├── Header.tsx
│   │   └── FeatureCards.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 🔗 API Integration

The frontend connects to these backend endpoints:

- `POST /api/upload` - Upload PDF files
- `POST /api/query` - Query documents with AI
- `GET /api/health` - Health check

Make sure your backend is running before starting the frontend.

## 🎯 Usage

1. **Upload Documents**: Drag and drop PDF files or click to browse
2. **Ask Questions**: Type your question in the query form
3. **Get Answers**: Receive AI-generated answers with source citations

## 🌟 Features in Detail

### Drag & Drop Upload
- Visual feedback on hover
- Progress bar during upload
- Success/error notifications
- Multiple file format validation

### Query Interface
- Adjustable context chunks (1-20)
- Real-time loading indicators
- Typing animation while processing
- Beautiful answer display

### UI/UX Enhancements
- Glassmorphism design
- Animated gradient backgrounds
- Parallax floating elements
- Smooth page transitions
- Hover effects and micro-interactions

## 🔥 Performance

- Server-side rendering with Next.js
- Optimized bundle size
- Lazy loading components
- Efficient re-renders with React 18

## 📝 License

Same as the main project

