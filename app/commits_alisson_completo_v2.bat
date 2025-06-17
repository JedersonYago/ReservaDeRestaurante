@echo off
echo ================================================
echo COMMITS COMPLETOS DO ALISSONDLEVI - FRONTEND v2
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

echo === FRONTEND - 20 COMMITS PROGRAMADOS ===
echo Hoje 17/06 (Terca) entre 13:25 e 15:40 (UFERSA)
echo.

REM COMMIT 1/20 - 13:28
echo === COMMIT 1/20 - AGUARDANDO 13:28 ===
set target_hour=13
set target_minute=28
call :wait_for_time

set GIT_AUTHOR_NAME=AlissonDLevi
set GIT_AUTHOR_EMAIL=alisson.levi@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=AlissonDLevi
set GIT_COMMITTER_EMAIL=alisson.levi@alunos.ufersa.edu.br
git add frontend/src/components/Button/index.tsx
git commit --date="2025-06-17 13:28:00 -0300" -m "refactor(button): melhora componente de botao"
git push origin main
echo *** COMMIT 1 REALIZADO E ENVIADO! ***
echo.

REM COMMIT 2/20 - 13:32
echo === COMMIT 2/20 - AGUARDANDO 13:32 ===
set target_hour=13
set target_minute=32
call :wait_for_time

set GIT_AUTHOR_NAME=AlissonDLevi
set GIT_AUTHOR_EMAIL=alisson.levi@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=AlissonDLevi
set GIT_COMMITTER_EMAIL=alisson.levi@alunos.ufersa.edu.br
git add frontend/src/components/Input/
git commit --date="2025-06-17 13:32:00 -0300" -m "feat(input): adiciona componente de input"
git push origin main
echo *** COMMIT 2 REALIZADO E ENVIADO! ***
echo.

REM COMMIT 3/20 - 13:38
echo === COMMIT 3/20 - AGUARDANDO 13:38 ===
set target_hour=13
set target_minute=38
call :wait_for_time

set GIT_AUTHOR_NAME=AlissonDLevi
set GIT_AUTHOR_EMAIL=alisson.levi@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=AlissonDLevi
set GIT_COMMITTER_EMAIL=alisson.levi@alunos.ufersa.edu.br
git add frontend/src/components/Modal/
git commit --date="2025-06-17 13:38:00 -0300" -m "feat(modal): implementa sistema de modais"
git push origin main
echo *** COMMIT 3 REALIZADO E ENVIADO! ***
echo.

REM COMMIT 4/20 - 13:45
echo === COMMIT 4/20 - AGUARDANDO 13:45 ===
set target_hour=13
set target_minute=45
call :wait_for_time

set GIT_AUTHOR_NAME=AlissonDLevi
set GIT_AUTHOR_EMAIL=alisson.levi@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=AlissonDLevi
set GIT_COMMITTER_EMAIL=alisson.levi@alunos.ufersa.edu.br
git add frontend/src/components/Select/
git commit --date="2025-06-17 13:45:00 -0300" -m "feat(select): adiciona componente de selecao"
git push origin main
echo *** COMMIT 4 REALIZADO E ENVIADO! ***
echo.

REM COMMIT 5/20 - 13:51
echo === COMMIT 5/20 - AGUARDANDO 13:51 ===
set target_hour=13
set target_minute=51
call :wait_for_time

set GIT_AUTHOR_NAME=AlissonDLevi
set GIT_AUTHOR_EMAIL=alisson.levi@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=AlissonDLevi
set GIT_COMMITTER_EMAIL=alisson.levi@alunos.ufersa.edu.br
git add frontend/src/components/StatusBadge/
git commit --date="2025-06-17 13:51:00 -0300" -m "feat(badge): implementa badges de status"
git push origin main
echo *** COMMIT 5 REALIZADO E ENVIADO! ***
echo.

REM COMMIT 6/20 - 13:57
echo === COMMIT 6/20 - AGUARDANDO 13:57 ===
set target_hour=13
set target_minute=57
call :wait_for_time

set GIT_AUTHOR_NAME=AlissonDLevi
set GIT_AUTHOR_EMAIL=alisson.levi@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=AlissonDLevi
set GIT_COMMITTER_EMAIL=alisson.levi@alunos.ufersa.edu.br
git add frontend/src/components/TableCard/index.tsx
git commit --date="2025-06-17 13:57:00 -0300" -m "refactor(table-card): melhora componente de mesa"
git push origin main
echo *** COMMIT 6 REALIZADO E ENVIADO! ***
echo.

