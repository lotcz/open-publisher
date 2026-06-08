set environment=test
if not "%~1"=="" set environment=%1
docker compose run --rm -ti deploy ansible-playbook -i inventory/%environment%.yml proxy-playbook.yml -l %environment%
