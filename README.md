# DocuChat AI  
**AI-powered Document, Audio & Video Question Answering System (RAG-based)**

DocuChat AI allows users to upload documents (PDF), audio, or video files and ask natural language questions about their content.  
It uses **Retrieval Augmented Generation (RAG)** with vector embeddings to provide accurate, context-aware answers.

---

## Features

- **JWT-based Supabase Authentication** - Secure user authentication and authorization
- **Multi-format Support** - Upload PDF, audio (MP3, WAV), and video (MP4, AVI) files
- **Automatic Processing** - Intelligent file processing and content chunking
- **Semantic Search** - Vector-based retrieval with FAISS for accurate context
- **Interactive Chat** - Natural conversation with your document content
- **Timestamp Support** - For audio/video files with source timestamp references
- **Modern UI** - Clean, responsive React frontend with ShadCN components
- **Cloud Ready** - Dockerized backend compatible with cloud platforms
- **Context Grounding** - Answers are grounded in your actual document content

---

## How It Works

 - **User uploads a file** (PDF, audio, or video)
 - **File processing**:
   - **PDF** → Text extraction using PyPDF2/pdfplumber
   - **Audio/Video** → Transcription using Whisper/OpenAI
 - **Content chunking** → Split into semantically meaningful chunks
 - **Embedding generation** → Convert chunks to vector embeddings (OpenAI)
 - **Vector storage** → Store embeddings in FAISS vector database
 - **User asks question** → Question is converted to embedding
 - **Semantic search** → Find most relevant chunks from FAISS
 - **RAG generation** → Context + question sent to LLM (OpenAI)
 - **Answer delivery** → AI generates grounded answer with sources

---

## Tech Stack

### **Backend**
- **Python** - Core backend programming language
- **FastAPI** - Modern, fast framework
- **PostgreSQL** - Primary database
- **SQLAlchemy** - ORM for database operations
- **FAISS** - Vector similarity search (Facebook AI)
- **OpenAI API** - Embeddings and LLM generation
- **Docker** - Containerization
- **JWT** - Authentication tokens
- **PyPDF2/pytesseract/pdf2image/pillow** - PDF text extraction
- **Whisper** - Audio transcription

### **Frontend**
- **React** - UI library
- **Vite** - Build tool and dev server
- **JavaScript/ES6+** - Frontend language
- **Context API** - State management
- **ShadCN UI** - Component library
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Router** - Navigation
- **Vercel** - Deployment platform

---

## Project Structure

### **Complete Project Structure**
```
docuchat-ai/
│
├── backend/                          # FastAPI Backend
│   ├── app/
│   │   ├── main.py                   # FastAPI app entry point               
│   │   ├── deps.py                   
│   │   │
│   │   ├── routers/                  # API Routes
│   │   │   ├── auth.py               
│   │   │   ├── upload.py             
│   │   │   ├── process.py            
│   │   │   └── chat.py               
│   │   │
│   │   ├── services/                   
│   │   │   ├── chunking.py       
│   │   │   ├── chunk_service.py      
│   │   │   ├── embedding_service.py  
│   │   │   ├── rag_service.py  
│   │   │   ├── pdf_service.py
│   │   │   ├── vector_store.py         
│   │   │   └── whisper_service.py       
│   │   │
│   │   ├── db/                       # Database layer
│   │   │   ├── __init__.py
│   │   │   ├── database.py           # DB connection
│   │   │   └── models/               # SQLAlchemy models       
│   │   │       ├── file.py           
│   │   │       ├── chunk.py            
│   │   │
│   │   ├── utils/                    # Utilities
│   │       └── logger.py
│   │ 
│   │
│   ├── storage/                      # File storage
│   │   ├── uploads/                  # Original uploaded files
│   │
│   ├── tests/                        # Backend tests
│   │   ├── __init__.py
│   │   ├── test_auth.py
│   │   ├── test_upload.py
│   │   └── test_chat.py
│   │
│   ├── requirements.txt              
│   ├── Dockerfile                    
│   └── docker-compose.yml            
│
├── frontend/
│   └── src/
└── README.md                      
```

---

## Environment Variables

### **Backend (.env)**
```env
# Log Level
LOG_LEVEL=debug/info


# Database Sync
DB_SYNC=false/true

# Supabase Key
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_DB_URL
SUPABASE_ANON_KEY

# OpenAI Key
OPENAI_API_KEY
```

### **Frontend (.env)**
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000
```

---

## Quick Start (Docker)

### **1. Clone the Repository**
```bash
git clone https://github.com/idamodhar17/ai-multimodal-qa
cd ai-multimodal-qa
```

### **2. Configure Environment Variables**
- Backend Env
```bash
# Log Level
LOG_LEVEL=debug/info


# Database Sync
DB_SYNC=false/true

# Supabase Key
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_DB_URL
SUPABASE_ANON_KEY

# OpenAI Key
OPENAI_API_KEY
```

- Frontend Env
```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8000
```

### **3. Start with Docker Compose**
```bash
docker-compose up --build
```

### **4. Access the Application**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Database**: PostgreSQL on Supabase

---

## Manual Installation

### **Backend Setup**
```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
.env
# Edit .env with your configurations

# Set DB_SYNC true to sync tables in your DB

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### **Frontend Setup**
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Set up environment variables
.env.
# Edit .env.local with your configurations

# Start development server
npm run dev
```

---

## API Documentation

Once the backend is running, you can test API's in Postman as well

### **Main API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new user |
| POST | `/login` | User login |
| POST | `/upload/` | Upload file |
| POST | `/process/{file_id}` | Process uploaded file |
| POST | `/chat/` | Ask question about file |

---

## Testing

### **Backend Tests**
```bash
cd backend
pytest tests/ -v
```

---

### **Database (Cloud SQL)**
- Use Supabase PostgreSQL
- Set up connection
- Configure JWT Session and turn off Email Verification

---

## Configuration

### **Chunking Configuration**
```python
# In backend app/services/chunking.py
CHUNK_SETTINGS = {
    'chunk_size': int = 500,        # Characters per chunk
    'chunk_overlap': int = 50,      # Overlap between chunks
}
```

### **Embedding Configuration**
```python
EMBEDDING_SETTINGS = {
    'model': 'text-embedding-3-small',
}
```

---

## Author

**Damodhar Zanwar**  
📍 India 🇮🇳

### **Contact & Links**
- GitHub: [@idamodhar17](https://github.com/idamodhar17)
- LinkedIn: [Damodhar Zanwar](https://linkedin.com/in/damodhar-zanwar)
- Drive: [Drive] (https://drive.google.com/drive/folders/1rzqgu6hBzziLkUO4RgIbhMecRJCsbNg0?usp=sharing) 
- Vercel Link: [Vercel] (https://docuchat-ai-smoky.vercel.app) 
- GitHub: [GitHub] (https://github.com/idamodhar17/ai-multimodal-qa) 
---

## ⭐ Support

If you find this project useful, please give it a star on GitHub!


