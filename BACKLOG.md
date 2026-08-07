# Backlog do MVP — PHYNIX

> Este arquivo apresenta o estado consolidado do MVP.
> O acompanhamento diário das tarefas, responsáveis e entregas deve ser realizado pelas **Issues do repositório**.

**Última atualização:** agosto de 2026

---

## 🎯 Objetivo do MVP

O **PHYNIX** é uma plataforma web de apoio aos estudos voltada a estudantes que se preparam para o ENEM e vestibulares.

O sistema reúne em um único ambiente:

* assistente educacional com inteligência artificial;
* planejamento de matérias e metas de estudo;
* registro de horas estudadas;
* calendário de frequência;
* histórico de conversas;
* sistema de conquistas;
* autenticação de usuários;
* recursos de acessibilidade.

### Arquitetura atual

```text
Frontend
HTML + CSS + JavaScript
        │
        ▼
Backend PHP
        │
        ├── MySQL
        └── API Groq / LLaMA
```

### Banco de dados atual

O banco possui as seguintes tabelas:

```text
users
subjects
hours_log
studied_days
daily_completions
study_log
achievements
chat_sessions
chat_messages
settings
```

---

# 👤 Autenticação e conta

| # | Funcionalidade                   | Prioridade | Status          |
| - | -------------------------------- | ---------- | --------------- |
| 1 | Cadastro de usuário              | Alta       | ✅ Concluído     |
| 2 | Login de usuário                 | Alta       | ✅ Concluído     |
| 3 | Logout do usuário                | Alta       | ✅ Concluído     |
| 4 | Recuperação da sessão do usuário | Alta       | ✅ Concluído     |
| 5 | Armazenamento seguro das senhas  | Alta       | ✅ Concluído     |
| 6 | Recuperação de senha             | Média      | ⏳ A implementar |
| 7 | Edição de perfil                 | Média      | ⏳ A implementar |
| 8 | Exclusão de conta                | Média      | ⏳ A implementar |

### Endpoints existentes

```text
POST /api/auth/register.php
POST /api/auth/login.php
POST /api/auth/logout.php
GET  /api/auth/me.php
```

### Segurança confirmada

* ✅ Sessões PHP com `$_SESSION`;
* ✅ `password_hash()` no cadastro;
* ✅ `password_verify()` no login;
* ✅ regeneração do ID da sessão após o login;
* ✅ consultas preparadas com PDO nos endpoints analisados.

---

# 💬 Assistente de IA

| #  | Funcionalidade                                          | Prioridade | Status            |
| -- | ------------------------------------------------------- | ---------- | ----------------- |
| 9  | Enviar mensagens para a IA                              | Alta       | ✅ Concluído       |
| 10 | Receber respostas via Groq/LLaMA                        | Alta       | ✅ Concluído       |
| 11 | Criar e salvar conversas                                | Alta       | ✅ Concluído       |
| 12 | Reabrir conversas anteriores                            | Alta       | ✅ Concluído       |
| 13 | Continuar conversas anteriores                          | Alta       | ✅ Concluído       |
| 14 | Excluir conversas                                       | Alta       | ✅ Concluído       |
| 15 | Editar mensagens do usuário e regenerar resposta        | Média      | ✅ Implementado    |
| 16 | Prompts rápidos                                         | Baixa      | ✅ Concluído       |
| 17 | Indicador de resposta da IA                             | Média      | ✅ Concluído       |
| 18 | Melhorar tratamento visual de falhas da IA              | Média      | ⏳ A revisar       |
| 19 | Evitar perda de mensagens se a regeneração da IA falhar | Média      | 🐛 Bug a corrigir |
| 20 | Pesquisa no histórico                                   | Média      | ⏳ A implementar   |
| 21 | Enviar informações do Planner para a IA                 | Média      | 💡 Em avaliação   |

### Endpoint existente

```text
/api/chat.php
```

### Segurança da API

Atualmente a chave da Groq está definida diretamente em:

```text
backend/config/config.php
```

Antes da entrega final:

* [ ] revogar a chave atualmente exposta;
* [ ] gerar uma nova chave;
* [ ] mover a chave para `.env`;
* [ ] criar `.env.example`;
* [ ] garantir que `.env` não seja versionado;
* [ ] verificar se nenhuma chave permanece no histórico Git.

---

# 📋 Planner de estudos

