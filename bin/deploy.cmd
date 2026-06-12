set environment=test
if not "%~1"=="" set environment=%1
call bin\build.cmd
cd deploy && bin\deploy.cmd %environment% && cd ..
