# Implementar Cortex Auto

## Modelo de implementação

| Cenário | Modelo |
| --- | --- |
| Desenvolvimento | API e frontend locais; PostgreSQL e Redis em Docker |
| Staging | Stack Linux isolada em VPS, gerenciada pelo Coolify |
| Operação comercial | Credenciais por banco, permissões de acesso e homologação dos cenários |

O MacBook pode ser usado para desenvolver. A operação implantada utiliza navegadores Linux na VPS e terminal VNC; não depende de um navegador pessoal do desenvolvedor.

## Pré-requisitos

- Python 3.12 ou compatível com as dependências do projeto.
- Node.js 24 e npm.
- Git, Docker e Docker Compose.
- GitHub CLI (`gh`) para o fluxo de publicação e pull requests.

## Preparar o ambiente local

```bash
git clone https://github.com/cortex-all/cortex-auto-v3.git
cd cortex-auto-v3
cp .env.example .env
```

Edite `.env`: configure as contas iniciais, suas senhas e a chave de criptografia dos bancos. Use uma chave fora do repositório. O caminho de exemplo precisa corresponder à sua máquina.

```bash
set -a
source .env
set +a
./scripts/bootstrap.sh
source .venv/bin/activate
mkdir -p "$HOME/.config/robo-cortex"
python manage.py generate_robot_master_key "$HOME/.config/robo-cortex/master.key"
```

A chave deve ser gerada uma única vez para a base. Não a substitua depois de salvar credenciais sem um plano de migração, pois os valores existentes dependem dela.

O bootstrap instala dependências, sobe os serviços locais, aplica migrations e cria as contas definidas em `BOOTSTRAP_*`. O Compose local publica PostgreSQL em `55433` e Redis em `56380`; o CI usa serviços isolados e portas próprias.

## Executar API e frontend

Terminal da API:

```bash
source .venv/bin/activate
python manage.py runserver 127.0.0.1:8000 --noreload
```

Terminal do frontend:

```bash
cd frontend
npm ci
npx playwright install chromium
npm run dev
```

Acesse a URL mostrada pelo Vite. A API expõe Swagger em `http://127.0.0.1:8000/docs/` e administração Django em `http://127.0.0.1:8000/admin/`.

## Preparar a operação bancária

1. Cadastre URLs e credenciais em Sessões bancárias / administração. Os usuários e senhas pertencem ao PostgreSQL, com criptografia; não devem ser escritos no código.
2. Configure os serviços de comunicação e assistência em Vendors e serviços.
3. Mantenha `ROBOT_LIVE_EXECUTION=0` até definir o escopo de homologação.
4. Para operação real, a flag global e a permissão do banco precisam estar habilitadas.
5. Inicie dispatcher, fila de e-mail e workers conforme o modelo de implantação. Em staging, o Compose gerencia esses processos.
6. Confira o terminal VNC, a sessão e os dados antes de enviar uma consulta.

A capacidade de revisão cadastral por IA na camada de serviço não significa que existe uma etapa disponível ao vendedor. Consulte os limites em [Arquitetura](architecture.md).

## VPS e Coolify

Use [`compose.yaml`](https://github.com/cortex-all/cortex-auto-v3/blob/main/compose.yaml), [`deploy/staging/.env.example`](https://github.com/cortex-all/cortex-auto-v3/blob/main/deploy/staging/.env.example) e o [guia de infraestrutura](https://github.com/cortex-all/cortex-auto-v3/blob/main/docs/deploy_v3.md). O arquivo `docker-compose.yml` atende somente o ambiente local.

Configure no Coolify os segredos do ambiente, domínio TLS e volumes persistentes. API, frontend, gateway VNC e workers têm verificações de saúde. Não exponha a porta VNC diretamente na internet; o navegador usa o gateway autenticado.

O [GitFlow](gitflow.md) explica a promoção e o deploy. A execução de CI não utiliza credenciais bancárias nem provedores reais de IA.

## Validar antes de publicar

```bash
python manage.py check
python manage.py makemigrations --check --dry-run
python manage.py test --noinput
python deploy/validate-resource-group.py
npm --prefix frontend test
npm --prefix frontend run typecheck
npm --prefix frontend run lint
npm --prefix frontend run build:check
```

`build:check` valida o código e a versão registrada. `npm run build` é o fluxo de preparação de uma nova versão e atualiza os metadados; consulte [Versionamento](versioning.md).
