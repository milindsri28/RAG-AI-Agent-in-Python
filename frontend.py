"""
Frontend module for RAG application UI components.
Contains all Streamlit UI logic and presentation layer.
"""

import asyncio
import time
import streamlit as st
from services import InngestService, FileService, InngestAPIService


def configure_page():
    """Configure Streamlit page settings."""
    st.set_page_config(
        page_title="RAG AI Agent | PDF Intelligence", 
        page_icon="🤖", 
        layout="wide",
        initial_sidebar_state="collapsed"
    )
    
    # Custom CSS for million-dollar premium design
    st.markdown("""
        <style>
        /* Import premium fonts */
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        /* Animated gradient background */
        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }
        
        @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.5); }
            50% { box-shadow: 0 0 40px rgba(236, 72, 153, 0.8); }
        }
        
        @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
        }
        
        @keyframes parallaxFloat1 {
            0%, 100% { 
                transform: translate(0, 0) rotate(0deg);
            }
            25% { 
                transform: translate(20px, -30px) rotate(5deg);
            }
            50% { 
                transform: translate(-15px, -60px) rotate(-5deg);
            }
            75% { 
                transform: translate(-25px, -30px) rotate(3deg);
            }
        }
        
        @keyframes parallaxFloat2 {
            0%, 100% { 
                transform: translate(0, 0) rotate(0deg) scale(1);
            }
            33% { 
                transform: translate(-30px, 40px) rotate(-8deg) scale(1.1);
            }
            66% { 
                transform: translate(25px, 20px) rotate(8deg) scale(0.9);
            }
        }
        
        @keyframes parallaxFloat3 {
            0%, 100% { 
                transform: translate(0, 0) rotate(0deg);
            }
            50% { 
                transform: translate(15px, -50px) rotate(10deg);
            }
        }
        
        @keyframes parallaxSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        @keyframes parallaxPulse {
            0%, 100% { 
                opacity: 0.3;
                transform: scale(1);
            }
            50% { 
                opacity: 0.6;
                transform: scale(1.2);
            }
        }
        
        /* Global styles */
        * {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        /* Main container with rich animated background */
        .main {
            background: linear-gradient(-45deg, #0f0c29, #302b63, #24243e, #1a0e3e, #2d1b4e);
            background-size: 400% 400%;
            animation: gradientShift 15s ease infinite;
            color: #ffffff;
            position: relative;
            overflow-x: hidden;
        }
        
        /* Multiple layered animated particles */
        .main::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
                radial-gradient(circle at 15% 20%, rgba(139, 92, 246, 0.4) 0%, transparent 40%),
                radial-gradient(circle at 85% 30%, rgba(236, 72, 153, 0.35) 0%, transparent 45%),
                radial-gradient(circle at 50% 60%, rgba(99, 102, 241, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 20% 80%, rgba(168, 85, 247, 0.3) 0%, transparent 40%),
                radial-gradient(circle at 80% 85%, rgba(249, 115, 22, 0.25) 0%, transparent 45%),
                radial-gradient(circle at 45% 15%, rgba(59, 130, 246, 0.3) 0%, transparent 40%);
            pointer-events: none;
            z-index: 0;
            animation: float 8s ease-in-out infinite;
        }
        
        /* Additional glowing orbs layer */
        .main::after {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
                radial-gradient(ellipse at 10% 50%, rgba(124, 58, 237, 0.2) 0%, transparent 60%),
                radial-gradient(ellipse at 90% 50%, rgba(219, 39, 119, 0.2) 0%, transparent 60%),
                radial-gradient(ellipse at 50% 90%, rgba(139, 92, 246, 0.25) 0%, transparent 55%);
            pointer-events: none;
            z-index: 0;
            filter: blur(40px);
        }
        
        /* Parallax floating tech elements */
        .parallax-element {
            position: fixed;
            pointer-events: none;
            z-index: 1;
            font-size: 3rem;
            opacity: 0.15;
            filter: drop-shadow(0 0 20px rgba(167, 139, 250, 0.6));
            transition: transform 0.3s ease-out;
        }
        
        .parallax-tech-1 {
            top: 10%;
            left: 8%;
            animation: parallaxFloat1 20s ease-in-out infinite;
        }
        
        .parallax-tech-2 {
            top: 25%;
            right: 12%;
            animation: parallaxFloat2 25s ease-in-out infinite;
            animation-delay: -5s;
        }
        
        .parallax-tech-3 {
            top: 60%;
            left: 15%;
            animation: parallaxFloat3 18s ease-in-out infinite;
            animation-delay: -10s;
        }
        
        .parallax-tech-4 {
            top: 70%;
            right: 18%;
            animation: parallaxFloat1 22s ease-in-out infinite;
            animation-delay: -3s;
        }
        
        .parallax-tech-5 {
            top: 40%;
            left: 85%;
            animation: parallaxFloat2 19s ease-in-out infinite;
            animation-delay: -8s;
        }
        
        .parallax-tech-6 {
            top: 80%;
            left: 50%;
            animation: parallaxFloat3 24s ease-in-out infinite;
            animation-delay: -15s;
        }
        
        /* Geometric shapes */
        .parallax-shape {
            position: fixed;
            pointer-events: none;
            z-index: 1;
            opacity: 0.1;
            border: 2px solid rgba(167, 139, 250, 0.4);
        }
        
        .shape-circle {
            top: 15%;
            right: 25%;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            animation: parallaxSpin 30s linear infinite, parallaxPulse 4s ease-in-out infinite;
        }
        
        .shape-square {
            top: 50%;
            left: 5%;
            width: 80px;
            height: 80px;
            animation: parallaxFloat2 28s ease-in-out infinite, parallaxSpin 40s linear infinite reverse;
            animation-delay: -12s;
        }
        
        .shape-triangle {
            top: 35%;
            right: 8%;
            width: 0;
            height: 0;
            border-left: 50px solid transparent;
            border-right: 50px solid transparent;
            border-bottom: 90px solid rgba(236, 72, 153, 0.2);
            border: none;
            width: 90px;
            height: 90px;
            background: linear-gradient(135deg, transparent 50%, rgba(236, 72, 153, 0.2) 50%);
            animation: parallaxFloat1 26s ease-in-out infinite;
            animation-delay: -7s;
        }
        
        /* Premium header with animated gradient */
        .main-header {
            background: linear-gradient(120deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #ffd140 100%);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-size: 4rem;
            font-weight: 900;
            text-align: center;
            margin-bottom: 0.5rem;
            letter-spacing: -0.03em;
            animation: shimmer 3s linear infinite;
            font-family: 'Space Grotesk', sans-serif;
            text-shadow: 0 0 80px rgba(139, 92, 246, 0.5);
            filter: drop-shadow(0 0 30px rgba(236, 72, 153, 0.4));
        }
        
        .sub-header {
            text-align: center;
            background: linear-gradient(90deg, #a78bfa, #ec4899, #fbbf24);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-size: 1.3rem;
            margin-bottom: 4rem;
            font-weight: 500;
            letter-spacing: 0.05em;
            animation: float 3s ease-in-out infinite;
        }
        
        /* Premium section containers with rich glassmorphism */
        .section-container {
            background: linear-gradient(135deg, 
                rgba(139, 92, 246, 0.15), 
                rgba(99, 102, 241, 0.12), 
                rgba(236, 72, 153, 0.1));
            border: 1px solid rgba(167, 139, 250, 0.3);
            border-radius: 24px;
            padding: 2.5rem;
            margin: 2rem 0;
            backdrop-filter: blur(25px) saturate(200%);
            box-shadow: 
                0 8px 32px 0 rgba(139, 92, 246, 0.4),
                0 20px 60px rgba(236, 72, 153, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
        }
        
        .section-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, 
                transparent, 
                rgba(167, 139, 250, 0.3), 
                transparent);
            transition: left 0.5s;
        }
        
        .section-container:hover::before {
            left: 100%;
        }
        
        .section-container:hover {
            transform: translateY(-8px) scale(1.02);
            border-color: rgba(167, 139, 250, 0.6);
            box-shadow: 
                0 16px 48px rgba(139, 92, 246, 0.6),
                0 30px 90px rgba(236, 72, 153, 0.5),
                0 0 80px rgba(168, 85, 247, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        
        .section-title {
            background: linear-gradient(90deg, #a78bfa, #ec4899);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-family: 'Space Grotesk', sans-serif;
        }
        
        /* Premium form inputs */
        .stTextInput > div > div > input {
            background: linear-gradient(135deg, 
                rgba(139, 92, 246, 0.2), 
                rgba(99, 102, 241, 0.15));
            border: 1px solid rgba(167, 139, 250, 0.4);
            border-radius: 12px;
            color: #ffffff;
            padding: 1rem 1.25rem;
            font-size: 1.05rem;
            transition: all 0.3s ease;
            box-shadow: 
                0 4px 12px rgba(139, 92, 246, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        
        .stTextInput > div > div > input:focus {
            background: linear-gradient(135deg, 
                rgba(139, 92, 246, 0.3), 
                rgba(99, 102, 241, 0.25));
            border-color: rgba(167, 139, 250, 0.8);
            box-shadow: 
                0 0 30px rgba(167, 139, 250, 0.6), 
                0 8px 24px rgba(139, 92, 246, 0.5),
                0 0 60px rgba(236, 72, 153, 0.3);
            transform: translateY(-2px);
        }
        
        .stTextInput > div > div > input::placeholder {
            color: rgba(167, 139, 250, 0.5);
        }
        
        /* Premium gradient buttons */
        .stButton > button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            background-size: 200% auto;
            color: white;
            border: none;
            border-radius: 16px;
            padding: 1rem 3rem;
            font-weight: 700;
            font-size: 1.1rem;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 
                0 8px 24px rgba(102, 126, 234, 0.4),
                0 4px 12px rgba(118, 75, 162, 0.3);
            letter-spacing: 0.05em;
            text-transform: uppercase;
            position: relative;
            overflow: hidden;
        }
        
        .stButton > button::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent);
            transform: translateX(-100%);
            transition: transform 0.6s;
        }
        
        .stButton > button:hover::before {
            transform: translateX(100%);
        }
        
        .stButton > button:hover {
            transform: translateY(-4px) scale(1.05);
            background-position: right center;
            box-shadow: 
                0 12px 32px rgba(102, 126, 234, 0.6),
                0 8px 20px rgba(118, 75, 162, 0.5),
                0 0 40px rgba(240, 147, 251, 0.4);
        }
        
        .stButton > button:active {
            transform: translateY(-2px) scale(1.02);
        }
        
        /* Premium file uploader */
        .stFileUploader > div {
            background: linear-gradient(135deg, 
                rgba(139, 92, 246, 0.15), 
                rgba(99, 102, 241, 0.12),
                rgba(236, 72, 153, 0.1));
            border: 2px dashed rgba(167, 139, 250, 0.5);
            border-radius: 20px;
            padding: 3rem 2rem;
            transition: all 0.4s ease;
            position: relative;
            backdrop-filter: blur(15px);
            box-shadow: 
                0 8px 32px rgba(139, 92, 246, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        
        .stFileUploader > div::before {
            content: '✨';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 4rem;
            opacity: 0.2;
            transition: all 0.3s ease;
            text-shadow: 0 0 30px rgba(167, 139, 250, 0.8);
        }
        
        .stFileUploader > div:hover::before {
            opacity: 0.4;
            transform: translate(-50%, -50%) scale(1.2);
            text-shadow: 0 0 50px rgba(236, 72, 153, 1);
        }
        
        .stFileUploader > div:hover {
            background: linear-gradient(135deg, 
                rgba(139, 92, 246, 0.25), 
                rgba(99, 102, 241, 0.2),
                rgba(236, 72, 153, 0.15));
            border-color: rgba(167, 139, 250, 0.9);
            box-shadow: 
                0 12px 48px rgba(139, 92, 246, 0.5),
                0 0 60px rgba(236, 72, 153, 0.4);
            transform: scale(1.02);
        }
        
        /* Number input styling */
        .stNumberInput > div > div > input {
            background: linear-gradient(135deg, 
                rgba(139, 92, 246, 0.2), 
                rgba(99, 102, 241, 0.15));
            border: 1px solid rgba(167, 139, 250, 0.4);
            border-radius: 12px;
            color: #ffffff;
            padding: 0.75rem;
            transition: all 0.3s ease;
            box-shadow: 
                0 4px 12px rgba(139, 92, 246, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        
        .stNumberInput > div > div > input:focus {
            border-color: rgba(167, 139, 250, 0.8);
            box-shadow: 
                0 0 30px rgba(167, 139, 250, 0.6), 
                0 8px 24px rgba(139, 92, 246, 0.5);
            transform: translateY(-2px);
        }
        
        /* Premium success messages */
        .stSuccess {
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2));
            border: none;
            border-radius: 16px;
            padding: 1rem;
            color: #6ee7b7;
            box-shadow: 0 8px 24px rgba(16, 185, 129, 0.2);
            font-weight: 600;
        }
        
        /* Vibrant glowing divider */
        hr {
            border: none;
            height: 3px;
            background: linear-gradient(90deg, 
                transparent, 
                #a78bfa, 
                #ec4899, 
                #f97316, 
                #fbbf24, 
                transparent);
            margin: 4rem 0;
            box-shadow: 
                0 0 30px rgba(167, 139, 250, 0.8),
                0 0 60px rgba(236, 72, 153, 0.6);
            border-radius: 2px;
        }
        
        /* Premium answer box */
        .answer-box {
            background: linear-gradient(135deg, 
                rgba(139, 92, 246, 0.25), 
                rgba(99, 102, 241, 0.2),
                rgba(236, 72, 153, 0.15));
            border: 1px solid rgba(167, 139, 250, 0.4);
            border-left: 4px solid;
            border-image: linear-gradient(180deg, #a78bfa, #ec4899) 1;
            padding: 2rem;
            border-radius: 16px;
            margin: 1.5rem 0;
            color: #ffffff;
            font-size: 1.1rem;
            line-height: 1.8;
            box-shadow: 
                0 12px 40px rgba(139, 92, 246, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(15px);
            transition: all 0.3s ease;
        }
        
        .answer-box:hover {
            transform: translateX(8px);
            box-shadow: 
                0 16px 48px rgba(139, 92, 246, 0.6),
                0 0 80px rgba(236, 72, 153, 0.4);
        }
        
        /* Premium source items */
        .source-item {
            background: linear-gradient(135deg, 
                rgba(236, 72, 153, 0.25), 
                rgba(219, 39, 119, 0.2),
                rgba(168, 85, 247, 0.2));
            border: 1px solid rgba(236, 72, 153, 0.4);
            border-left: 3px solid #ec4899;
            padding: 1rem 1.5rem;
            margin: 0.75rem 0;
            border-radius: 12px;
            color: #fda4af;
            font-family: 'Space Grotesk', monospace;
            font-weight: 600;
            box-shadow: 
                0 8px 20px rgba(236, 72, 153, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }
        
        .source-item:hover {
            transform: translateX(8px);
            border-color: rgba(236, 72, 153, 0.8);
            box-shadow: 
                0 12px 32px rgba(236, 72, 153, 0.6),
                0 0 40px rgba(236, 72, 153, 0.4);
            background: linear-gradient(135deg, 
                rgba(236, 72, 153, 0.35), 
                rgba(219, 39, 119, 0.3),
                rgba(168, 85, 247, 0.25));
        }
        
        /* Premium spinner */
        .stSpinner > div {
            border-top-color: #a78bfa !important;
            border-right-color: #ec4899 !important;
        }
        
        /* Caption styling */
        .caption-text {
            color: #a78bfa;
            font-size: 0.95rem;
            margin-top: 1rem;
            text-align: center;
            font-weight: 500;
        }
        
        /* Hide Streamlit branding */
        #MainMenu {visibility: hidden;}
        footer {visibility: hidden;}
        header {visibility: hidden;}
        
        /* Scrollbar styling */
        ::-webkit-scrollbar {
            width: 12px;
        }
        
        ::-webkit-scrollbar-track {
            background: rgba(30, 30, 60, 0.5);
        }
        
        ::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #667eea, #764ba2);
            border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #764ba2, #f093fb);
        }
        
        /* ========================================
           RESPONSIVE DESIGN - MEDIA QUERIES
           ======================================== */
        
        /* Large Desktop (1440px+) */
        @media (min-width: 1440px) {
            .main-header {
                font-size: 5rem;
            }
            
            .sub-header {
                font-size: 1.5rem;
            }
            
            .section-container {
                padding: 3rem;
            }
        }
        
        /* Standard Desktop (1024px - 1439px) */
        @media (min-width: 1024px) and (max-width: 1439px) {
            .main-header {
                font-size: 3.5rem;
            }
            
            .sub-header {
                font-size: 1.2rem;
            }
        }
        
        /* Tablet (768px - 1023px) */
        @media (max-width: 1023px) {
            .main-header {
                font-size: 2.5rem;
                margin-bottom: 1rem;
            }
            
            .sub-header {
                font-size: 1rem;
                margin-bottom: 2rem;
            }
            
            .section-container {
                padding: 1.5rem;
                margin: 1rem 0;
            }
            
            .section-title {
                font-size: 1.4rem;
            }
            
            .stButton > button {
                padding: 0.875rem 2rem;
                font-size: 1rem;
            }
            
            .answer-box {
                padding: 1.5rem;
                font-size: 1rem;
            }
            
            .source-item {
                padding: 0.875rem 1.25rem;
                font-size: 0.9rem;
            }
        }
        
        /* Mobile Landscape & Small Tablet (576px - 767px) */
        @media (max-width: 767px) {
            .main-header {
                font-size: 2rem;
                margin-bottom: 0.75rem;
                letter-spacing: -0.02em;
            }
            
            .sub-header {
                font-size: 0.9rem;
                margin-bottom: 1.5rem;
                padding: 0 1rem;
            }
            
            .section-container {
                padding: 1.25rem;
                margin: 0.75rem 0;
                border-radius: 16px;
            }
            
            .section-title {
                font-size: 1.2rem;
                margin-bottom: 1rem;
            }
            
            .stTextInput > div > div > input {
                padding: 0.875rem 1rem;
                font-size: 1rem;
            }
            
            .stButton > button {
                padding: 0.75rem 1.5rem;
                font-size: 0.95rem;
                width: 100%;
            }
            
            .stFileUploader > div {
                padding: 2rem 1rem;
            }
            
            .stFileUploader > div::before {
                font-size: 3rem;
            }
            
            .answer-box {
                padding: 1.25rem;
                font-size: 0.95rem;
                line-height: 1.6;
            }
            
            .source-item {
                padding: 0.75rem 1rem;
                font-size: 0.85rem;
            }
            
            /* Stack footer cards vertically on mobile */
            .footer-cards {
                flex-direction: column !important;
                gap: 1rem !important;
            }
        }
        
        /* Mobile Portrait (320px - 575px) */
        @media (max-width: 575px) {
            * {
                font-size: 14px;
            }
            
            .main-header {
                font-size: 1.75rem;
                margin-bottom: 0.5rem;
            }
            
            .sub-header {
                font-size: 0.85rem;
                margin-bottom: 1.25rem;
                padding: 0 0.5rem;
            }
            
            .section-container {
                padding: 1rem;
                margin: 0.5rem 0;
                border-radius: 12px;
            }
            
            .section-title {
                font-size: 1.1rem;
                gap: 0.5rem;
            }
            
            .stTextInput > div > div > input {
                padding: 0.75rem 0.875rem;
                font-size: 0.95rem;
            }
            
            .stNumberInput > div > div > input {
                padding: 0.625rem;
                font-size: 0.9rem;
            }
            
            .stButton > button {
                padding: 0.625rem 1.25rem;
                font-size: 0.9rem;
                border-radius: 12px;
            }
            
            .stFileUploader > div {
                padding: 1.5rem 0.75rem;
            }
            
            .stFileUploader > div::before {
                font-size: 2.5rem;
            }
            
            .answer-box {
                padding: 1rem;
                font-size: 0.9rem;
                border-radius: 12px;
            }
            
            .source-item {
                padding: 0.625rem 0.875rem;
                font-size: 0.8rem;
                border-radius: 8px;
            }
            
            .caption-text {
                font-size: 0.8rem;
            }
            
            hr {
                margin: 2.5rem 0;
            }
        }
        
        /* Extra Small Mobile (< 375px) */
        @media (max-width: 374px) {
            .main-header {
                font-size: 1.5rem;
            }
            
            .sub-header {
                font-size: 0.75rem;
            }
            
            .section-container {
                padding: 0.875rem;
            }
            
            .section-title {
                font-size: 1rem;
            }
        }
        
        /* Utility class for responsive column adjustment */
        [data-testid="column"] {
            padding: 0.5rem !important;
        }
        
        @media (max-width: 767px) {
            [data-testid="column"] {
                padding: 0.25rem !important;
            }
        }
        </style>
    """, unsafe_allow_html=True)


