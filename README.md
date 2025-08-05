# ThinkThreads
ThinkThreads is your go-to fashion hub for stylish, sustainable, and thoughtfully curated clothing for every mood and moment. 
A full-stack MERN application with AI-powered customer support chatbot for ecommerce clothing websites.

## Features

- 🤖 AI-powered chatbot using Groq LLM
- 💬 Real-time conversation interface
- 📊 Database integration with ecommerce data
- 🔄 Conversation history management
- 📱 Responsive design
- 🐳 Docker containerization

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.8+ (for data loading)
- MongoDB (for local development)

1. Clone Repository
bash
- git clone <repository-url>
- cd ecommerce-chatbot


2. Environment Setup
bash
- cp .env.example .env

3. Run with Docker
bash
- docker-compose up --build


4. Load Sample Data
bash# 
- Copy your CSV files to backend/data/ folder
- docker-compose exec backend python scripts/load_data.py


5. Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: mongodb://localhost:27017

Local Development
Backend
bash
- cd backend
- npm install
- npm run dev


Frontend
bash
- cd frontend
- npm install
- npm start



Data Loading
bash
- cd backend
- pip install pandas pymongo
- python scripts/load_data.py




API Endpoints
* POST /api/chat - Send message to chatbot
* GET /api/conversations - Get conversation history
* GET /api/conversations/:id/messages - Get conversation messages

Technology Stack
Frontend: React, Tailwind CSS, Axios
Backend: Node.js, Express, MongoDB
AI: Groq LLM API
Database: MongoDB with Mongoose
Deployment: Docker, Docker Compose

Project Structure
See complete folder structure and code implementation above.
Contributing



