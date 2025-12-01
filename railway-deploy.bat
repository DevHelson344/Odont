@echo off
echo ========================================
echo   DEPLOY BACKEND NO RAILWAY
echo ========================================
echo.

echo Verificando Railway CLI...
where railway >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Railway CLI nao encontrado!
    echo.
    echo Instalando Railway CLI...
    npm install -g @railway/cli
    echo.
)

echo.
echo Fazendo login no Railway...
railway login

echo.
echo Inicializando projeto...
cd backend
railway init

echo.
echo Fazendo deploy...
railway up

echo.
echo ========================================
echo   DEPLOY CONCLUIDO!
echo ========================================
echo.
echo Agora:
echo 1. Acesse: https://railway.app/dashboard
echo 2. Abra seu projeto
echo 3. Va em Settings - Networking
echo 4. Clique em "Generate Domain"
echo 5. Copie a URL gerada
echo 6. Use essa URL na Vercel como VITE_API_URL
echo.
pause
