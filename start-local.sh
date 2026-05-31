#!/bin/bash
# Start both backend and frontend for local testing
# Run this from the project root directory

echo ""
echo "========================================"
echo "   EXPIRY GO - LOCAL STARTUP SCRIPT"
echo "========================================"
echo ""

# Start Backend
echo "[1/2] Starting Backend on http://localhost:8000..."
(cd backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000) &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start Frontend
echo "[2/2] Starting Frontend on http://localhost:3000..."
(cd frontend && npm run dev) &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo "   ✅ BOTH SERVICES STARTED"
echo "========================================"
echo ""
echo "Frontend:  http://localhost:3000"
echo "Backend:   http://localhost:8000"
echo "API Docs:  http://localhost:8000/docs"
echo ""
echo "📝 Test Logins:"
echo "   Shops:    shop1@test.com, shop2@test.com, shop3@test.com"
echo "   Customer: customer@test.com"
echo "   Password: password123"
echo ""
echo "Press Ctrl+C to stop both services"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