REM COMMIT 7/20 - 14:04
echo === COMMIT 7/20 - AGUARDANDO 14:04 ===
set target_hour=14
set target_minute=4
call :wait_for_time

set GIT_AUTHOR_NAME=AlissonDLevi
set GIT_AUTHOR_EMAIL=alisson.levi@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=AlissonDLevi
set GIT_COMMITTER_EMAIL=alisson.levi@alunos.ufersa.edu.br
git add frontend/src/components/TimeRangeInput/
git commit --date="2025-06-17 14:04:00 -0300" -m "feat(time-range): adiciona seletor de horario"
git push origin main
echo *** COMMIT 7 REALIZADO E ENVIADO! ***
echo.

REM COMMIT 8/20 - 14:10
echo === COMMIT 8/20 - AGUARDANDO 14:10 ===
set target_hour=14
set target_minute=10
call :wait_for_time

set GIT_AUTHOR_NAME=AlissonDLevi
set GIT_AUTHOR_EMAIL=alisson.levi@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=AlissonDLevi
set GIT_COMMITTER_EMAIL=alisson.levi@alunos.ufersa.edu.br
git add frontend/src/components/Header.tsx frontend/src/components/ProtectedLayout.tsx frontend/src/components/ProtectedRoute.tsx
git commit --date="2025-06-17 14:10:00 -0300" -m "feat(layout): implementa sistema de layout e protecao"
git push origin main
echo *** COMMIT 8 REALIZADO E ENVIADO! ***
echo.

REM COMMIT 9/20 - 14:17
echo === COMMIT 9/20 - AGUARDANDO 14:17 ===
set target_hour=14
set target_minute=17
call :wait_for_time

set GIT_AUTHOR_NAME=AlissonDLevi
set GIT_AUTHOR_EMAIL=alisson.levi@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=AlissonDLevi
set GIT_COMMITTER_EMAIL=alisson.levi@alunos.ufersa.edu.br
git add frontend/src/hooks/useAuth.ts
git commit --date="2025-06-17 14:17:00 -0300" -m "feat(auth): implementa hook de autenticacao"
git push origin main
echo *** COMMIT 9 REALIZADO E ENVIADO! ***
echo.

REM COMMIT 10/20 - 14:23
echo === COMMIT 10/20 - AGUARDANDO 14:23 ===
set target_hour=14
set target_minute=23
call :wait_for_time

set GIT_AUTHOR_NAME=AlissonDLevi
set GIT_AUTHOR_EMAIL=alisson.levi@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=AlissonDLevi
set GIT_COMMITTER_EMAIL=alisson.levi@alunos.ufersa.edu.br
git add frontend/src/hooks/useConfig.ts
git commit --date="2025-06-17 14:23:00 -0300" -m "feat(config): adiciona hook de configuracao"
git push origin main
echo *** COMMIT 10 REALIZADO E ENVIADO! ***
echo.

REM COMMIT 11/20 - 14:29
echo === COMMIT 11/20 - AGUARDANDO 14:29 ===
set target_hour=14
set target_minute=29
call :wait_for_time

set GIT_AUTHOR_NAME=AlissonDLevi
set GIT_AUTHOR_EMAIL=alisson.levi@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=AlissonDLevi
set GIT_COMMITTER_EMAIL=alisson.levi@alunos.ufersa.edu.br
git add frontend/src/hooks/useReservationValidation.ts
git commit --date="2025-06-17 14:29:00 -0300" -m "refactor(validation): melhora validacao de reservas"
git push origin main
echo *** COMMIT 11 REALIZADO E ENVIADO! ***
echo.

REM COMMIT 12/20 - 14:36
echo === COMMIT 12/20 - AGUARDANDO 14:36 ===
set target_hour=14
set target_minute=36
call :wait_for_time

set GIT_AUTHOR_NAME=AlissonDLevi
set GIT_AUTHOR_EMAIL=alisson.levi@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=AlissonDLevi
set GIT_COMMITTER_EMAIL=alisson.levi@alunos.ufersa.edu.br
git add frontend/src/hooks/useReservations.ts
git commit --date="2025-06-17 14:36:00 -0300" -m "refactor(reservations): melhora hook de reservas"
git push origin main
echo *** COMMIT 12 REALIZADO E ENVIADO! ***
echo.