def initialize_services():
    """Initialize and cache service instances."""
    if 'inngest_service' not in st.session_state:
        st.session_state.inngest_service = InngestService()
    if 'file_service' not in st.session_state:
        st.session_state.file_service = FileService()
    if 'api_service' not in st.session_state:
        st.session_state.api_service = InngestAPIService()


def render_pdf_upload_section():
    """Render the PDF upload section of the UI."""
    # Add parallax floating tech elements
    st.markdown("""
        <!-- Parallax Tech Icons -->
        <div class="parallax-element parallax-tech-1">💻</div>
        <div class="parallax-element parallax-tech-2">🤖</div>
        <div class="parallax-element parallax-tech-3">⚡</div>
        <div class="parallax-element parallax-tech-4">🚀</div>
        <div class="parallax-element parallax-tech-5">🧠</div>
        <div class="parallax-element parallax-tech-6">📊</div>
        
        <!-- Geometric Shapes -->
        <div class="parallax-shape shape-circle"></div>
        <div class="parallax-shape shape-square"></div>
        <div class="parallax-shape shape-triangle"></div>
    """, unsafe_allow_html=True)
    
    # Premium header with badge
    st.markdown("""
        <div style="text-align: center; margin-bottom: 2rem;">
            <div style="display: inline-block; background: linear-gradient(135deg, rgba(167, 139, 250, 0.2), rgba(236, 72, 153, 0.2)); 
                        border: none; border-radius: 50px; 
                        padding: 0.5rem 1.5rem; margin-bottom: 1rem; backdrop-filter: blur(10px);
                        box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);">
                <span style="background: linear-gradient(90deg, #a78bfa, #ec4899); 
                             -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                             font-weight: 700; font-size: 0.9rem; letter-spacing: 0.1em;">
                    ✨ POWERED BY AI ✨
                </span>
            </div>
        </div>
    """, unsafe_allow_html=True)
    
    st.markdown('<h1 class="main-header">🤖 RAG AI Agent</h1>', unsafe_allow_html=True)
    st.markdown('<p class="sub-header">⚡ Intelligent PDF Processing & Question Answering System ⚡</p>', unsafe_allow_html=True)
    
    # Responsive column layout: single column on mobile, 3 columns on desktop
    col1, col2, col3 = st.columns([0.5, 3, 0.5])
    
    with col2:
        st.markdown("""
            <div class="section-container">
                <div class="section-title">📤 Upload PDF Document</div>
                <p style="color: rgba(167, 139, 250, 0.8); margin-bottom: 1.5rem; font-size: 0.95rem;">
                    Upload your documents and let AI extract insights instantly
                </p>
            </div>
        """, unsafe_allow_html=True)
        
        uploaded = st.file_uploader(
            "Drop your PDF here or click to browse", 
            type=["pdf"], 
            accept_multiple_files=False,
            label_visibility="visible"
        )
        
        if uploaded is not None:
            handle_pdf_upload(uploaded)


