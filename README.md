# Edora: Mini-Services Full-Stack Application

A lightweight, batteries-included starter for building micro-style services with FastAPI, React, Redis, Docker Compose, and more.

---

## Quickstart

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/edora.git
   cd edora
Create your .env

Copy .env.example to .env (or create a new one) in the project root and fill in your values:

ini
Copy
Edit
DATABASE_URL=sqlite+aiosqlite:///./data/app.db
REDIS_URL=redis://redis:6379/0
JWT_SECRET=your-super-secret-key

# Optional mail settings
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=username
SMTP_PASSWORD=password
EMAIL_FROM=notify@example.com
Install dependencies

<details> <summary>Backend</summary>
macOS

bash
Copy
Edit
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
Windows (PowerShell)

powershell
Copy
Edit
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt
</details> <details> <summary>Frontend (macOS & Windows)</summary>
bash
Copy
Edit
cd frontend
npm install
cd ..
</details>
Build & start all services

bash
Copy
Edit
docker compose up --build
Verify

Service	URL
API docs (Swagger UI)	http://localhost:8000/docs
Health check	http://localhost:8000/health
React UI	http://localhost:3000

Prerequisites
You’ll need the following installed:

Tool	macOS Installation	Windows Installation
Git	brew install git or download from git-scm.com	choco install git or download MSI
Docker (Engine & Compose)	brew install --cask docker then launch Docker.app	Docker Desktop (enable WSL2/Hyper-V)
Python 3.10+	brew install python@3.10 or python.org installer	python.org installer (check “Add to PATH”)
Node.js 18+ & npm	brew install node@18 or nodejs.org installer	nodejs.org installer or choco install nodejs
Terminal	Terminal.app or iTerm2	PowerShell, Git Bash, or Windows Terminal

Verify your setup:

bash
Copy
Edit
git --version
docker version
python3 --version
node --version
npm --version
Architecture
Backend: FastAPI + SQLModel, Redis RQ for background jobs, SQLite (dev)

Frontend: React + Vite + TailwindCSS

Orchestration: Docker Compose

Production static/media: Nginx

Project Structure
text
Copy
Edit
edora/
├── .env
├── docker-compose.yml
├── requirements.txt
├── app/             # FastAPI backend
│   ├── Dockerfile
│   ├── main.py
│   └── ...          # routers/, models/, alembic/, etc.
└── frontend/        # React + Vite client
    ├── Dockerfile
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        └── ...      # components, pages, styles
Environment Variables (reference)
Duplicate of the snippet above for quick lookup:

ini
Copy
Edit
DATABASE_URL=sqlite+aiosqlite:///./data/app.db
REDIS_URL=redis://redis:6379/0
JWT_SECRET=your-super-secret-key

# Optional mail settings
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=username
SMTP_PASSWORD=password
EMAIL_FROM=notify@example.com
Setup & Installation
Backend (dev)
Create and activate a virtual environment, then install requirements:

macOS

bash
Copy
Edit
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Dev helpers
pip install \
  pytest pytest-asyncio httpx coverage \
  black isort mypy flake8 pre-commit
Regenerate requirements.txt when adding packages:

bash
Copy
Edit
pip freeze > requirements.txt
Windows (PowerShell)

powershell
Copy
Edit
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt

pip install `
  pytest pytest-asyncio httpx coverage `
  black isort mypy flake8 pre-commit

pip freeze > requirements.txt
Frontend (dev)
bash
Copy
Edit
cd frontend
npm install
cd ..
Running with Docker Compose
From the project root:

bash
Copy
Edit
docker compose up --build
This starts:

Service	Port
redis	6379
api	8000
frontend	3000

Accessing the Application
API docs (Swagger UI): http://localhost:8000/docs

Health check: http://localhost:8000/health

React UI: http://localhost:3000

Development
Task	Command
Run tests	pytest
Lint & format	flake8 && black .
Rebuild Docker	bash<br>docker compose down<br>docker compose up --build<br>

Troubleshooting
Issue	Resolution
.env not found	Ensure .env exists in the project root.
Port conflicts	Verify ports 8000, 3000, 6379 are free.
File watching issues on Windows	CHOKIDAR_USEPOLLING=true is enabled in Docker Compose.
macOS permission errors	Grant Docker Desktop filesystem access in System Settings → Privacy & Security → Files and Folders.