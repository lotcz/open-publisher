set environment=test
if not "%~1"=="" set environment=%1
cd src\ui && call bin\build.cmd %environment% && cd .. && cd .. && call bin\copy-ui.cmd
