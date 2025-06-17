@echo off
echo ================================================
echo TESTE - CORRIGINDO PENULTIMO COMMIT DO ALISSON
echo ================================================
echo.

echo Verificando os ultimos 2 commits:
git log -2 --format="%%h - %%an (%%ae) - %%s" --oneline
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
echo Executando correcao do penultimo commit...
echo.

REM Pega o email do penultimo commit
for /f "tokens=*" %%i in ('git log -1 --skip=1 --format^=%%ae') do set PENULTIMO_EMAIL=%%i

echo Email do penultimo commit: %PENULTIMO_EMAIL%
echo.

if "%PENULTIMO_EMAIL%" == "alisson.levi@alunos.ufersa.edu.br" (
    echo Penultimo commit e do Alisson - corrigindo...
    echo.
    
    REM Faz rebase interativo para corrigir o penultimo commit
    echo Criando script temporario para rebase...
    echo pick HEAD~1 > temp_rebase.txt
    echo edit HEAD~0 >> temp_rebase.txt
    
    REM Executa o rebase
    git rebase -i HEAD~2 --exec "git commit --amend --author='AlissonDLevi <franciscoalisson1998@gmail.com>' --no-edit" HEAD~1^
    
    echo.
    echo Verificando o commit corrigido:
    git log -1 --skip=1 --format="Autor: %%an (%%ae)%%nData: %%cd%%nMensagem: %%s" --date=format:"%%d/%%m/%%Y %%H:%%M"
    echo.
    echo Enviando para o GitHub:
    git push --force-with-lease origin main
    echo *** TESTE CONCLUIDO COM SUCESSO! ***
) else (
    echo O penultimo commit NAO e do Alisson (email: %PENULTIMO_EMAIL%)
    echo Nenhuma alteracao foi feita.
)

echo.
echo Pressione qualquer tecla para sair...
pause >nul 