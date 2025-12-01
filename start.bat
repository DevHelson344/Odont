@echo off
echo ========================================
echo   DentalCloud - Sistema Profissional
echo ========================================
echo.

echo [1/4] Instalando dependencias do backend...
cd backend
call npm install
if errorlevel 1 (
    echo ERRO: Falha ao instalar dependencias do backend
    pause
    exit /b 1
)

echo.
echo [2/4] Instalando dependencias do frontend...
cd ..\frontend
call npm install
if errorlevel 1 (
    echo ERRO: Falha ao instalar dependencias do frontend
    pause
    exit /b 1
)

echo.
echo [3/4] Iniciando backend...
cd ..\backend
start "DentalCloud Backend" cmd /k "npm run dev"
timeout /t 3 /nobreak > nul

echo.
echo [4/4] Iniciando frontend...
cd ..\frontend
start "DentalCloud Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   Sistema iniciado com sucesso!
echo ========================================
echo.
echo Backend API: http://localhost:3002
echo Frontend: http://localhost:3000
echo.
echo Pressione qualquer tecla para abrir o navegador...
pause > nul

start http://localhost:3000

echo.
echo Sistema rodando! Feche esta janela quando terminar.
pause
