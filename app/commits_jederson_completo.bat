@echo off
echo ================================================
echo COMMITS COMPLETOS DO JEDERSONYAGO - SHARED
echo ================================================
echo.

REM FUNCAO PARA AGUARDAR HORARIO INTELIGENTE
goto start_commits

:wait_for_time
REM Pega horario atual
for /f "tokens=1-2 delims=:" %%a in ("%time%") do (
    set current_hour=%%a
    set current_minute=%%b
)
set current_hour=%current_hour: =%
set current_minute=%current_minute: =%

REM Calcula minutos totais (hora atual)
set /a current_total_minutes=(current_hour*60) + current_minute

REM Calcula minutos totais (hora alvo)  
set /a target_total_minutes=(target_hour*60) + target_minute

REM Calcula diferenca
set /a minutes_diff=target_total_minutes - current_total_minutes

REM Se ja passou da hora, executa imediatamente
if %minutes_diff% LEQ 0 (
    echo HORARIO JA PASSOU! Executando imediatamente...
    goto continue_commit
)

REM Se falta muito tempo, aguarda em chunks maiores
if %minutes_diff% GTR 30 (
    echo Faltam %minutes_diff% minutos para %target_hour%:%target_minute%... aguardando 10 minutos
    timeout /t 600 /nobreak >nul
    goto wait_for_time
)

REM Se falta tempo medio, aguarda em chunks menores  
if %minutes_diff% GTR 5 (
    echo Faltam %minutes_diff% minutos para %target_hour%:%target_minute%... aguardando 2 minutos
    timeout /t 120 /nobreak >nul
    goto wait_for_time
)

REM Se falta pouco tempo, aguarda em chunks pequenos
if %minutes_diff% GTR 0 (
    echo Faltam %minutes_diff% minutos para %target_hour%:%target_minute%... aguardando 30 segundos
    timeout /t 30 /nobreak >nul
    goto wait_for_time
)

:continue_commit
goto :eof

:start_commits

echo === SHARED - 5 COMMITS PROGRAMADOS ===
echo Dia 19/06 (Quinta) entre 15:30 e 17:15
echo.

REM COMMIT 1/5 - 15:32 (Dia 19/06 - Quinta)
echo === COMMIT 1/5 - AGUARDANDO 15:32 ===
set target_hour=15
set target_minute=32
call :wait_for_time

set GIT_AUTHOR_NAME=JedersonYago
set GIT_AUTHOR_EMAIL=jederson.yago@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=JedersonYago
set GIT_COMMITTER_EMAIL=jederson.yago@alunos.ufersa.edu.br
git add shared/constants/
git commit --date="2025-06-19 15:30:00 -0300" -m "feat(shared): implementa constantes compartilhadas"
git push origin main
echo *** COMMIT 1 REALIZADO E ENVIADO! ***
echo.

REM COMMIT 2/5 - 15:56
echo === COMMIT 2/5 - AGUARDANDO 15:56 ===
set target_hour=15
set target_minute=56
call :wait_for_time

set GIT_AUTHOR_NAME=JedersonYago
set GIT_AUTHOR_EMAIL=jederson.yago@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=JedersonYago
set GIT_COMMITTER_EMAIL=jederson.yago@alunos.ufersa.edu.br
git add shared/patterns/
git commit --date="2025-06-19 15:56:00 -0300" -m "feat(shared): adiciona padroes de validacao"
git push origin main
echo *** COMMIT 2 REALIZADO E ENVIADO! ***
echo.

REM COMMIT 3/5 - 16:22
echo === COMMIT 3/5 - AGUARDANDO 16:22 ===
set target_hour=16
set target_minute=22
call :wait_for_time

set GIT_AUTHOR_NAME=JedersonYago
set GIT_AUTHOR_EMAIL=jederson.yago@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=JedersonYago
set GIT_COMMITTER_EMAIL=jederson.yago@alunos.ufersa.edu.br
git add shared/types/
git commit --date="2025-06-19 16:22:00 -0300" -m "feat(shared): define tipos compartilhados"
git push origin main
echo *** COMMIT 3 REALIZADO E ENVIADO! ***
echo.

REM COMMIT 4/5 - 16:48
echo === COMMIT 4/5 - AGUARDANDO 16:48 ===
set target_hour=16
set target_minute=48
call :wait_for_time

set GIT_AUTHOR_NAME=JedersonYago
set GIT_AUTHOR_EMAIL=jederson.yago@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=JedersonYago
set GIT_COMMITTER_EMAIL=jederson.yago@alunos.ufersa.edu.br
git add shared/utils/
git commit --date="2025-06-19 16:48:00 -0300" -m "feat(shared): implementa utilitarios compartilhados"
git push origin main
echo *** COMMIT 4 REALIZADO E ENVIADO! ***
echo.

REM COMMIT 5/5 - 17:15
echo === COMMIT 5/5 - AGUARDANDO 17:15 ===
set target_hour=17
set target_minute=15
call :wait_for_time

set GIT_AUTHOR_NAME=JedersonYago
set GIT_AUTHOR_EMAIL=jederson.yago@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=JedersonYago
set GIT_COMMITTER_EMAIL=jederson.yago@alunos.ufersa.edu.br
git add shared/
git commit --date="2025-06-19 17:15:00 -0300" -m "refactor(shared): finaliza configuracao do modulo compartilhado"
git push origin main
echo *** COMMIT 5 REALIZADO E ENVIADO! ***
echo.

echo ================================================
echo   TODOS OS 5 COMMITS DO JEDERSONYAGO REALIZADOS!
echo   Modulo shared completo finalizado!
echo ================================================
echo.
echo === RESUMO DOS ULTIMOS COMMITS ===
git log --oneline -5 --format="%%cd - %%an - %%s" --date=format:"%%d/%%m/%%Y %%H:%%M"
echo.
echo *** SCRIPT FINALIZADO! ***
pause 