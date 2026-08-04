# Backlog do MVP — PHYNIX

> Este documento apresenta o escopo consolidado do MVP.
> O acompanhamento das tarefas, responsáveis e entregas deve ser realizado pelas [Issues do repositório](https://github.com/informaticaseed/tcc-2026-3c-chat-bot-de-estudos/issues).

**Última atualização:** agosto de 2026

---

## 🎯 Objetivo do MVP

O **PHYNIX** é uma plataforma web de apoio aos estudos voltada a estudantes que se preparam para o ENEM e vestibulares.

A plataforma reúne, em um único ambiente:

* assistente educacional com inteligência artificial;
* planejamento de matérias e metas de estudo;
* registro de horas estudadas;
* calendário de frequência;
* histórico de conversas;
* sistema de conquistas;
* gerenciamento de conta;
* recursos de acessibilidade.

O sistema utiliza um frontend desenvolvido em **HTML, CSS e JavaScript**, um backend em **PHP**, banco de dados **MySQL** e integração com a API da **Groq**.

---

## 🧱 Arquitetura do sistema

```text
Frontend
HTML + CSS + JavaScript
        │
        ▼
Backend PHP
        │
        ├── Banco de dados MySQL
        └── API Groq / LLaMA
```

---

## 👤 Usuários e autenticação

| # | Funcionalidade                                             | Prioridade | Status                                            |
| - | ---------------------------------------------------------- | ---------- | ------------------------------------------------- |
| 1 | Cadastro de usuário                                        | Alta       | 🔄 Desenvolvido — aguardando análise e integração |
| 2 | Login de usuário                                           | Alta       | 🔄 Funcional — redesign pendente                  |
| 3 | Logout do usuário                                          | Alta       | 🔄 Desenvolvido — aguardando validação            |
| 4 | Edição dos dados do perfil                                 | Alta       | 🔄 Desenvolvido — aguardando análise e integração |
| 5 | Exclusão da conta                                          | Alta       | 🔄 Desenvolvido — aguardando análise e integração |
| 6 | Recuperação de senha                                       | Média      | ⏳ A implementar                                   |
| 7 | Verificar o uso de `password_hash()` e `password_verify()` | Alta       | ❓ A confirmar                                     |
| 8 | Verificar o funcionamento das sessões PHP                  | Alta       | ❓ A confirmar                                     |

---

## 💬 Assistente de inteligência artificial

| #  | Funcionalidade                                                | Prioridade | Status                                  |
| -- | ------------------------------------------------------------- | ---------- | --------------------------------------- |
| 9  | Enviar perguntas para o assistente                            | Alta       | ✅ Concluído no frontend                 |
| 10 | Receber respostas da Groq/LLaMA                               | Alta       | 🔄 Desenvolvido — aguardando integração |
| 11 | Proteger a chave da Groq no `.env` do backend                 | Alta       | ✅ Informado como implementado           |
| 12 | Remover qualquer chave da Groq do frontend e do histórico Git | Alta       | 🔄 Em andamento                         |
| 13 | Exibir indicador de resposta da IA                            | Média      | ✅ Concluído no frontend                 |
| 14 | Exibir status de conexão do assistente                        | Média      | ⏳ A revisar                             |
| 15 | Exibir mensagem amigável em caso de falha                     | Alta       | ⏳ A validar                             |
| 16 | Editar mensagens enviadas pelo usuário                        | Média      | ✅ Concluído no frontend                 |
| 17 | Utilizar prompts rápidos no chat                              | Baixa      | ✅ Concluído                             |
| 18 | Enviar contexto do Planner para a IA                          | Média      | 💡 Em avaliação                         |

---

## 📋 Planner de estudos

| #  | Funcionalidade                                       | Prioridade | Status                                            |
| -- | ---------------------------------------------------- | ---------- | ------------------------------------------------- |
| 19 | Cadastrar matéria                                    | Alta       | 🔄 Desenvolvido — aguardando integração com MySQL |
| 20 | Editar matéria                                       | Alta       | 🔄 Desenvolvido — aguardando integração com MySQL |
| 21 | Excluir matéria                                      | Alta       | 🔄 Desenvolvido — aguardando integração com MySQL |
| 22 | Definir meta de horas                                | Alta       | 🔄 Desenvolvido — aguardando integração           |
| 23 | Definir dias de estudo por semana                    | Média      | ✅ Concluído no frontend                           |
| 24 | Limitar o campo “Dias/Sem” entre 1 e 7               | Média      | ⏳ A corrigir                                      |
| 25 | Selecionar uma cor para a matéria                    | Baixa      | ✅ Concluído no frontend                           |
| 26 | Adicionar texto explicativo sobre a seleção de cor   | Baixa      | ⏳ A implementar                                   |
| 27 | Registrar horas estudadas                            | Alta       | 🔄 Desenvolvido — aguardando integração com MySQL |
| 28 | Exibir progresso visual por matéria                  | Alta       | ✅ Concluído no frontend                           |
| 29 | Marcar matéria como concluída no dia                 | Alta       | 🔄 Desenvolvido — aguardando integração           |
| 30 | Tornar o fluxo de criação de matérias mais intuitivo | Média      | ⏳ A melhorar                                      |

---

## 📅 Calendário e registros de estudo

| #  | Funcionalidade                                                 | Prioridade | Status                                            |
| -- | -------------------------------------------------------------- | ---------- | ------------------------------------------------- |
| 31 | Exibir os dias estudados                                       | Alta       | 🔄 Desenvolvido — aguardando integração com MySQL |
| 32 | Exibir horas estudadas em cada dia                             | Alta       | 🔄 Desenvolvido — aguardando validação            |
| 33 | Exibir as matérias estudadas em cada dia                       | Alta       | ⏳ A implementar                                   |
| 34 | Calcular a sequência de dias estudados                         | Alta       | ⏳ A corrigir e validar                            |
| 35 | Exibir horas estudadas no mês                                  | Alta       | 🔄 Desenvolvido — aguardando validação            |
| 36 | Exibir horas estudadas no ano                                  | Média      | 🔄 Desenvolvido — aguardando validação            |
| 37 | Navegar entre os meses                                         | Média      | ✅ Concluído no frontend                           |
| 38 | Permitir a edição de registros anteriores                      | Alta       | 🔄 Confirmado no escopo — regras a definir        |
| 39 | Permitir alterar a duração de um estudo anterior               | Alta       | ⏳ A confirmar na implementação                    |
| 40 | Permitir alterar a matéria de um estudo anterior               | Média      | ⏳ A confirmar na implementação                    |
| 41 | Permitir excluir um registro anterior                          | Alta       | ⏳ A confirmar na implementação                    |
| 42 | Atualizar automaticamente os totais após uma edição            | Alta       | ⏳ A validar                                       |
| 43 | Corrigir horas apagadas que continuam aparecendo no calendário | Alta       | ⏳ A corrigir                                      |
| 44 | Corrigir a exibição das chamas no calendário                   | Média      | ⏳ A corrigir                                      |
| 45 | Melhorar a formatação dos valores numéricos                    | Baixa      | ⏳ A melhorar                                      |

> O calendário continuará permitindo registros em datas futuras. O bloqueio de datas futuras não faz parte do escopo definido.

---

## 🕓 Histórico de conversas

| #  | Funcionalidade                   | Prioridade | Status                                            |
| -- | -------------------------------- | ---------- | ------------------------------------------------- |
| 46 | Salvar conversas no MySQL        | Alta       | 🔄 Desenvolvido — aguardando análise e integração |
| 47 | Listar conversas anteriores      | Alta       | 🔄 Desenvolvido — aguardando integração           |
| 48 | Reabrir uma conversa             | Alta       | ✅ Concluído no frontend                           |
| 49 | Continuar uma conversa anterior  | Alta       | ⏳ A validar                                       |
| 50 | Excluir uma conversa             | Alta       | 🔄 Desenvolvido — aguardando análise              |
| 51 | Pesquisar conversas no histórico | Média      | ⏳ A implementar                                   |

---

## 🏆 Sistema de conquistas

| #  | Funcionalidade                                       | Prioridade | Status                                  |
| -- | ---------------------------------------------------- | ---------- | --------------------------------------- |
| 52 | Desbloquear conquistas automaticamente               | Alta       | 🔄 Desenvolvido — aguardando integração |
| 53 | Salvar conquistas por usuário no MySQL               | Alta       | 🔄 Desenvolvido — aguardando análise    |
| 54 | Exibir conquistas bloqueadas e desbloqueadas         | Alta       | ✅ Concluído no frontend                 |
| 55 | Exibir conquistas secretas                           | Média      | ✅ Concluído no frontend                 |
| 56 | Confirmar a quantidade total de conquistas           | Alta       | ❓ A confirmar                           |
| 57 | Confirmar as regras de desbloqueio                   | Alta       | ❓ A confirmar                           |
| 58 | Confirmar se o cálculo ocorre no frontend ou backend | Alta       | ❓ A confirmar                           |

> Não será implementada data de desbloqueio nem filtro por categoria.

---

## ♿ Acessibilidade

| #  | Funcionalidade                | Prioridade | Status                                  |
| -- | ----------------------------- | ---------- | --------------------------------------- |
| 59 | Tema claro e escuro           | Média      | ✅ Concluído                             |
| 60 | Alto contraste                | Média      | ✅ Concluído                             |
| 61 | Alteração do tamanho da fonte | Média      | ✅ Concluído                             |
| 62 | Salvar preferências no MySQL  | Média      | 🔄 Desenvolvido — aguardando integração |
| 63 | Revisar atributos ARIA        | Média      | ⏳ A validar                             |
| 64 | Testar navegação por teclado  | Média      | ⏳ A testar                              |

---

## 🎨 Redesign e interface

| #  | Entrega                                       | Prioridade | Status      |
| -- | --------------------------------------------- | ---------- | ----------- |
| 65 | Redesenhar a tela de login                    | Alta       | ⏳ A fazer   |
| 66 | Redesenhar a tela de cadastro                 | Alta       | ⏳ A fazer   |
| 67 | Criar tela de recuperação de senha            | Média      | ⏳ A fazer   |
| 68 | Revisar a tela de perfil                      | Média      | ⏳ A fazer   |
| 69 | Revisar o design do chat                      | Média      | ⏳ A definir |
| 70 | Revisar o design do Planner                   | Média      | ⏳ A definir |
| 71 | Revisar o design do calendário                | Média      | ⏳ A definir |
| 72 | Revisar o design das conquistas               | Baixa      | ⏳ A definir |
| 73 | Revisar o design do histórico                 | Média      | ⏳ A definir |
| 74 | Implementar visualmente a identidade da Fênix | Média      | ⏳ A revisar |

---

## 🔐 Backend, banco de dados e segurança

| #  | Entrega                                                | Prioridade | Status                                       |
| -- | ------------------------------------------------------ | ---------- | -------------------------------------------- |
| 75 | Conexão PHP com MySQL                                  | Alta       | 🔄 Desenvolvido — código ainda não analisado |
| 76 | Armazenamento dos dados do usuário                     | Alta       | 🔄 Desenvolvido — código ainda não analisado |
| 77 | Armazenamento do Planner                               | Alta       | 🔄 Desenvolvido — código ainda não analisado |
| 78 | Armazenamento das horas estudadas                      | Alta       | 🔄 Desenvolvido — código ainda não analisado |
| 79 | Armazenamento do calendário                            | Alta       | 🔄 Desenvolvido — código ainda não analisado |
| 80 | Armazenamento do histórico                             | Alta       | 🔄 Desenvolvido — código ainda não analisado |
| 81 | Armazenamento das conquistas                           | Alta       | 🔄 Desenvolvido — código ainda não analisado |
| 82 | Armazenamento das preferências de acessibilidade       | Média      | 🔄 Desenvolvido — código ainda não analisado |
| 83 | Confirmar os endpoints existentes                      | Alta       | ❓ A confirmar                                |
| 84 | Confirmar o uso de consultas preparadas                | Alta       | ❓ A confirmar                                |
| 85 | Confirmar validações no backend                        | Alta       | ❓ A confirmar                                |
| 86 | Confirmar o tratamento de erros                        | Alta       | ❓ A confirmar                                |
| 87 | Confirmar que o `.env` não está versionado             | Alta       | ⏳ A validar                                  |
| 88 | Confirmar que senhas não são armazenadas em texto puro | Alta       | ❓ A confirmar                                |

---

## 🧹 Organização, qualidade e documentação

| #   | Entrega                                 | Prioridade | Status          |
| --- | --------------------------------------- | ---------- | --------------- |
| 89  | Organizar a estrutura de pastas         | Alta       | ✅ Concluído     |
| 90  | Refatorar o JavaScript em módulos       | Alta       | 🔄 Em andamento |
| 91  | Remover duplicações nos arquivos CSS    | Média      | ⏳ A revisar     |
| 92  | Atualizar o README                      | Alta       | 🔄 Em andamento |
| 93  | Atualizar o backlog                     | Alta       | 🔄 Em andamento |
| 94  | Atualizar a documentação da arquitetura | Alta       | ⏳ A fazer       |
| 95  | Criar `.env.example`                    | Alta       | ⏳ A validar     |
| 96  | Documentar o banco de dados             | Alta       | ⏳ A fazer       |
| 97  | Documentar os endpoints do backend      | Alta       | ⏳ A fazer       |
| 98  | Criar guia de instalação                | Alta       | ⏳ A fazer       |
| 99  | Criar diagrama de arquitetura           | Média      | ⏳ A fazer       |
| 100 | Criar DFD                               | Média      | ⏳ A fazer       |
| 101 | Criar diagrama de casos de uso          | Média      | ⏳ A fazer       |
| 102 | Criar modelo entidade-relacionamento    | Alta       | ⏳ A fazer       |
| 103 | Registrar testes funcionais             | Alta       | ⏳ A fazer       |
| 104 | Produzir evidências do funcionamento    | Média      | ⏳ A fazer       |

---

## 🚫 Fora do escopo

Os seguintes recursos não serão desenvolvidos no PHYNIX:

* aplicativo mobile nativo para Android ou iOS;
* frequência mensal em porcentagem;
* filtros por categoria nas conquistas;
* data de desbloqueio das conquistas;
* notificações push;
* lembretes por e-mail;
* painel administrativo para professores;
* sistema de pagamentos;
* planos pagos;
* monetização;
* recursos comerciais;
* integração com plataformas externas de questões.

O PHYNIX é um projeto educacional e sem fins lucrativos.

---

## ❓ Pontos pendentes de confirmação

* quantidade real de conquistas;
* regras completas de desbloqueio;
* endpoints existentes no backend;
* organização dos arquivos PHP;
* uso de `password_hash()` e `password_verify()`;
* uso correto de sessões PHP;
* utilização de consultas preparadas;
* regras exatas para edição de registros anteriores;
* telas que serão obrigatoriamente redesenhadas;
* envio do contexto do Planner para a IA.

---

## 📌 Legenda

| Status          | Significado                            |
| --------------- | -------------------------------------- |
| ⏳ A fazer       | Ainda não iniciado                     |
| 🔄 Em andamento | Em desenvolvimento ou integração       |
| ✅ Concluído     | Implementado e validado                |
| ❓ A confirmar   | Necessita análise técnica              |
| 💡 Em avaliação | Ideia ainda não aprovada para o escopo |

---

## 🔗 Links úteis

* [Repositório do projeto](https://github.com/informaticaseed/tcc-2026-3c-chat-bot-de-estudos)
* [Issues do projeto](https://github.com/informaticaseed/tcc-2026-3c-chat-bot-de-estudos/issues)
* [Design do PHYNIX no Figma](https://www.figma.com/design/Rk7pLRkH8DiJxWigeim50t/Phynix---TCC-Adryan?node-id=0-1&p=f&t=ZWgRA1FPWAM1MMs5-0)
