@echo off
chcp 65001 > nul
echo =======================================================
echo    Sincronizacao SIGEC-Pro -> Hugging Face
echo =======================================================
python "%~dp0sincronizar.py"
echo =======================================================
pause
