# GitFlow, CI e Coolify

## Branches

| Branch | Uso | Publicação |
| --- | --- | --- |
| `feature/*` | Desenvolvimento a partir de `develop` | PR para `develop` |
| `develop` | Integração de mudanças | CI; após aprovação promove `staging` |
| `staging` | Ponteiro serializado para o commit aprovado | Coolify do ambiente de staging |
| `release/*` | Preparação de uma versão | PR para `main`; retorno das mudanças a `develop` |
| `main` | Linha revisada de releases | Sem deploy automático de produção |
| `hotfix/*` | Correção urgente a partir de `main` | PR para `main` e retorno a `develop` |

`staging` é atualizado apenas pelo job de deploy. Sua atualização deve ser fast-forward; não editar manualmente ou usar force push. A serialização mantém o commit estável durante o deploy, mesmo se `develop` receber novas mudanças.

## Push autenticado

A publicação local utiliza HTTPS com o GitHub CLI. A rota SSH anterior retornou erro interno; o mesmo commit foi aceito pelo HTTPS autenticado.

```bash
gh auth login
git remote set-url origin https://github.com/cortex-all/cortex-auto-v3.git
git config credential.https://github.com.helper '!gh auth git-credential'
git config push.default simple
git config push.autoSetupRemote true
```

Nenhum token fica na URL do remote ou no código. Essas configurações são locais ao checkout. A autenticação de leitura do Coolify continua independente.

## Trabalho diário

```bash
./scripts/gitflow.sh feature ajuste-do-formulario
# Edite, revise e teste.
git add <arquivos-revisados>
git commit -m "fix(form): preserve manual vehicle year"
./scripts/gitflow.sh publish
```

`publish` envia os commits e cria um PR em rascunho quando necessário. Não adiciona arquivos nem cria commits automaticamente. Exige árvore limpa; não deve publicar silenciosamente trabalho de outras pessoas.

Para hotfix ou release:

```bash
./scripts/gitflow.sh hotfix recuperacao-bv
./scripts/gitflow.sh release 3.0.33
```

Revise o PR e conclua a integração pelo GitHub. Depois de release/hotfix, leve as mudanças de `main` também a `develop` por PR para não perdê-las na próxima versão.

## Pipeline

O workflow **Quality and staging** executa PostgreSQL e Redis isolados para o backend, e testes frontend, TypeScript, lint, Playwright e Vite para a interface. Bancos reais e IA real ficam desligados no CI.

Push em `main` e `develop`, PRs e execução manual disparam checks. Somente um push/execução manual de `develop`, após os dois jobs aprovarem, promove `staging` e solicita o Coolify. O job espera conclusão e compara o commit informado pelo Coolify ao commit testado.

O pipeline não aumenta a versão automaticamente. `build:check` verifica a versão já commitada; preparar releases é uma etapa explícita.

## Configurar o ambiente GitHub `staging`

Secrets necessários:

| Secret | Conteúdo |
| --- | --- |
| `COOLIFY_DEPLOY_WEBHOOK` | URL HTTPS `/api/v1/deploy?uuid=UUID_DA_APLICACAO_STAGING&force=false` |
| `COOLIFY_TOKEN` | Token da equipe com leitura e deploy; leitura é necessária para observar o status |

O token é transmitido em header. Nunca escrever esses valores em YAML, README, logs ou URL autenticada do Git. A aplicação deve apontar para `staging`, no recurso Cortex já existente. O deploy por webhook bruto de push permanece desligado para não publicar antes dos testes.

## Preservar a operação durante deploy

No Coolify, configure para o container `api`:

```text
Pre-deployment:  python manage.py deployment_guard
Post-deployment: python manage.py deployment_guard --release
```

O comando anterior ao deploy recusa sessões STARTING, AUTHENTICATING, READY ou BUSY, consultas/ofertas pendentes, filas ou locks ativos. Não encerra sessões. Uma janela bancária conectada precisa ser encerrada pelo operador antes de publicar uma substituição dos workers.

Quando o ambiente está ocioso, reserva os locks por até 30 minutos e verifica novamente as filas. Trabalho que entrar depois da reserva permanece na fila e não é executado durante a substituição. O comando posterior libera somente os locks ainda pertencentes à reserva. Em falha de deploy, a reserva expira; conferir o ambiente antes de liberar manualmente.

O comando precisa existir no container atual antes de ativar o primeiro hook. A primeira instalação do hook é uma operação administrativa com backup. Uma checagem ociosa não equivale a homologação de uma consulta bancária.

## Backup e rollback

Registre commit e versão anterior antes de publicar. Preserve pelo menos a versão anterior do código/assets fora dos containers, e trate backup da base como procedimento separado. Não remova volumes dos bancos, perfis ou Redis ao restaurar.

O procedimento de publicação operacional descrito em [Deploy V3](https://github.com/cortex-all/cortex-auto-v3/blob/main/docs/deploy_v3.md) mantém backups em `~/cortex-auto-v3-backups`. Para releases pelo Coolify, use uma referência Git da versão anterior e imagem retida, ou publique os arquivos do backup conforme o procedimento. Migrations exigem avaliação própria; restaurar código não desfaz a base.

Em hotfix, publique uma nova versão contendo a correção ou um revert revisado. Não reescreva branches com force push. Revalide API, heartbeat e VNC depois da recuperação.

## Apresentação no GitHub

O README é a capa do repositório. O workflow **Project presentation** exporta `docs/showcase` como artefato. A página pública fica no repositório separado [cortex-auto-showcase](https://github.com/cortex-all/cortex-auto-showcase), que contém somente apresentação e imagens sintéticas.

O plano atual não suporta Pages no repositório privado. Por isso, o código permanece privado e a apresentação é publicada em [cortex-all.github.io/cortex-auto-showcase](https://cortex-all.github.io/cortex-auto-showcase/). Atualizações da apresentação devem copiar somente a pasta revisada `docs/showcase` para o repositório público; nunca exportar o checkout inteiro.

Referências: [webhooks Coolify](https://coolify.io/docs/core/automation/deploy-webhooks), [ambientes GitHub Actions](https://docs.github.com/en/actions/concepts/workflows-and-actions/deployment-environments) e [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).
