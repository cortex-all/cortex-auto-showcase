# Versionamento Cortex V3

`npm --prefix frontend run build` incrementa o patch 3.x.x, registra número e horário do build e sincroniza versão da aplicação, pacote e manuais. O pipeline executa TypeScript, capturas didáticas e compilação Vite; falha restaura os metadados anteriores. `release.json` registra novidades; `pendingRelease` prepara a descrição da próxima compilação.

`GET /api/version/` exige autenticação e responde sem cache com versão Cortex e versões dos componentes: Django em execução, React e Vite registrados no build. Essas versões são independentes: um build Cortex não exige atualizar o framework.

O header identifica o frontend carregado. A interface consulta a versão publicada a cada 30 segundos e ao voltar à janela; se houver diferença, oferece **Atualizar plataforma**. O operador salva o trabalho antes de clicar; não há reload automático durante o preenchimento. Abas anteriores à implementação desse aviso precisam de uma primeira atualização manual.

Versões e novidades ocupa a largura do conteúdo e apresenta histórico, build, data, versão dos manuais e componentes. Toda alteração de fluxo deve atualizar `frontend/src/features/manuals/guides.ts` e as capturas didáticas, sem expor dados reais nos manuais.

## CI e promoção de versões

`npm run build:check` valida TypeScript, todos os testes de navegador e Vite sem incrementar a versão. É o comando usado no GitHub Actions. O build que prepara uma release continua explícito; seus metadados e manuais devem ser commitados juntos.

O commit aprovado em `develop` é promovido para a branch `staging` por um job serializado. Coolify clona essa branch e o job compara o commit final ao aprovado. `main` guarda a linha revisada de releases, sem publicação automática de produção. Consulte [GitFlow e Coolify](gitflow.md).

A versão anterior deve continuar identificável por referência Git e backup/imagem retida. Backup de código não substitui backup da base e não reverte migrations.
