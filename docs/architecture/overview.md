# Architecture Overview

## Project Structure
prompt-intelligence-platform/
├── frontend/       # React app — user interface
├── backend/        # Python FastAPI — API endpoints
├── docs/           # All documentation and specs
│   ├── specs/      # Feature specs (written before coding)
│   ├── adr/        # Architecture decisions
│   └── architecture/  # How the code is organized
├── .claude/        # Claude Code loop engineering files
│   ├── skills/     # How Claude does repeating tasks
│   ├── agents/     # Specialist reviewer agents
│   └── commands/   # Shortcut commands
└── AGENTS.md       # First file Claude Code reads

## How the app works
1. User pastes a prompt into the React frontend
2. Frontend sends it to FastAPI backend via HTTP
3. Backend sends it to Claude API for analysis
4. Results returned and displayed in the UI

## Key decisions
- React for modern UI and component reusability
- FastAPI for lightweight Python API with auto docs
- Claude Sonnet 4.6 for best balance of speed and quality