| #  | Funcionalidade                                                        | Prioridade | Status            |
| -- | --------------------------------------------------------------------- | ---------- | ----------------- |
| 22 | Cadastrar matéria                                                     | Alta       | ✅ Concluído       |
| 23 | Salvar matérias no MySQL                                              | Alta       | ✅ Concluído       |
| 24 | Definir meta de horas                                                 | Alta       | ✅ Concluído       |
| 25 | Definir dias de estudo por semana                                     | Média      | ✅ Concluído       |
| 26 | Definir cor da matéria                                                | Baixa      | ✅ Concluído       |
| 27 | Registrar horas estudadas                                             | Alta       | ✅ Concluído       |
| 28 | Salvar horas por matéria/mês                                          | Alta       | ✅ Concluído       |
| 29 | Exibir progresso por matéria                                          | Alta       | ✅ Concluído       |
| 30 | Excluir matéria                                                       | Alta       | ✅ Concluído       |
| 31 | Marcar matéria como concluída no dia                                  | Alta       | ✅ Concluído       |
| 32 | Corrigir validação do campo `Dias/Sem`                                | Média      | 🐛 A corrigir     |
| 33 | Melhorar fluxo de criação de matérias                                 | Média      | ⏳ Melhoria visual |
| 34 | Definir se será possível editar nome, meta, dias e cor de uma matéria | Média      | 💡 A decidir      |

### Persistência atual

```text
subjects   → dados das matérias
hours_log  → horas mensais por matéria
```

---

# ⏱️ Registro e consistência das horas

Atualmente as horas são armazenadas em duas estruturas:

```text
hours_log
→ horas por matéria e mês

study_log
→ horas agregadas por dia
```

Essa duplicação pode gerar inconsistências entre o Planner e o Calendário.

| #  | Correção técnica                                            | Prioridade | Status        |
| -- | ----------------------------------------------------------- | ---------- | ------------- |
| 35 | Corrigir sincronização entre `hours_log` e `study_log`      | 🔴 Crítica | 🐛 A corrigir |
| 36 | Corrigir horas que permanecem no calendário após alterações | Alta       | 🐛 A corrigir |
| 37 | Corrigir dados agregados após exclusão de matéria           | Alta       | 🐛 A corrigir |
| 38 | Definir uma única fonte de verdade para as horas estudadas  | Alta       | ⏳ A definir   |
| 39 | Validar totais de horas após inclusão, alteração e exclusão | Alta       | ⏳ A testar    |

> Recomenda-se que os registros de estudo sejam a fonte principal dos totais exibidos pelo sistema, evitando armazenar o mesmo valor de formas diferentes.

---

# 📅 Calendário

| #  | Funcionalidade                                 | Prioridade | Status                   |
| -- | ---------------------------------------------- | ---------- | ------------------------ |
| 40 | Marcar um dia como estudado                    | Alta       | ✅ Concluído              |
| 41 | Desmarcar um dia estudado                      | Alta       | ✅ Concluído              |
| 42 | Marcar/desmarcar datas anteriores              | Alta       | ✅ Concluído              |
| 43 | Salvar dias estudados no MySQL                 | Alta       | ✅ Concluído              |
| 44 | Navegar entre meses                            | Média      | ✅ Concluído              |
| 45 | Exibir quantidade total de dias estudados      | Média      | ✅ Concluído              |
| 46 | Exibir horas estudadas no mês                  | Alta       | ✅ Concluído              |
| 47 | Calcular sequência de estudos (streak)         | Alta       | ✅ Implementado — validar |
| 48 | Impedir marcação de datas futuras              | Alta       | 🐛 Bug a corrigir        |
| 49 | Exibir horas estudadas dentro de cada dia      | Média      | ⏳ A implementar          |
| 50 | Exibir conclusões/matérias estudadas por dia   | Média      | ⏳ A implementar          |
| 51 | Revisar representação das chamas no calendário | Média      | ⏳ A revisar              |

### Regra atual

O endpoint aceita qualquer data válida no formato:

```text
YYYY-MM-DD
```

Por isso, atualmente é possível marcar datas futuras.

### Regra recomendada

```text
Data anterior → pode marcar/desmarcar
Hoje          → pode marcar/desmarcar
Data futura   → bloqueada
```

O bloqueio deve existir principalmente no **backend**, não apenas na interface.

> Atualmente o calendário permite marcar ou desmarcar um dia. Ele não permite editar diretamente a matéria ou a quantidade de horas de uma data anterior.

---

# 🏆 Conquistas

O sistema possui atualmente **19 conquistas**, com as regras de desbloqueio definidas no backend.