REM COMMIT 13/20 - 14:42
echo === COMMIT 13/20 - AGUARDANDO 14:42 ===
set target_hour=14
set target_minute=42
call :wait_for_time

set GIT_AUTHOR_NAME=AlissonDLevi
set GIT_AUTHOR_EMAIL=alisson.levi@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=AlissonDLevi
set GIT_COMMITTER_EMAIL=alisson.levi@alunos.ufersa.edu.br
git add frontend/src/hooks/useTables.ts
git commit --date="2025-06-17 14:42:00 -0300" -m "refactor(tables): melhora hook de mesas"
git push origin main
echo *** COMMIT 13 REALIZADO E ENVIADO! ***
echo.

REM COMMIT 14/20 - 14:48
echo === COMMIT 14/20 - AGUARDANDO 14:48 ===
set target_hour=14
set target_minute=48
call :wait_for_time

set GIT_AUTHOR_NAME=AlissonDLevi
set GIT_AUTHOR_EMAIL=alisson.levi@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=AlissonDLevi
set GIT_COMMITTER_EMAIL=alisson.levi@alunos.ufersa.edu.br
git add frontend/src/pages/Home/index.tsx
git commit --date="2025-06-17 14:48:00 -0300" -m "refactor(home): melhora pagina inicial"
git push origin main
echo *** COMMIT 14 REALIZADO E ENVIADO! ***
echo.

REM COMMIT 15/20 - 14:55
echo === COMMIT 15/20 - AGUARDANDO 14:55 ===
set target_hour=14
set target_minute=55
call :wait_for_time

set GIT_AUTHOR_NAME=AlissonDLevi
set GIT_AUTHOR_EMAIL=alisson.levi@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=AlissonDLevi
set GIT_COMMITTER_EMAIL=alisson.levi@alunos.ufersa.edu.br
git add frontend/src/pages/Login/index.tsx
git commit --date="2025-06-17 14:55:00 -0300" -m "refactor(login): melhora pagina de login"
git push origin main
echo *** COMMIT 15 REALIZADO E ENVIADO! ***
echo.

REM COMMIT 16/20 - 15:01
echo === COMMIT 16/20 - AGUARDANDO 15:01 ===
set target_hour=15
set target_minute=1
call :wait_for_time

set GIT_AUTHOR_NAME=AlissonDLevi
set GIT_AUTHOR_EMAIL=alisson.levi@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=AlissonDLevi
set GIT_COMMITTER_EMAIL=alisson.levi@alunos.ufersa.edu.br
git add frontend/src/pages/Register/index.tsx
git commit --date="2025-06-17 15:01:00 -0300" -m "refactor(register): melhora pagina de registro"
git push origin main
echo *** COMMIT 16 REALIZADO E ENVIADO! ***
echo.

REM COMMIT 17/20 - 15:08
echo === COMMIT 17/20 - AGUARDANDO 15:08 ===
set target_hour=15
set target_minute=8
call :wait_for_time

set GIT_AUTHOR_NAME=AlissonDLevi
set GIT_AUTHOR_EMAIL=alisson.levi@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=AlissonDLevi
set GIT_COMMITTER_EMAIL=alisson.levi@alunos.ufersa.edu.br
git add frontend/src/pages/Profile/
git commit --date="2025-06-17 15:08:00 -0300" -m "feat(profile): implementa pagina de perfil"
git push origin main
echo *** COMMIT 17 REALIZADO E ENVIADO! ***
echo.

REM COMMIT 18/20 - 15:14
echo === COMMIT 18/20 - AGUARDANDO 15:14 ===
set target_hour=15
set target_minute=14
call :wait_for_time

set GIT_AUTHOR_NAME=AlissonDLevi
set GIT_AUTHOR_EMAIL=alisson.levi@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=AlissonDLevi
set GIT_COMMITTER_EMAIL=alisson.levi@alunos.ufersa.edu.br
git add frontend/src/pages/Reservations/index.tsx frontend/src/pages/Reservations/Details/index.tsx frontend/src/pages/Reservations/New/index.tsx frontend/src/pages/Reservations/Details/styles.ts frontend/src/pages/Reservations/New/styles.tsx frontend/src/pages/Reservations/styles.ts
git commit --date="2025-06-17 15:14:00 -0300" -m "refactor(reservations): melhora sistema de reservas"
git push origin main
echo *** COMMIT 18 REALIZADO E ENVIADO! ***
echo.

