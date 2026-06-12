set environment=test
if not "%~1"=="" set environment=%1
cd deploy && bin\deploy.cmd %environment% && cd ..
