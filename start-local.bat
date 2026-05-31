@echo off
REM Start both backend and frontend for local testing
REM Run this from the project root directory

echo.
echo ========================================
echo   EXPIRY GO - LOCAL STARTUP SCRIPT
echo ========================================
echo.

REM Start Backend in one terminal
echo [1/2] Starting Backend on http://localhost:8000...
start cmd /k "cd backend && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

REM Wait a moment for backend to start
timeout /t 3 /nobreak

REM Start Frontend in another terminal
echo [2/2] Starting Frontend on http://localhost:3000...
start cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   ✅ BOTH SERVICES STARTED
echo ========================================
echo.
echo Frontend:  http://localhost:3000
echo Backend:   http://localhost:8000
echo API Docs:  http://localhost:8000/docs
echo.
echo 📝 Test Logins:
echo   Shops:    shop1@test.com, shop2@test.com, shop3@test.com
echo   Customer: customer@test.com
echo   Password: password123
echo.
echo Close the terminal windows to stop the services.
echo.
pause