| #  | Funcionalidade                             | Prioridade | Status               |
| -- | ------------------------------------------ | ---------- | -------------------- |
| 52 | Verificar conquistas automaticamente       | Alta       | ✅ Concluído          |
| 53 | Desbloquear conquistas                     | Alta       | ✅ Concluído          |
| 54 | Salvar conquistas por usuário no MySQL     | Alta       | ✅ Concluído          |
| 55 | Exibir conquistas bloqueadas               | Média      | ✅ Concluído          |
| 56 | Exibir conquistas desbloqueadas            | Média      | ✅ Concluído          |
| 57 | Exibir conquistas secretas                 | Média      | ✅ Concluído          |
| 58 | Salvar data de desbloqueio                 | Baixa      | ✅ Concluído no banco |
| 59 | Enviar data de desbloqueio para o frontend | Baixa      | ⏳ A implementar      |
| 60 | Mostrar data de desbloqueio na interface   | Baixa      | ⏳ A implementar      |
| 61 | Adicionar filtros nas conquistas           | Baixa      | 💡 Em avaliação      |

### Implementação confirmada

```text
backend/includes/achievements.php
→ contém as 19 conquistas e suas regras

backend/api/achievements.php
→ informa ao frontend quais estão bloqueadas/desbloqueadas
```

O campo:

```text
unlocked_at
```

já existe no banco, mas ainda não é retornado pelo endpoint.

---

# 🕓 Histórico de conversas

| #  | Funcionalidade              | Prioridade | Status          |
| -- | --------------------------- | ---------- | --------------- |
| 62 | Salvar sessões de conversa  | Alta       | ✅ Concluído     |
| 63 | Salvar mensagens            | Alta       | ✅ Concluído     |
| 64 | Listar conversas anteriores | Alta       | ✅ Concluído     |
| 65 | Reabrir conversa            | Alta       | ✅ Concluído     |
| 66 | Continuar conversa          | Alta       | ✅ Concluído     |
| 67 | Editar mensagem             | Média      | ✅ Concluído     |
| 68 | Excluir conversa            | Alta       | ✅ Concluído     |
| 69 | Pesquisar conversas         | Média      | ⏳ A implementar |

### Persistência

```text
chat_sessions
chat_messages
```

---

# ♿ Acessibilidade e configurações

| #  | Funcionalidade                                 | Prioridade | Status          |
| -- | ---------------------------------------------- | ---------- | --------------- |
| 70 | Tema claro e escuro                            | Média      | ✅ Concluído     |
| 71 | Alto contraste                                 | Média      | ✅ Concluído     |
| 72 | Alteração do tamanho da fonte                  | Média      | ✅ Concluído     |
| 73 | Persistir acessibilidade no `localStorage`     | Média      | ✅ Concluído     |
| 74 | Salvar meta diária no MySQL                    | Média      | ✅ Concluído     |
| 75 | Salvar preferências de acessibilidade no MySQL | Baixa      | 💡 Em avaliação |
| 76 | Revisar atributos ARIA                         | Média      | ⏳ A validar     |
| 77 | Testar navegação por teclado                   | Média      | ⏳ A testar      |

### Persistência atual

```text
MySQL:
settings.daily_goal_hours

localStorage:
tema
tamanho da fonte
alto contraste
```

---

# 🎨 Interface e redesign

As alterações realizadas até o momento foram principalmente funcionais. O visual ainda precisa ser adaptado ao novo design do PHYNIX.

| #  | Entrega                                            | Prioridade | Status      |
| -- | -------------------------------------------------- | ---------- | ----------- |
| 78 | Redesign da tela de login                          | Alta       | ⏳ A fazer   |
| 79 | Redesign da tela de cadastro                       | Alta       | ⏳ A fazer   |
| 80 | Criar tela de recuperação de senha                 | Média      | ⏳ A fazer   |
| 81 | Criar interface de edição de perfil                | Média      | ⏳ A fazer   |
| 82 | Criar interface de exclusão de conta               | Média      | ⏳ A fazer   |
| 83 | Revisar visual do Chat                             | Média      | ⏳ A revisar |
| 84 | Revisar visual do Planner                          | Média      | ⏳ A revisar |
| 85 | Revisar visual do Calendário                       | Média      | ⏳ A revisar |
| 86 | Revisar visual das Conquistas                      | Baixa      | ⏳ A revisar |
| 87 | Revisar visual do Histórico                        | Média      | ⏳ A revisar |
| 88 | Padronizar autenticação com a identidade do PHYNIX | Alta       | ⏳ A fazer   |
| 89 | Padronizar referências de `EstudaAI` para `PHYNIX` | Média      | ⏳ A fazer   |

---

# ⚙️ Backend e banco de dados

### Endpoints atualmente existentes

