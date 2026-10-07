# Arquitetura · Robô + IA

## Responsabilidades

| Camada | Papel | Limite |
| --- | --- | --- |
| React / TypeScript | Cadastro, seleção, acompanhamento e terminal | Não possui credenciais bancárias retornadas pela API |
| Django REST | Autenticação, permissões, contratos e persistência | Envio segue regras específicas de cada banco |
| PostgreSQL | Clientes, bancos, credenciais criptografadas, consultas e resultados | Chave de criptografia deve permanecer fora do Git |
| Redis | Filas, exclusão bancária, heartbeat e autorização temporária do VNC | Operações compartilham a exclusão do banco |
| Workers / Playwright | Fluxos determinísticos nos portais | Um contexto operacional por banco |
| VNC / Linux | Intervenção do vendedor no navegador da VPS | Acesso pelo gateway autenticado |
| Assistência IA | Propostas de interpretação e desambiguação | Validação de schema, confiança, opções e tentativas |

## Por que preservar o robô?

Portais bancários têm etapas, regras e contratos que precisam ser executados de maneira previsível. O robô controla navegação, preenchimento, exclusão, sessão e leitura. Essa responsabilidade não é delegada livremente a um modelo de linguagem.

## Onde a IA agrega valor

A camada `robot/ai` possui capacidades para interpretar página, resolver seletor, desambiguar opção, interpretar resultado, propor recuperação e revisar dados cadastrais. Seu uso depende de habilitação global, por banco e por capacidade quando aplicável.

Uma proposta tem de corresponder ao schema e às opções do contexto. Baixa confiança, erro do provedor ou resposta inválida levam ao fallback ou revisão. O controle de tentativas é por simulação; uma falha anterior não deve bloquear todas as próximas consultas.

A IA pode ajudar a reconhecer equivalências de escrita em opções reais. Isso não autoriza trocar veículo, ano ou preço. Normalização de identidade do veículo também possui regras determinísticas e validação de coerência; o aprendizado persistente exige critérios adicionais.

**Capacidade implementada não é necessariamente função exposta.** A revisão cadastral está disponível na camada de serviço e não deve ser apresentada como edição automática de cadastro na interface. A decisão de crédito permanece exclusivamente no banco.

## Controle humano

VNC permite ao vendedor atuar na janela quando há MFA, CAPTCHA, autenticação manual ou revisão. O frontend transmite interação ao gateway autenticado; o Chrome e o robô rodam na VPS. Um computador de desenvolvimento não deve virar dependência de operação.

## Dados e evidências

Credenciais bancárias são persistidas criptografadas, sem retorno em serializers de leitura. A IA recebe contexto filtrado conforme a capacidade; logs não devem conter prompts completos, senhas ou cookies. Nem toda máscara é um detector universal de dados pessoais: cada integração precisa revisar seu contexto e minimizá-lo.

Capturas públicas e testes utilizam dados sintéticos. Evidências de operação real ficam no armazenamento configurado, acessíveis conforme permissões.

## Concorrência e recuperação

Workers dedicados serializam as consultas por banco. Locks com renovação evitam execução simultânea. Referências a páginas podem ficar inválidas se o renderer travar; a recuperação do BV procura uma aba autenticada antes de resetar dados ou preparar login.

Respostas assíncronas de cliente, ViaCEP e FIPE não devem apagar edições recentes. A camada frontend mantém controles de revisão de campo e identidade da solicitação.

## Leitura técnica

- [Arquitetura detalhada de IA](https://github.com/cortex-all/cortex-auto-v3/blob/main/docs/ai_architecture.md)
- [Normalização de veículos](https://github.com/cortex-all/cortex-auto-v3/blob/main/docs/vehicle_normalizer.md)
- [Contrato de simulações](https://github.com/cortex-all/cortex-auto-v3/blob/main/docs/api_simulation_contract.md)
- [Serialização por banco](https://github.com/cortex-all/cortex-auto-v3/blob/main/docs/bank_queue_serialization.md)
- [Terminal do vendedor](https://github.com/cortex-all/cortex-auto-v3/blob/main/docs/seller_terminal.md)
- [Infraestrutura Linux](https://github.com/cortex-all/cortex-auto-v3/blob/main/docs/deploy_v3.md)
