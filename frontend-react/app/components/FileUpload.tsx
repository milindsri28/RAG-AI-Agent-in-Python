'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileCheck, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface FileUploadProps {
  onUploadSuccess: (filename: string) => void;
}

export default function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState<string>('');
  const [uploadQueue, setUploadQueue] = useState<File[]>([]);
  const [totalFiles, setTotalFiles] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);

  const uploadSingleFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success(`✅ ${file.name} uploaded successfully!`);
      onUploadSuccess(file.name);
      return true;
    } catch (error: any) {
      toast.error(`Failed to upload ${file.name}: ${error.response?.data?.detail || error.message}`);
      return false;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadedCount(0);
    setTotalFiles(acceptedFiles.length);
    setUploadQueue(acceptedFiles);

    // Upload files sequentially
    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i];
      setCurrentFile(file.name);
      
      // Simulate progress for current file
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 15, 90));
      }, 150);

      await uploadSingleFile(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadedCount(i + 1);
      
      // Small delay between uploads
      await new Promise(resolve => setTimeout(resolve, 500));
      setUploadProgress(0);
    }

    // All uploads complete
    setTimeout(() => {
      setIsUploading(false);
      setUploadProgress(0);
      setCurrentFile('');
      setUploadQueue([]);
      setTotalFiles(0);
      setUploadedCount(0);
    }, 1000);
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: true,
    disabled: isUploading,
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass glass-hover rounded-2xl p-8 shine-effect group"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Upload Documents</h2>
          <p className="text-gray-500 text-sm font-mono">
            .pdf • max 10MB
          </p>
        </div>
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="text-4xl opacity-20 group-hover:opacity-40 transition-opacity"
        >
          📄
        </motion.div>
      </div>

      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-16 transition-all duration-500 cursor-pointer
          group/dropzone overflow-hidden
          ${isDragActive
            ? 'border-blue-500 bg-blue-500/10 scale-[1.02] shadow-lg shadow-blue-500/20'
            : 'border-zinc-800 bg-black/40 hover:border-blue-500/50 hover:bg-zinc-900/60 hover:shadow-xl'
          }
          ${isUploading ? 'pointer-events-none' : ''}
        `}
      >
        {/* Animated corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500/0 
                       group-hover/dropzone:border-blue-500/50 transition-all duration-500" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-500/0 
                       group-hover/dropzone:border-blue-500/50 transition-all duration-500" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-500/0 
                       group-hover/dropzone:border-blue-500/50 transition-all duration-500" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500/0 
                       group-hover/dropzone:border-blue-500/50 transition-all duration-500" />

        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                  className="w-20 h-20 mx-auto mb-6 border-4 border-zinc-800 border-t-blue-500 rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-blue-400" />
                </div>
              </div>

              <p className="text-lg font-semibold mb-2 text-gray-200">
                {totalFiles > 1 ? `Processing ${uploadedCount + 1} of ${totalFiles} Documents` : 'Processing Document'}
              </p>
              <p className="text-xs text-gray-500 font-mono mb-2 truncate max-w-md mx-auto">
                {currentFile}
              </p>
              <p className="text-xs text-gray-600 font-mono mb-4">
                Analyzing • Chunking • Embedding
              </p>

              <div className="w-full bg-zinc-900 rounded-lg h-3 overflow-hidden border border-zinc-800">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 
                           bg-[length:200%_100%]"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${uploadProgress}%`,
                    backgroundPosition: ['0% 0%', '200% 0%']
                  }}
                  transition={{
                    width: { duration: 0.3 },
                    backgroundPosition: { duration: 1.5, repeat: Infinity, ease: 'linear' }
                  }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500 font-mono">
                <span>{uploadProgress}%</span>
                {totalFiles > 1 && <span>{uploadedCount} completed</span>}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                animate={{
                  y: isDragActive ? [0, -15, 0] : [0, -10, 0],
                  scale: isDragActive ? 1.1 : 1
                }}
                transition={{
                  repeat: Infinity,
                  duration: isDragActive ? 1 : 2,
                  ease: 'easeInOut'
                }}
                className={`mb-6 ${isDragActive ? 'text-blue-400' : 'text-gray-600'} 
                           transition-colors duration-300`}
              >
                <Upload className="w-20 h-20 mx-auto" />
              </motion.div>

              {isDragActive ? (
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-blue-400">Release to Upload</p>
                  <p className="text-sm text-blue-400/60 font-mono">
                    Processing will begin automatically
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xl font-bold text-gray-200">
                    Drag & drop PDF documents
                  </p>
                  <p className="text-sm text-gray-500">
                    or <span className="text-blue-400 font-medium">click to browse</span>
                  </p>
                  <div className="flex justify-center gap-4 mt-4 text-xs text-gray-600 font-mono">
                    <span>Supports: PDF</span>
                    <span>•</span>
                    <span>Multiple files OK</span>
                    <span>•</span>
                    <span>Max: 10MB each</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