def handle_pdf_upload(uploaded_file):
    """
    Handle PDF upload and ingestion.
    
    Args:
        uploaded_file: Uploaded file object from Streamlit
    """
    with st.spinner("🔄 Processing your document..."):
        # Save the uploaded file
        file_service = st.session_state.file_service
        path = file_service.save_uploaded_pdf(uploaded_file)
        
        # Send ingestion event
        inngest_service = st.session_state.inngest_service
        asyncio.run(inngest_service.send_ingest_event(path))
        
        # Small pause for user feedback continuity
        time.sleep(0.3)
    
    st.markdown(f"""
        <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2));
                    border: none; border-radius: 16px; padding: 1.5rem;
                    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.2); margin: 1.5rem 0;">
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="font-size: 2rem;">✅</div>
                <div>
                    <div style="color: #6ee7b7; font-weight: 700; font-size: 1.1rem; margin-bottom: 0.3rem;">
                        Successfully Ingested!
                    </div>
                    <div style="color: #6ee7b7; font-size: 0.95rem;">
                        {path.name}
                    </div>
                </div>
            </div>
        </div>
    """, unsafe_allow_html=True)
    st.markdown('<p class="caption-text">💡 Your document is ready! Ask questions below or upload more documents</p>', unsafe_allow_html=True)