```text
/api/auth/register.php
/api/auth/login.php
/api/auth/logout.php
/api/auth/me.php

/api/subjects.php
/api/calendar.php
/api/complete.php
/api/achievements.php
/api/chat.php
/api/settings.php
```

### Estrutura do backend

```text
backend/
├── api/
│   ├── auth/
│   ├── achievements.php
│   ├── calendar.php
│   ├── chat.php
│   ├── complete.php
│   ├── settings.php
│   └── subjects.php
│
├── config/
│   ├── config.php
│   ├── config.example.php
│   └── database.php
│
├── includes/
│   ├── achievements.php
│   ├── bootstrap.php
│   ├── response.php
│   └── stats.php
│
└── schema.sql
```

| #   | Entrega técnica                 | Prioridade | Status         |
| --- | ------------------------------- | ---------- | -------------- |
| 90  | Backend PHP                     | Alta       | ✅ Desenvolvido |
| 91  | Banco MySQL                     | Alta       | ✅ Desenvolvido |
| 92  | Conexão PHP/MySQL               | Alta       | ✅ Desenvolvido |
| 93  | Persistência dos usuários       | Alta       | ✅ Desenvolvido |
| 94  | Persistência do Planner         | Alta       | ✅ Desenvolvido |
| 95  | Persistência das horas          | Alta       | ✅ Desenvolvido |
| 96  | Persistência do calendário      | Alta       | ✅ Desenvolvido |
| 97  | Persistência das conquistas     | Alta       | ✅ Desenvolvido |
| 98  | Persistência do histórico       | Alta       | ✅ Desenvolvido |
| 99  | Sessões PHP                     | Alta       | ✅ Implementado |
| 100 | Hash seguro das senhas          | Alta       | ✅ Implementado |
| 101 | Mover credenciais para `.env`   | 🔴 Crítica | ⏳ A fazer      |
| 102 | Criar `.env.example`            | Alta       | ⏳ A fazer      |
| 103 | Corrigir configuração de CORS   | Alta       | ⏳ A corrigir   |
| 104 | Revisar validação dos endpoints | Alta       | ⏳ A validar    |
| 105 | Testar todos os endpoints       | Alta       | ⏳ A fazer      |
| 106 | Documentar API                  | Alta       | ⏳ A fazer      |

### CORS

Atualmente, quando `ALLOWED_ORIGIN` está como `null`, o backend pode utilizar a origem enviada pela requisição enquanto permite credenciais.

Essa configuração deverá ser restrita antes de uma publicação em produção.

---

# 🧹 Organização e documentação técnica

| #   | Entrega                               | Prioridade | Status          |
| --- | ------------------------------------- | ---------- | --------------- |
| 107 | Separar frontend e backend            | Alta       | ✅ Concluído     |
| 108 | Organizar estrutura do backend        | Alta       | ✅ Concluído     |
| 109 | Modularizar o JavaScript do frontend  | Média      | ⏳ A fazer       |
| 110 | Revisar CSS e remover duplicações     | Média      | ⏳ A revisar     |
| 111 | Atualizar README                      | Alta       | ⏳ A fazer       |
| 112 | Atualizar backlog                     | Alta       | 🔄 Em andamento |
| 113 | Atualizar documentação da arquitetura | Alta       | ⏳ A fazer       |
| 114 | Documentar banco de dados             | Alta       | ⏳ A fazer       |
| 115 | Criar documentação dos endpoints      | Alta       | ⏳ A fazer       |
| 116 | Criar guia de instalação              | Alta       | ⏳ A fazer       |
| 117 | Criar diagrama de arquitetura         | Média      | ⏳ A fazer       |
| 118 | Criar DFD                             | Média      | ⏳ A fazer       |
| 119 | Criar casos de uso                    | Média      | ⏳ A fazer       |
| 120 | Criar modelo entidade-relacionamento  | Alta       | ⏳ A fazer       |
| 121 | Criar testes funcionais               | Alta       | ⏳ A fazer       |
| 122 | Produzir evidências técnicas          | Média      | ⏳ A fazer       |

---

# 🧪 Testes necessários

Antes da entrega final devem ser validados, no mínimo:

