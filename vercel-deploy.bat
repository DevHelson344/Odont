@echo off
echo ========================================
echo   DEPLOY FRONTEND NA VERCEL
echo ========================================
echo.

echo Verificando Vercel CLI...
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Vercel CLI nao encontrado!
    echo.
    echo Instalando Vercel CLI...
    npm install -g vercel
    echo.
)

echo.
echo Fazendo login na Vercel...
vercel login

echo.
echo Fazendo deploy do frontend...
cd frontend
vercel

echo.
echo ========================================
echo   DEPLOY CONCLUIDO!
echo ========================================
echo.
echo Agora:
echo 1. Copie a URL gerada pela Vercel
echo 2. Va em: https://vercel.com/dashboard
echo 3. Abra seu projeto
echo 4. Va em Settings - Environment Variables
echo 5. Adicione: VITE_API_URL = URL_DO_RAILWAY
echo 6. Faca Redeploy
echo.
echo Para deploy em producao, execute:
echo   cd frontend
echo   vercel --prod
echo.
pause