def render_query_section():
    """Render the query section of the UI."""
    st.divider()
    
    # Responsive column layout: single column on mobile, 3 columns on desktop
    col1, col2, col3 = st.columns([0.5, 3, 0.5])
    
    with col2:
        st.markdown("""
            <div class="section-container">
                <div class="section-title">💬 Ask Your Question</div>
                <p style="color: rgba(167, 139, 250, 0.8); margin-bottom: 1.5rem; font-size: 0.95rem;">
                    Get intelligent answers powered by advanced RAG technology
                </p>
            </div>
        """, unsafe_allow_html=True)
        
        with st.form("rag_query_form"):
            question = st.text_input(
                "🔍 What would you like to know?",
                placeholder="e.g., What are the main findings in the document?",
                label_visibility="visible"
            )
            
            col_a, col_b = st.columns([3, 1])
            with col_b:
                top_k = st.number_input(
                    "📊 Context chunks", 
                    min_value=1, 
                    max_value=20, 
                    value=5, 
                    step=1,
                    help="Number of relevant document chunks to retrieve"
                )
            
            st.markdown("<br>", unsafe_allow_html=True)
            submitted = st.form_submit_button("🚀 Generate Answer", use_container_width=True)
            
            if submitted and question.strip():
                handle_query_submission(question.strip(), int(top_k))


