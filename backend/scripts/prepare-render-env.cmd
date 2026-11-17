@echo off
REM Lance prepare_render_env.ps1 en contournant la policy d'execution locale.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0prepare_render_env.ps1" %*
