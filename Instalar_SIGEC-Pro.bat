@echo off
chcp 65001 >nul
title SIGEC-Pro - Instalador Local no Computador

echo ========================================================
echo       SIGEC-Pro - Instalacao no Disco do Computador
echo       Jose Centurio
echo ========================================================
echo.
echo A iniciar o assistente grafico de instalacao seguro...
start "" "%~dp0Instalar-SIGEC-Pro.exe"
exit