def handle_query_submission(question: str, top_k: int):
    """
    Handle query form submission.
    
    Args:
        question: User's question
        top_k: Number of chunks to retrieve
    """
    with st.spinner("🧠 AI is thinking... Analyzing documents and generating response"):
        try:
            # Send query event
            inngest_service = st.session_state.inngest_service
            event_id = asyncio.run(inngest_service.send_query_event(question, top_k))
            
            # Poll for results
            api_service = st.session_state.api_service
            output = api_service.wait_for_run_output(event_id)
            
            answer = output.get("answer", "")
            sources = output.get("sources", [])
            
            # Display results
            display_query_results(answer, sources)
            
        except Exception as e:
            st.error(f"❌ Error processing query: {str(e)}")


def display_query_results(answer: str, sources: list):
    """
    Display query results.
    
    Args:
        answer: Generated answer text
        sources: List of source documents
    """
    # Responsive result container: single column on mobile, 3 columns on desktop
    col1, col2, col3 = st.columns([0.5, 3, 0.5])
    
    with col2:
        # Answer section with custom styling
        st.markdown("""
            <div class="section-container">
                <div class="section-title">✨ AI Response</div>
            </div>
        """, unsafe_allow_html=True)
        
        if answer:
            st.markdown(f"""
                <div class="answer-box">
                    {answer}
                </div>
            """, unsafe_allow_html=True)
        else:
            st.markdown("""
                <div class="answer-box">
                    ⚠️ No answer generated. Please try rephrasing your question or upload more documents.
                </div>
            """, unsafe_allow_html=True)
        
        # Sources section
        if sources:
            st.markdown("<br>", unsafe_allow_html=True)
            st.markdown("""
                <div class="section-container">
                    <div class="section-title">📚 Source Documents</div>
                </div>
            """, unsafe_allow_html=True)
            
            for source in sources:
                st.markdown(f"""
                    <div class="source-item">
                        📄 {source}
                    </div>
                """, unsafe_allow_html=True)


