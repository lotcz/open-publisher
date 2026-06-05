if exist .\src\main\resources\public\ rmdir .\src\main\resources\public /s /q
xcopy /E /I .\src\ui\build .\src\main\resources\public