| #   | Teste                                     | Prioridade | Status                   |
| --- | ----------------------------------------- | ---------- | ------------------------ |
| 123 | Cadastro e login                          | Alta       | ⏳ A documentar           |
| 124 | Proteção de endpoints sem sessão          | Alta       | ⏳ A documentar           |
| 125 | Cadastro e exclusão de matéria            | Alta       | ⏳ A documentar           |
| 126 | Registro de horas                         | Alta       | ⏳ A documentar           |
| 127 | Sincronização Planner ↔ Calendário        | 🔴 Crítica | ⏳ A testar               |
| 128 | Exclusão de matéria com horas registradas | Alta       | ⏳ A testar               |
| 129 | Bloqueio de datas futuras                 | Alta       | ⏳ A testar após correção |
| 130 | Cálculo de streak                         | Alta       | ⏳ A validar              |
| 131 | Chat com Groq                             | Alta       | ⏳ A documentar           |
| 132 | Falha da Groq                             | Alta       | ⏳ A testar               |
| 133 | Edição de mensagem no chat                | Média      | ⏳ A testar               |
| 134 | Exclusão de conversa                      | Média      | ⏳ A testar               |
| 135 | Desbloqueio das 19 conquistas             | Média      | ⏳ A validar              |
| 136 | Acessibilidade                            | Média      | ⏳ A testar               |

---

# 💡 Funcionalidades planejadas / em avaliação

Estes recursos ainda podem entrar no projeto, mas não devem bloquear a estabilização das funcionalidades principais:

| Funcionalidade                          | Situação        |
| --------------------------------------- | --------------- |
| Recuperação de senha                    | ⏳ Planejada     |
| Edição de perfil                        | ⏳ Planejada     |
| Exclusão de conta                       | ⏳ Planejada     |
| Pesquisa no histórico                   | ⏳ Planejada     |
| Contexto do Planner enviado para a IA   | 💡 Em avaliação |
| Preferências de acessibilidade no MySQL | 💡 Em avaliação |
| Frequência mensal em porcentagem        | 💡 Em avaliação |
| Filtros nas conquistas                  | 💡 Em avaliação |
| Exibição da data de desbloqueio         | ⏳ Planejada     |
| Edição completa de registros anteriores | 💡 A decidir    |

---

# 🚫 Fora do escopo

Os seguintes recursos **não fazem parte do projeto**:

* aplicativo mobile nativo para Android ou iOS;
* notificações push;
* lembretes por e-mail;
* painel administrativo para professores;
* sistema de pagamentos;
* planos pagos;
* monetização;
* recursos comerciais.

O **PHYNIX é uma plataforma educacional web e sem fins lucrativos**.

---

# 🔥 Prioridades atuais

## 🔴 Prioridade crítica

1. Revogar e substituir a chave atual da Groq.
2. Mover credenciais para `.env`.
3. Garantir que nenhuma chave permaneça no histórico do Git.
4. Corrigir a inconsistência entre `hours_log` e `study_log`.

## 🟠 Prioridade alta

5. Corrigir inconsistências após alteração ou exclusão de horas.
6. Bloquear datas futuras no calendário.
7. Validar cálculo do streak.
8. Corrigir configuração de CORS.
9. Atualizar README.
10. Documentar API e banco de dados.
11. Criar testes funcionais.
12. Redesenhar login e cadastro.

## 🟡 Prioridade média

13. Exibir detalhes dos estudos no calendário.
14. Padronizar `EstudaAI` para `PHYNIX`.
15. Implementar pesquisa no histórico.
16. Exibir data de desbloqueio das conquistas.
17. Modularizar o JavaScript.
18. Revisar o restante da interface.

## 🟢 Após estabilização do MVP

19. Recuperação de senha.
20. Edição de perfil.
21. Exclusão de conta.
22. Contexto do Planner na IA.
23. Preferências de acessibilidade no banco.
24. Frequência mensal.
25. Filtros das conquistas.

---

## 📌 Legenda

| Status            | Significado                                               |
| ----------------- | --------------------------------------------------------- |
| ⏳ A fazer         | Ainda não iniciado                                        |
| 🔄 Em andamento   | Sendo desenvolvido                                        |
| ✅ Concluído       | Implementado no sistema atual                             |
| 🐛 Bug a corrigir | Funcionalidade existe, mas possui comportamento incorreto |
| 💡 Em avaliação   | Ainda será decidido se entrará no escopo                  |
| 🔴 Crítica        | Deve ser resolvido antes das demais melhorias             |

---

## 🔗 Links úteis

* [Repositório do projeto](https://github.com/informaticaseed/tcc-2026-3c-chat-bot-de-estudos)
* [Issues do projeto](https://github.com/informaticaseed/tcc-2026-3c-chat-bot-de-estudos/issues)
* [Design do PHYNIX no Figma](https://www.figma.com/design/Rk7pLRkH8DiJxWigeim50t/Phynix---TCC-Adryan?node-id=0-1&p=f&t=ZWgRA1FPWAM1MMs5-0)