def render_premium_footer():
    """Render premium footer with branding."""
    st.markdown("""
        <div style="margin-top: 6rem; padding: 3rem 0; text-align: center; border-top: 1px solid rgba(167, 139, 250, 0.2);">
            <div style="margin-bottom: 1.5rem;">
                <div class="footer-cards" style="display: inline-flex; gap: 2rem; align-items: center; justify-content: center; flex-wrap: wrap;">
                    <div style="background: linear-gradient(135deg, rgba(167, 139, 250, 0.15), rgba(236, 72, 153, 0.15));
                                border: none; border-radius: 12px; padding: 1rem 1.5rem;
                                backdrop-filter: blur(10px); box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
                                min-width: 140px;">
                        <div style="font-size: 1.5rem; margin-bottom: 0.3rem;">⚡</div>
                        <div style="color: #a78bfa; font-weight: 600; font-size: 0.85rem;">Lightning Fast</div>
                    </div>
                    <div style="background: linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(167, 139, 250, 0.15));
                                border: none; border-radius: 12px; padding: 1rem 1.5rem;
                                backdrop-filter: blur(10px); box-shadow: 0 4px 12px rgba(236, 72, 153, 0.2);
                                min-width: 140px;">
                        <div style="font-size: 1.5rem; margin-bottom: 0.3rem;">🔒</div>
                        <div style="color: #ec4899; font-weight: 600; font-size: 0.85rem;">Secure & Private</div>
                    </div>
                    <div style="background: linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(236, 72, 153, 0.15));
                                border: none; border-radius: 12px; padding: 1rem 1.5rem;
                                backdrop-filter: blur(10px); box-shadow: 0 4px 12px rgba(251, 191, 36, 0.2);
                                min-width: 140px;">
                        <div style="font-size: 1.5rem; margin-bottom: 0.3rem;">🎯</div>
                        <div style="color: #fbbf24; font-weight: 600; font-size: 0.85rem;">Highly Accurate</div>
                    </div>
                </div>
            </div>
            <div style="margin-top: 2rem; color: rgba(167, 139, 250, 0.6); font-size: 0.9rem; font-weight: 500; padding: 0 1rem;">
                Powered by Advanced RAG Technology & OpenAI
            </div>
            <div style="margin-top: 0.5rem; padding: 0 1rem;">
                <span style="background: linear-gradient(90deg, #667eea, #764ba2, #f093fb);
                             -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                             font-weight: 700; font-size: 0.85rem;">
                    Built with ❤️ using Inngest & Qdrant
                </span>
            </div>
        </div>
    """, unsafe_allow_html=True)


