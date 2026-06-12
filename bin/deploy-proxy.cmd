set environment=test
if not "%~1"=="" set environment=%1
cd deploy && bin\deploy-proxy.cmd %environment% && cd ..
