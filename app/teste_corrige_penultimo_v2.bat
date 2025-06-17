@echo off
echo ================================================
echo TESTE - CORRIGINDO PENULTIMO COMMIT DO ALISSON v2
echo ================================================
echo.

echo Verificando os ultimos 2 commits:
git log -2 --oneline --format="%%h - %%an (%%ae) - %%s"
echo.

echo Verificando detalhes do penultimo commit:
git log -1 --skip=1 --format="Autor: %%an (%%ae)%%nData: %%cd%%nMensagem: %%s" --date=format:"%%d/%%m/%%Y %%H:%%M"
echo.

echo Alterando email de: alisson.levi@alunos.ufersa.edu.br
echo Para: franciscoalisson1998@gmail.com
echo APENAS no penultimo commit
echo.

echo Pressione qualquer tecla para continuar ou Ctrl+C para cancelar...
pause >nul

echo.
echo Executando correcao...
echo.

REM Salva a mensagem do ultimo commit (seu)
for /f "tokens=*" %%i in ('git log -1 --format^="%%s"') do set ULTIMO_MSG=%%i
echo Salvando seu ultimo commit: %ULTIMO_MSG%

REM Salva os arquivos modificados no ultimo commit
git diff HEAD~1 --name-only > temp_files.txt

REM Volta 1 commit (remove seu commit temporariamente)
git reset --soft HEAD~1

REM Agora o "ultimo" commit e o do Alisson - corrige ele
git commit --amend --author="AlissonDLevi <franciscoalisson1998@gmail.com>" --no-edit

REM Refaz seu commit
git add .
git commit -m "%ULTIMO_MSG%"

echo.
echo Verificando resultado:
git log -2 --oneline --format="%%h - %%an (%%ae) - %%s"

echo.
echo Enviando para o GitHub:
git push --force-with-lease origin main

REM Limpa arquivos temporarios
if exist temp_files.txt del temp_files.txt

echo.
echo *** TESTE CONCLUIDO! ***
echo Pressione qualquer tecla para sair...
pause >nul 