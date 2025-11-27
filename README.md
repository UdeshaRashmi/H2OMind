# H2OMind

## Getting Started

### Backend API
1. `cd backend`
2. `npm install`
3. `npm run dev` (starts the Express server on port 4000)

The API persists data in `backend/data/db.json`. You can change the storage path or port by creating a `.env` file inside `backend/` and setting:

```
PORT=4000
DATA_FILE=E:\path\to\db.json
SALT_ROUNDS=10
```

### Frontend
1. From the project root run `npm install`
2. `npm run dev` (starts Vite on port 5173)

Set `VITE_API_URL` in a root `.env` file if your backend runs on a different host/port. By default the frontend targets `http://localhost:4000/api`.