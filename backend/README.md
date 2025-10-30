# FastAPI Backend

This is a simple FastAPI application with basic endpoints.

## Setup

1. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Run the application:
   ```
   python run.py
   ```

## API Endpoints

- `GET /` - Welcome message
- `GET /text` - Simple text output
- `GET /items/{item_id}` - Get item by ID with optional query parameter
- `GET /health` - Health check endpoint

The API will be available at `http://localhost:8000`

## Development

The application uses uvicorn as the ASGI server with auto-reload enabled for development.