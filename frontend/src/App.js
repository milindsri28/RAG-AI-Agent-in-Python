import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  MessageCircle, 
  Sun, 
  Moon, 
  CheckCircle, 
  Loader, 
  Send,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import axios from 'axios';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
const INNGEST_URL = process.env.REACT_APP_INNGEST_URL || 'http://127.0.0.1:8288/v1';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [question, setQuestion] = useState('');
  const [topK, setTopK] = useState(5);
  const [isQuerying, setIsQuerying] = useState(false);
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleFileUpload = async (file) => {
    if (!file || file.type !== 'application/pdf') {
      alert('Please select a PDF file');
      return;
    }

    setIsUploading(true);
    setUploadedFile(file);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Upload file to backend
      const response = await axios.post(`${BACKEND_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Trigger ingestion event
      await axios.post(`${BACKEND_URL}/api/ingest`, {
        pdf_path: response.data.file_path,
        source_id: file.name,
      });

      setUploadComplete(true);
      setTimeout(() => {
        setCurrentStep(2);
        setIsUploading(false);
      }, 1500);

    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsQuerying(true);
    setAnswer('');
    setSources([]);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/query`, {
        question: question.trim(),
        top_k: parseInt(topK),
      });

      const eventId = response.data.event_id;
      
      // Poll for results
      const pollForResults = async () => {
        try {
          const resultResponse = await axios.get(`${INNGEST_URL}/events/${eventId}/runs`);
          const runs = resultResponse.data.data || [];
          
          if (runs.length > 0) {
            const run = runs[0];
            const status = run.status;
            
            if (['Completed', 'Succeeded', 'Success', 'Finished'].includes(status)) {
              const output = run.output || {};
              setAnswer(output.answer || 'No answer generated');
              setSources(output.sources || []);
              setIsQuerying(false);
            } else if (['Failed', 'Cancelled'].includes(status)) {
              throw new Error(`Query failed: ${status}`);
            } else {
              setTimeout(pollForResults, 1000);
            }
          } else {
            setTimeout(pollForResults, 1000);
          }
        } catch (error) {
          console.error('Polling error:', error);
          setTimeout(pollForResults, 1000);
        }
      };

      pollForResults();

    } catch (error) {
      console.error('Query failed:', error);
      alert('Query failed. Please try again.');
      setIsQuerying(false);
    }
  };

  const resetApp = () => {
    setCurrentStep(1);
    setUploadedFile(null);
    setUploadComplete(false);
    setQuestion('');
    setAnswer('');
    setSources([]);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'dark bg-dark-bg' : 'bg-gray-50'
    }`}>
      {/* Parallax Background */}
      <div className="fixed inset-0 parallax-bg">
        <div className="floating-shapes">
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
        </div>
      </div>

      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-10 p-6"
      >
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg glass-effect">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">RAG PDF Assistant</h1>
              <p className="text-white/80 text-sm">Ask questions about your documents</p>
            </div>
          </div>
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 bg-white/20 rounded-lg glass-effect hover:bg-white/30 transition-colors"
            data-testid="theme-toggle"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-white" />
            ) : (
              <Moon className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Progress Steps */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full glass-effect ${
                currentStep >= 1 ? 'bg-green-500/20 text-white' : 'bg-white/10 text-white/60'
              }`}>
                {uploadComplete ? <CheckCircle className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                <span className="font-medium">Upload PDF</span>
              </div>
              
              <ArrowRight className="w-5 h-5 text-white/60" />
              
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full glass-effect ${
                currentStep >= 2 ? 'bg-blue-500/20 text-white' : 'bg-white/10 text-white/60'
              }`}>
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">Ask Questions</span>
              </div>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                className="glass-effect rounded-2xl p-8 backdrop-blur-lg"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ 
                      y: isUploading ? 0 : [-10, 10, -10],
                      rotate: isUploading ? 360 : 0 
                    }}
                    transition={{ 
                      duration: isUploading ? 2 : 3,
                      repeat: isUploading ? Infinity : Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-24 h-24 mx-auto mb-6 bg-white/20 rounded-2xl flex items-center justify-center"
                  >
                    {isUploading ? (
                      <Loader className="w-12 h-12 text-white animate-spin" />
                    ) : uploadComplete ? (
                      <CheckCircle className="w-12 h-12 text-green-400" />
                    ) : (
                      <Upload className="w-12 h-12 text-white" />
                    )}
                  </motion.div>

                  <h2 className="text-3xl font-bold text-white mb-4">
                    {isUploading ? 'Processing...' : uploadComplete ? 'Upload Complete!' : 'Upload Your PDF'}
                  </h2>
                  
                  <p className="text-white/80 mb-8">
                    {isUploading 
                      ? 'Your document is being processed and indexed...' 
                      : uploadComplete 
                      ? 'Ready to answer your questions!'
                      : 'Drop your PDF here or click to browse'
                    }
                  </p>

                  {!isUploading && !uploadComplete && (
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      className={`border-2 border-dashed rounded-xl p-12 transition-all duration-300 cursor-pointer hover:border-white/60 ${
                        dragOver ? 'border-white bg-white/10 scale-105' : 'border-white/40'
                      }`}
                      data-testid="file-drop-zone"
                    >
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Sparkles className="w-8 h-8 text-white/60 mx-auto mb-4" />
                        <p className="text-white/80">
                          Drag and drop your PDF here, or{' '}
                          <span className="text-blue-300 underline">click to browse</span>
                        </p>
                      </label>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="question"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="space-y-6"
              >
                {/* File Info */}
                <div className="glass-effect rounded-xl p-4 backdrop-blur-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-green-400" />
                    <span className="text-white font-medium">{uploadedFile?.name}</span>
                    <button
                      onClick={resetApp}
                      className="ml-auto text-white/60 hover:text-white transition-colors"
                      data-testid="upload-new-file"
                    >
                      Upload New File
                    </button>
                  </div>
                </div>

                {/* Question Form */}
                <div className="glass-effect rounded-2xl p-8 backdrop-blur-lg">
                  <h2 className="text-2xl font-bold text-white mb-6">Ask Your Question</h2>
                  
                  <form onSubmit={handleQuestion} className="space-y-4">
                    <div>
                      <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="What would you like to know about this document?"
                        className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all resize-none"
                        rows="4"
                        data-testid="question-input"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <label className="text-white/80 text-sm">Retrieve:</label>
                        <select
                          value={topK}
                          onChange={(e) => setTopK(e.target.value)}
                          className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
                          data-testid="top-k-select"
                        >
                          {[1,2,3,4,5,10,15,20].map(num => (
                            <option key={num} value={num} className="bg-gray-800">{num} chunks</option>
                          ))}
                        </select>
                      </div>
                      
                      <button
                        type="submit"
                        disabled={!question.trim() || isQuerying}
                        className="flex items-center space-x-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
                        data-testid="ask-question-btn"
                      >
                        {isQuerying ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Ask Question</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Answer Display */}
                {(answer || isQuerying) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-effect rounded-2xl p-8 backdrop-blur-lg"
                  >
                    <h3 className="text-xl font-bold text-white mb-4">Answer</h3>
                    
                    {isQuerying ? (
                      <div className="flex items-center space-x-3 text-white/80">
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Generating answer...</span>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-white leading-relaxed" data-testid="answer-text">
                          {answer}
                        </div>
                        
                        {sources.length > 0 && (
                          <div>
                            <h4 className="text-white/80 font-medium mb-2">Sources:</h4>
                            <ul className="space-y-1" data-testid="answer-sources">
                              {sources.map((source, index) => (
                                <li key={index} className="text-white/60 text-sm">
                                  • {source}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default App;