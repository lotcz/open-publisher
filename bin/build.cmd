set environment=test
if not "%~1"=="" set environment=%1
call bin\build-ui.cmd %environment%
call bin\build-server.cmd
