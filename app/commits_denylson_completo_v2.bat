@echo off
echo =============================================
echo COMMITS COMPLETOS DO DENYLSON - BACKEND v2
echo =============================================
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

echo === COMMIT 1 e 2 JA REALIZADOS ===
echo 17:35 - chore(backend): atualiza dependencias e configuracoes
echo 18:00 - feat(config): implementa sistema de configuracao modular
echo.

REM COMMIT 3/15 - 18:47
echo === COMMIT 3/15 - AGUARDANDO 18:47 ===
set target_hour=18
set target_minute=47
call :wait_for_time

set GIT_AUTHOR_NAME=Denylson
set GIT_AUTHOR_EMAIL=denylson.feitoza@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=Denylson
set GIT_COMMITTER_EMAIL=denylson.feitoza@alunos.ufersa.edu.br
git add backend/src/config/database.ts backend/src/config/reservation.ts
git commit --date="2025-06-15 18:47:00 -0300" -m "refactor(config): melhora configuracao de reservas"
git push origin main
echo *** COMMIT 3 REALIZADO E ENVIADO! ***
echo.

REM COMMIT 4/15 - 19:25
echo === COMMIT 4/15 - AGUARDANDO 19:25 ===
set target_hour=19
set target_minute=25
call :wait_for_time

set GIT_AUTHOR_NAME=Denylson
set GIT_AUTHOR_EMAIL=denylson.feitoza@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=Denylson
set GIT_COMMITTER_EMAIL=denylson.feitoza@alunos.ufersa.edu.br
git add backend/src/middlewares/auth.ts backend/src/middlewares/security.ts backend/src/middlewares/validateSchema.ts
git rm backend/src/middlewares/validate.ts
git commit --date="2025-06-15 19:25:00 -0300" -m "refactor(middlewares): melhora middlewares e remove arquivo obsoleto"
git push origin main
echo *** COMMIT 4 REALIZADO E ENVIADO! ***
echo.

REM COMMIT 5/15 - 19:57
echo === COMMIT 5/15 - AGUARDANDO 19:57 ===
set target_hour=19
set target_minute=57
call :wait_for_time

set GIT_AUTHOR_NAME=Denylson
set GIT_AUTHOR_EMAIL=denylson.feitoza@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=Denylson
set GIT_COMMITTER_EMAIL=denylson.feitoza@alunos.ufersa.edu.br
git add backend/src/controllers/authController.ts backend/src/controllers/configController.ts backend/src/controllers/reservationController.ts backend/src/controllers/tableController.ts
git commit --date="2025-06-15 19:57:00 -0300" -m "refactor(controllers): atualiza controllers existentes"
git push origin main
echo *** COMMIT 5 REALIZADO E ENVIADO! ***
echo.

REM COMMIT 6/15 - 20:18
echo === COMMIT 6/15 - AGUARDANDO 20:18 ===
set target_hour=20
set target_minute=18
call :wait_for_time

set GIT_AUTHOR_NAME=Denylson
set GIT_AUTHOR_EMAIL=denylson.feitoza@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=Denylson
set GIT_COMMITTER_EMAIL=denylson.feitoza@alunos.ufersa.edu.br
git add backend/src/controllers/profileController.ts
git commit --date="2025-06-15 20:18:00 -0300" -m "feat(profile): adiciona sistema de perfil de usuario"
git push origin main
echo *** COMMIT 6 REALIZADO E ENVIADO! ***
echo.

REM COMMIT 7/15 - 20:44
echo === COMMIT 7/15 - AGUARDANDO 20:44 ===
set target_hour=20
set target_minute=44
call :wait_for_time

set GIT_AUTHOR_NAME=Denylson
set GIT_AUTHOR_EMAIL=denylson.feitoza@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=Denylson
set GIT_COMMITTER_EMAIL=denylson.feitoza@alunos.ufersa.edu.br
git add backend/src/models/Config.ts backend/src/models/Reservation.ts backend/src/models/Table.ts backend/src/models/User.ts
git commit --date="2025-06-15 20:44:00 -0300" -m "refactor(models): atualiza modelos de dados"
git push origin main
echo *** COMMIT 7 REALIZADO E ENVIADO! ***
echo.

REM COMMIT 8/15 - 21:09
echo === COMMIT 8/15 - AGUARDANDO 21:09 ===
set target_hour=21
set target_minute=9
call :wait_for_time

set GIT_AUTHOR_NAME=Denylson
set GIT_AUTHOR_EMAIL=denylson.feitoza@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=Denylson
set GIT_COMMITTER_EMAIL=denylson.feitoza@alunos.ufersa.edu.br
git add backend/src/routes/authRoutes.ts backend/src/routes/configRoutes.ts backend/src/routes/index.ts backend/src/routes/reservationRoutes.ts backend/src/routes/tableRoutes.ts
git commit --date="2025-06-15 21:09:00 -0300" -m "refactor(routes): melhora roteamento existente"
git push origin main
echo *** COMMIT 8 REALIZADO E ENVIADO! ***
echo.

REM COMMIT 9/15 - 21:33
echo === COMMIT 9/15 - AGUARDANDO 21:33 ===
set target_hour=21
set target_minute=33
call :wait_for_time