def render_app():
    """Main function to render the complete application UI."""
    configure_page()
    initialize_services()
    render_pdf_upload_section()
    render_query_section()
    render_premium_footer()
    
    # Add parallax JavaScript for interactive effects
    st.markdown("""
        <script>
        // Parallax mouse movement effect
        document.addEventListener('mousemove', (e) => {
            const elements = document.querySelectorAll('.parallax-element, .parallax-shape');
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            elements.forEach((el, index) => {
                const speed = (index + 1) * 0.5;
                const x = (mouseX - 0.5) * speed * 30;
                const y = (mouseY - 0.5) * speed * 30;
                
                const currentTransform = window.getComputedStyle(el).transform;
                if (currentTransform === 'none') {
                    el.style.transform = `translate(${x}px, ${y}px)`;
                }
            });
        });
        
        // Parallax scroll effect
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const parallaxElements = document.querySelectorAll('.parallax-element');
                    
                    parallaxElements.forEach((el, index) => {
                        const speed = (index % 3 + 1) * 0.2;
                        const yPos = -(scrolled * speed);
                        
                        const rect = el.getBoundingClientRect();
                        const elementTop = rect.top + scrolled;
                        const offset = (scrolled - elementTop) * speed;
                        
                        el.style.transform = `translateY(${offset}px)`;
                    });
                    
                    ticking = false;
                });
                ticking = true;
            }
        });
        </script>
    """, unsafe_allow_html=True)