REM COMMIT 19/20 - 15:20
echo === COMMIT 19/20 - AGUARDANDO 15:20 ===
set target_hour=15
set target_minute=20
call :wait_for_time

set GIT_AUTHOR_NAME=AlissonDLevi
set GIT_AUTHOR_EMAIL=alisson.levi@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=AlissonDLevi
set GIT_COMMITTER_EMAIL=alisson.levi@alunos.ufersa.edu.br
git add frontend/src/pages/Settings/
git commit --date="2025-06-17 15:20:00 -0300" -m "feat(settings): implementa pagina de configuracoes"
git push origin main
echo *** COMMIT 19 REALIZADO E ENVIADO! ***
echo.

REM COMMIT 20/20 - 15:27
echo === COMMIT 20/20 - AGUARDANDO 15:27 ===
set target_hour=15
set target_minute=27
call :wait_for_time

set GIT_AUTHOR_NAME=AlissonDLevi
set GIT_AUTHOR_EMAIL=alisson.levi@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=AlissonDLevi
set GIT_COMMITTER_EMAIL=alisson.levi@alunos.ufersa.edu.br
git add frontend/src/pages/Tables/index.tsx frontend/src/pages/Tables/Details/index.tsx frontend/src/pages/Tables/New/index.tsx frontend/src/pages/Tables/Edit/ frontend/src/pages/Tables/styles.tsx
git commit --date="2025-06-17 15:27:00 -0300" -m "refactor(tables): melhora sistema de mesas"
git push origin main
echo *** COMMIT 20 REALIZADO E ENVIADO! ***
echo.

REM COMMIT ADICIONAL - FINALIZACAO - 15:33
echo === COMMIT ADICIONAL - FINALIZACAO - AGUARDANDO 15:33 ===
set target_hour=15
set target_minute=33
call :wait_for_time

set GIT_AUTHOR_NAME=AlissonDLevi
set GIT_AUTHOR_EMAIL=alisson.levi@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=AlissonDLevi
set GIT_COMMITTER_EMAIL=alisson.levi@alunos.ufersa.edu.br
git add frontend/src/routes/index.tsx frontend/src/schemas/auth.ts frontend/src/schemas/reservation.ts frontend/src/services/api.ts frontend/src/services/authService.ts frontend/src/services/profileService.ts frontend/src/services/reservationService.ts frontend/src/services/tableService.ts
git commit --date="2025-06-17 15:33:00 -0300" -m "refactor(services): melhora servicos e rotas"
git push origin main
echo *** COMMIT ADICIONAL REALIZADO E ENVIADO! ***
echo.

REM COMMIT FINAL - TIPOS E CONFIGS - 15:40
echo === COMMIT FINAL - TIPOS E CONFIGS - AGUARDANDO 15:40 ===
set target_hour=15
set target_minute=40
call :wait_for_time

set GIT_AUTHOR_NAME=AlissonDLevi
set GIT_AUTHOR_EMAIL=alisson.levi@alunos.ufersa.edu.br
set GIT_COMMITTER_NAME=AlissonDLevi
set GIT_COMMITTER_EMAIL=alisson.levi@alunos.ufersa.edu.br
git add frontend/src/types/config.ts frontend/src/types/index.ts frontend/src/types/reservation.ts frontend/src/types/table.ts frontend/src/types/user.ts frontend/src/utils/ frontend/src/App.tsx frontend/src/main.tsx frontend/tsconfig.app.json frontend/tsconfig.node.json frontend/vite.config.ts
git commit --date="2025-06-17 15:40:00 -0300" -m "refactor(types): finaliza tipagem e configuracoes"
git push origin main
echo *** COMMIT FINAL REALIZADO E ENVIADO! ***
echo.

echo ================================================
echo TODOS OS COMMITS DO ALISSONDLEVI FORAM ENVIADOS!
echo ================================================
echo Frontend completo: 22 commits entre 13:25 e 15:40
echo Pressione qualquer tecla para sair...
pause >nul 