set GIT_AUTHOR_NAME=Denylson
set GIT_AUTHOR_EMAIL=denylson.feitoza@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=Denylson
set GIT_COMMITTER_EMAIL=denylson.feitoza@alunos.ufersa.edu.br
git add backend/src/routes/profileRoutes.ts
git commit --date="2025-06-15 21:33:00 -0300" -m "feat(routes): adiciona rotas de perfil"
git push origin main
echo *** COMMIT 9 REALIZADO E ENVIADO! ***
echo.

REM COMMIT 10/15 - 21:56
echo === COMMIT 10/15 - AGUARDANDO 21:56 ===
set target_hour=21
set target_minute=56
call :wait_for_time

set GIT_AUTHOR_NAME=Denylson
set GIT_AUTHOR_EMAIL=denylson.feitoza@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=Denylson
set GIT_COMMITTER_EMAIL=denylson.feitoza@alunos.ufersa.edu.br
git add backend/src/services/
git commit --date="2025-06-15 21:56:00 -0300" -m "feat(services): implementa novos servicos"
git push origin main
echo *** COMMIT 10 REALIZADO E ENVIADO! ***
echo.

REM COMMIT 11/15 - 22:21
echo === COMMIT 11/15 - AGUARDANDO 22:21 ===
set target_hour=22
set target_minute=21
call :wait_for_time

set GIT_AUTHOR_NAME=Denylson
set GIT_AUTHOR_EMAIL=denylson.feitoza@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=Denylson
set GIT_COMMITTER_EMAIL=denylson.feitoza@alunos.ufersa.edu.br
git rm backend/src/types/custom.d.ts
git add backend/src/types/reservation.d.ts backend/src/types/table.d.ts
git commit --date="2025-06-15 22:21:00 -0300" -m "refactor(types): reorganiza tipos e remove arquivo obsoleto"
git push origin main
echo *** COMMIT 11 REALIZADO E ENVIADO! ***
echo.

REM COMMIT 12/15 - 22:38
echo === COMMIT 12/15 - AGUARDANDO 22:38 ===
set target_hour=22
set target_minute=38
call :wait_for_time

set GIT_AUTHOR_NAME=Denylson
set GIT_AUTHOR_EMAIL=denylson.feitoza@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=Denylson
set GIT_COMMITTER_EMAIL=denylson.feitoza@alunos.ufersa.edu.br
git add backend/src/utils/jwt.ts backend/src/utils/reservationUtils.ts
git commit --date="2025-06-15 22:38:00 -0300" -m "refactor(utils): melhora utilitarios existentes"
git push origin main
echo *** COMMIT 12 REALIZADO E ENVIADO! ***
echo.

REM COMMIT 13/15 - 23:10
echo === COMMIT 13/15 - AGUARDANDO 23:10 ===
set target_hour=23
set target_minute=10
call :wait_for_time

set GIT_AUTHOR_NAME=Denylson
set GIT_AUTHOR_EMAIL=denylson.feitoza@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=Denylson
set GIT_COMMITTER_EMAIL=denylson.feitoza@alunos.ufersa.edu.br
git add backend/src/utils/configUtils.ts backend/src/utils/dateUtils.ts backend/src/config/validationPatterns.ts
git commit --date="2025-06-15 23:10:00 -0300" -m "feat(utils): adiciona novos utilitarios"
git push origin main
echo *** COMMIT 13 REALIZADO E ENVIADO! ***
echo.

REM COMMIT 14/15 - 23:12
echo === COMMIT 14/15 - AGUARDANDO 23:12 ===
set target_hour=23
set target_minute=12
call :wait_for_time

set GIT_AUTHOR_NAME=Denylson
set GIT_AUTHOR_EMAIL=denylson.feitoza@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=Denylson
set GIT_COMMITTER_EMAIL=denylson.feitoza@alunos.ufersa.edu.br
git add backend/src/validations/schemas.ts
git commit --date="2025-06-15 23:12:00 -0300" -m "refactor(validations): atualiza schemas de validacao"
git push origin main
echo *** COMMIT 14 REALIZADO E ENVIADO! ***
echo.

REM COMMIT 15/15 - 23:15
echo === COMMIT 15/15 - AGUARDANDO 23:15 ===
set target_hour=23
set target_minute=15
call :wait_for_time

set GIT_AUTHOR_NAME=Denylson
set GIT_AUTHOR_EMAIL=denylson.feitoza@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=Denylson
set GIT_COMMITTER_EMAIL=denylson.feitoza@alunos.ufersa.edu.br
git add backend/src/index.ts
git commit --date="2025-06-15 23:15:00 -0300" -m "refactor(backend): configura servidor principal"
git push origin main
echo *** COMMIT 15 REALIZADO E ENVIADO! ***
echo.

echo =============================================
echo   TODOS OS 15 COMMITS REALIZADOS COM SUCESSO!
echo   Backend completo do Denylson finalizado!
echo =============================================
echo.
echo === RESUMO DOS ULTIMOS COMMITS ===
git log --oneline -15 --format="%%cd - %%an - %%s" --date=format:"%%d/%%m/%%Y %%H:%%M"
echo.
echo *** SCRIPT FINALIZADO! ***
pause 