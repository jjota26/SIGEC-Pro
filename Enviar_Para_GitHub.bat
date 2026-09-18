@echo off
chcp 65001 >nul
title Enviar SIGEC-Pro para o GitHub
echo ========================================================
echo   SIGEC-Pro - Envio do Codigo para o GitHub (jjota26)
echo ========================================================
echo.
cd /d "M:\Programa SIGEC-Pro"
echo A enviar para https://github.com/jjota26/SIGEC-Pro.git ...
echo.
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo   SUCESSO! O codigo foi enviado para o GitHub.
    echo ========================================================
) else (
    echo ========================================================
    echo   Ocorreu um erro ou a janela foi cancelada.
    echo ========================================================
)
echo.
pause
