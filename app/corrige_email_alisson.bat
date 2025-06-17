@echo off
echo ================================================
echo CORRIGINDO EMAIL DO ALISSONDLEVI NOS COMMITS
echo ================================================
echo.

echo Alterando email de: alisson.levi@alunos.ufersa.edu.br
echo Para: franciscoalisson1998@gmail.com
echo.

echo ATENCAO: Este processo ira reescrever o historico do Git!
echo Pressione qualquer tecla para continuar ou Ctrl+C para cancelar...
pause >nul

echo.
echo Executando correcao dos commits...
echo.

git filter-branch -f --env-filter "
if [ \$GIT_AUTHOR_EMAIL = 'alisson.levi@alunos.ufersa.edu.br' ]
then
    export GIT_AUTHOR_NAME='AlissonDLevi'
    export GIT_AUTHOR_EMAIL='franciscoalisson1998@gmail.com'
fi
if [ \$GIT_COMMITTER_EMAIL = 'alisson.levi@alunos.ufersa.edu.br' ]
then
    export GIT_COMMITTER_NAME='AlissonDLevi'
    export GIT_COMMITTER_EMAIL='franciscoalisson1998@gmail.com'
fi
" --tag-name-filter cat -- --branches --tags

echo.
echo ================================================
echo CORRECAO CONCLUIDA!
echo ================================================
echo.

echo Verificando os ultimos commits corrigidos:
git log --oneline -10 --format="%%cd - %%an (%%ae) - %%s" --date=format:"%%d/%%m/%%Y %%H:%%M"

echo.
echo Enviando alteracoes para o GitHub (FORCADO):
git push --force-with-lease origin main

echo.
echo *** TODOS OS COMMITS DO ALISSON FORAM CORRIGIDOS! ***
echo Pressione qualquer tecla para sair...
pause >nul 