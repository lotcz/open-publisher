set environment=test
if not "%~1"=="" set environment=%1
copy /y .\src\config\conf.%environment%.json .\src\config\conf.json
npm install && npm run build
