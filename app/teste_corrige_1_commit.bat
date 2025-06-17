@echo off
echo ================================================
echo TESTE - CORRIGINDO APENAS 1 COMMIT DO ALISSON
echo ================================================
echo.

echo Verificando o ultimo commit atual:
git log -1 --format="Autor: %%an (%%ae)%%nData: %%cd%%nMensagem: %%s" --date=format:"%%d/%%m/%%Y %%H:%%M"
echo.

echo Alterando email de: alisson.levi@alunos.ufersa.edu.br
echo Para: franciscoalisson1998@gmail.com
echo APENAS no ultimo commit
echo.

echo Pressione qualquer tecla para continuar ou Ctrl+C para cancelar...
pause >nul

echo.
echo Executando correcao do ultimo commit...
echo.

REM Primeiro verifica se o ultimo commit e do Alisson
for /f "tokens=*" %%i in ('git log -1 --format="%%ae"') do set LAST_EMAIL=%%i

if "%LAST_EMAIL%" == "alisson.levi@alunos.ufersa.edu.br" (
    echo Ultimo commit e do Alisson - corrigindo...
    git commit --amend --author="AlissonDLevi <franciscoalisson1998@gmail.com>" --no-edit
    echo.
    echo Verificando o commit corrigido:
    git log -1 --format="Autor: %%an (%%ae)%%nData: %%cd%%nMensagem: %%s" --date=format:"%%d/%%m/%%Y %%H:%%M"
    echo.
    echo Enviando para o GitHub:
    git push --force-with-lease origin main
    echo *** TESTE CONCLUIDO COM SUCESSO! ***
) else (
    echo O ultimo commit NAO e do Alisson (email: %LAST_EMAIL%)
    echo Nenhuma alteracao foi feita.
)

echo.
echo Pressione qualquer tecla para sair...
pause >nul 