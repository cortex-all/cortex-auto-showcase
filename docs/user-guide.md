# Manual de uso · Cortex Auto

## Jornada do vendedor

1. Entre com sua conta. O perfil define as ações de vendedor, gestor, suporte ou administração disponíveis.
2. Abra **Sessões bancárias** e confira a situação dos bancos necessários.
3. Use **Conectar Banco** para preparar a sessão. Quando solicitado, conclua a autenticação no terminal remoto; o fluxo do BV preserva a intervenção do vendedor.
4. Use **Abrir Terminal** para acessar o navegador da VPS. O estado do VNC descreve a conexão do visualizador; o estado bancário descreve a sessão do portal.
5. Abra **Nova consulta** e selecione os bancos.
6. Preencha os dados do cliente, veículo e condições. Confira campos preenchidos pelo cadastro salvo, ViaCEP e FIPE.
7. Revise o resumo e confirme os dados antes de enviar.
8. Acompanhe a consulta e os retornos. Um estado de processamento não significa aprovação.

## Regras de preenchimento

- CPF é texto e preserva zeros. Cliente salvo pode preencher dados; o vendedor continua podendo editá-los.
- Datas, ano e valor do veículo permanecem editáveis. Respostas tardias de integrações devem preservar edições manuais.
- Dados existentes têm precedência sobre defaults. Uma CNH desconhecida exige confirmação quando necessária ao envio.
- A interface não repete o campo Versão. O mapeamento interno preserva o contrato específico do banco.
- Confira coerência entre entrada e Sem entrada.
- Motrix atende somente MG. A plataforma deve impedir seu envio fora da região, sem alterar a UF real do cliente.

Os campos e exigências variam com os bancos selecionados. Não completar informações desconhecidas com valores fictícios para conseguir enviar.

## Como ler os estados

| Estado | Interpretação |
| --- | --- |
| Conectado / READY | A verificação confirmou a sessão do banco |
| Aguardando vendedor | A janela está preparada e exige atuação humana |
| Processando | A execução ainda não concluiu o retorno |
| Aprovado | O banco informou aprovação para aquele cenário |
| Reprovado | O banco informou recusa para aquele cenário |
| Revisão | Há ambiguidade ou ação humana necessária |
| ERROR / erro técnico | A execução não confirmou o resultado; conferir evidências antes de reenviar |

Uma falha técnica não deve ser tratada como recusa de crédito. Um retorno aprovado precisa ser conferido com as condições e informações efetivamente exibidas pelo banco.

## Terminal e sessão são conexões diferentes

**Desconectar o visualizador** encerra o acesso VNC da aba. **Encerrar a sessão bancária** é uma ação separada que fecha a janela conforme a política do banco. No BV, o encerramento explícito limpa os dados de sessão do portal, preservando as credenciais cadastradas.

Se houver tela preta ou conexão interrompida, confira o estado da sessão e do executor. Não repita cliques de login em sequência. Se a sessão já estiver autenticada, sua recuperação deve reutilizá-la.

## Histórico, evidências e atualização

Histórico permite acompanhar consultas anteriores. Evidências ajudam a conferir o retorno real. Não compartilhe capturas com dados de clientes em materiais públicos.

O sino informa uma nova versão quando há frontend mais recente publicado. Salve o trabalho antes de atualizar; o aviso não autoriza recarregamento automático durante a digitação. **Versões e novidades** apresenta o histórico da aplicação.

## Administração e homologação

Administração configura bancos, serviços e acesso dos usuários. Um serviço cadastrado não comprova que a integração foi implementada ou testada. Para homologar, defina o cenário, use dados autorizados, conecte o banco e acompanhe o retorno até sua persistência.

O manual ilustrado está na plataforma. Os procedimentos específicos encontram-se nos documentos de [Santander](https://github.com/cortex-all/cortex-auto-v3/blob/main/docs/santander_status.md), [PAN](https://github.com/cortex-all/cortex-auto-v3/blob/main/docs/pan_status.md), [BV](https://github.com/cortex-all/cortex-auto-v3/blob/main/docs/bv_status.md) e [Motrix](https://github.com/cortex-all/cortex-auto-v3/blob/main/docs/motrix_status.md); registros históricos não garantem disponibilidade atual dos portais.
