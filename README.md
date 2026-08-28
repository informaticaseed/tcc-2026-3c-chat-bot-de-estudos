   **LTP3 + QP3 · CEMIC 2026 · Prof. Rafael Martins Alves**

 
---

## 👥 Integrantes   

| Nome completo | GitHub | Turma |
|--------------|--------|-------|    
| Riquelme | @riquelmesouza01 | 3C |
| Adryan | @Adryan16isaque | 3C |
| Livia | @liviaoliveirasantosflor-cloud | 3C |  
| Asafe | @asafe4671-byte | 3C |
| Enzo | @enzosantosdutra | 3C |

**Tema:** CHATBOOT DE ESTUDOS
**Tecnologia:** JavaScript e PHP
| (Carolinne Alves da Mota) | carolinnealvesdamota-cell | 3C |
| (Luiz Eduardo de Toledo Aleixo) | luiztoledoaleixo-cell | 3C |
| (Ana Carolina Carvalho Rodrigues) | anacarolinacarvalhorodrigues-cell | 3C |

**Tema:** (Desenvolvimento de um site informativo sobre Plantas Alimentícias Não Convencionais (PANC’s).)
**Tecnologia:** Python + Flask + SQLite

---

## 🎯 O que o sistema faz

# PHYNIX

O **PHYNIX** é uma plataforma web de estudos para quem está se preparando para o **ENEM** e **vestibulares**. Ele funciona diretamente no navegador, sem necessidade de instalação.

## Funcionalidades

### 💬 Assistente IA
Converse com uma IA (**LLaMA 3.3 via Groq**) para:
- Tirar dúvidas;
- Explicar conteúdos;
- Gerar resumos;
- Criar exercícios sobre qualquer matéria do vestibular.

### 📋 Planner
Organize seus estudos de forma simples:
- Cadastre suas matérias (ex.: Matemática, Física e Redação);
- Defina uma meta de horas para cada disciplina;
- Registre as horas estudadas;
- Acompanhe seu progresso por meio de barras visuais.

### 📅 Calendário
Acompanhe sua rotina de estudos:
- Marque os dias em que estudou;
- Visualize sua sequência de dias consecutivos (*streak*);
- Consulte as horas estudadas no mês e no ano.

### 🏆 Conquistas
Desbloqueie conquistas automaticamente conforme utiliza a plataforma:
- Dias de *streak*;
- Horas estudadas;
- Matérias concluídas;
- Perguntas feitas para a IA;
- Entre outros objetivos.

### 🕓 Histórico
Todas as suas conversas com a IA ficam salvas para que você possa consultá-las e retomá-las sempre que desejar.



(O sistema consiste em um site informativo desenvolvido para divulgar conhecimento sobre as Plantas Alimentícias Não Convencionais (PANC’s). O objetivo é facilitar o acesso da população a informações confiáveis sobre identificação, benefícios e formas de utilização dessas plantas na alimentação do dia a dia.
O site busca promover educação alimentar e conscientização sobre alternativas sustentáveis e nutritivas presentes na biodiversidade brasileira.)

---

## 🔄 Como o grupo trabalha toda semana

1. **Segunda** — cada integrante abre Issues da semana (use o template "Tarefa Semanal")
2. **Durante a semana** — Trabalhamos encima do TCC
3. **Sexta** — o grupo abre 1 Pull Request linkando as Issues concluídas
4. **Push** — métricas de participação aparecem automaticamente no Actions

---


## 📁 Estrutura do projeto

├── README.md                 ← documentação principal do projeto
├── BACKLOG.md                ← funcionalidades planejadas e progresso do MVP
├── docs/
│   ├── arquitetura.md        ← arquitetura do chatbot e fluxo de funcionamento
│   ├── instalacao.md         ← guia de instalação e configuração
│   └── decisoes/             ← registros das decisões técnicas (ADR)
├── diagramas/
│   ├── fluxo-chatbot.png     ← fluxo de conversa do chatbot
│   └── arquitetura.png       ← diagrama da arquitetura do sistema
├── evidencias/
│   ├── tela-inicial.png      ← tela inicial do chatbot
│   ├── pesquisas.png         ← exemplos de pesquisas realizadas
│   └── testes.png            ← capturas dos testes do sistema
├── src/
│   ├── app.py                ← ponto de entrada da aplicação
│   ├── chatbot.py            ← lógica principal do chatbot
│   ├── repositorio.py        ← acesso e gerenciamento dos dados
│   ├── respostas.py          ← respostas e conteúdos de estudo
│   └── utils.py              ← funções auxiliares
├── tests/
│   ├── test_chatbot.py       ← testes do funcionamento do chatbot
│   └── test_repositorio.py   ← testes do repositório de dados
└── requirements.txt          ← dependências do projeto

---

## ⚠️ Segurança — leia antes de tudo

1. **Uma chave de API real (`sk-ant-...`) estava exposta** num arquivo
   `_env` que você enviou. Se ainda não fez, **revogue essa chave
   agora** no painel da Anthropic e gere uma nova. Nunca a coloque de
   volta em texto puro — ela não é usada em nada deste projeto.
2. O `README.md` original avisava que a chave da Groq estava exposta
   no `app.js` antigo. Isso foi corrigido: o chat agora sempre passa
   pelo back-end (`/api/chat.php`), a chave da Groq fica só no
   `config.php` do servidor e nunca é enviada ao navegador.
3. `backend/config/config.php` está no `.gitignore` — edite os
   valores reais nele, mas não o suba pro GitHub. Use
   `config.example.php` como referência/modelo versionável.

---

## 1. Requisitos

- **XAMPP** ou **Laragon** (PHP 8.0+ com `pdo_mysql`, `curl` e
  `mbstring` — as três já vêm ativadas por padrão em ambos, e
  MySQL/MariaDB)
- Uma chave de API da **Groq** (grátis em https://console.groq.com) —
  necessária para o chat funcionar

## 2. Instalação (XAMPP)

1. Copie a pasta `phynix` inteira para dentro de `htdocs`
   (normalmente `C:\xampp\htdocs\phynix` no Windows).
2. Abra o **XAMPP Control Panel** e inicie **Apache** e **MySQL**.
3. Crie o banco de dados: abra o **phpMyAdmin**
   (`http://localhost/phpmyadmin`), vá em "Importar" e envie o
   arquivo `backend/schema.sql` — ele cria o banco `phynix` e todas
   as tabelas automaticamente.
4. Edite `backend/config/config.php`:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'phynix');
   define('DB_USER', 'root');
   define('DB_PASS', '');              // senha padrão do XAMPP é vazia

   define('GROQ_API_KEY', 'gsk_sua_chave_aqui');
   define('GROQ_MODEL', 'llama-3.3-70b-versatile');
   ```
5. Acesse **`http://localhost/phynix/frontend/index.html`** no
   navegador.

Front e back ficam na mesma pasta/domínio (`localhost`), então não é
necessário mexer em `ALLOWED_ORIGIN` — deixe `null`.

## 3. Primeiro uso

A tela inicial agora é de **login/cadastro** (antes esse endpoint
existia no back-end, mas nada no front chamava). Clique em
"Criar conta", cadastre-se, e você já entra logado automaticamente
— sessão via cookie PHP, a mesma sessão de antes.

---

## O que estava quebrado e foi corrigido

| # | Bug | Onde | Correção |
|---|-----|------|----------|
| 1 | `login.php`, `register.php`, `logout.php`, `me.php` importavam `../../api/bootstrap.php`, um arquivo que **nunca existiu** nesse caminho (o real está em `includes/bootstrap.php`) — login e cadastro davam erro fatal de PHP sempre. | `backend/api/auth/*.php` | Caminho do `require_once` corrigido para `../../includes/bootstrap.php`. |
| 2 | `README.md` documentava `GET /api/achievements.php`, mas esse arquivo **nunca foi criado** — só existia o helper interno com as funções de desbloqueio. A aba Conquistas não tinha de onde puxar dados. | `backend/api/` | Criado `backend/api/achievements.php`, endpoint que lista todas as conquistas com status desbloqueada/bloqueada. |
| 3 | O modal "Definir meta diária" existia no HTML e no JS (`openModal()`/`saveGoal()`), mas **nenhum botão o abria** em lugar nenhum — funcionalidade morta. | `frontend/index.html` | Adicionado botão "🎯 Meta diária" na barra lateral. |
| 4 | O chat chamava `https://api.anthropic.com/v1/messages` **direto do navegador, sem enviar nenhuma chave de API** — a requisição sempre falhava (401). Além disso, expor qualquer chave no JS do cliente é inseguro. | `frontend/app.js` | Chat reescrito para chamar `/api/chat.php` no back-end, que já existia pronto pra isso e mantém a chave da Groq só no servidor. |
| 5 | Todo o app (matérias, calendário, conquistas, meta) vivia só no `localStorage` do navegador — o back-end PHP inteiro (auth, banco, conquistas no servidor) tinha sido escrito mas **nunca era chamado**. Dados não persistiam entre dispositivos/navegadores e não existia login de fato. | `frontend/app.js` | Reescrito por completo para consumir a API REST em `backend/api/`: matérias, calendário, conquistas e meta diária agora vêm do MySQL via sessão autenticada. |
| 6 | A lista de conquistas do front-end (`ALL_ACHIEVEMENTS` em `app.js`) tinha **IDs, nomes e descrições completamente diferentes** da lista do back-end (`achievements_helper_.php`) — nunca bateriam. | `frontend/app.js` | Lista hard-coded removida; front agora busca a lista (com ícones/nomes/descrições/segredo) direto de `GET /api/achievements.php`, fonte única de verdade. |
| 7 | Ao desmarcar a última conclusão do dia via "🔥 Concluir hoje" (`complete.php`), o dia ficava marcado como estudado **pra sempre** caso não houvesse horas lançadas — só `subjects.php` fazia essa limpeza, `complete.php` não. | `backend/api/complete.php` | Adicionada a mesma limpeza de `studied_days` que já existia em `subjects.php`. |
| 8 | O arquivo do helper de conquistas se chamava `achievements_helper_.php`, mas todo endpoint (`calendar.php`, `chat.php`, `complete.php`, `subjects.php`) fazia `require_once '../includes/achievements.php'` — nome batendo errado quebraria o `require`. | `backend/includes/` | Renomeado para `achievements.php`. |
| 9 | Uma chave de API real da Anthropic estava exposta em texto puro num arquivo `_env`. | — | Removida do projeto; veja aviso de segurança no topo. Revogue-a se ainda não revogou. |
| 10 | **A tabela `hours_log` nunca conseguiria ser criada em MySQL/MariaDB de verdade.** A coluna se chamava `year_month`, mas `YEAR_MONTH` é palavra reservada do MySQL/MariaDB (usada em expressões `INTERVAL ... YEAR_MONTH`) — usá-la sem aspas como nome de coluna quebra o `CREATE TABLE` com erro de sintaxe. Confirmado rodando o `schema.sql` original contra um MySQL 8 e um MariaDB 10.11 limpos: ambos rejeitam. | `backend/schema.sql`, `backend/includes/stats.php`, `backend/api/subjects.php` | Coluna renomeada para `ym` em todo o schema e em todas as queries que a referenciam. |

Todo esse fluxo foi testado de ponta a ponta de verdade (schema
importado num MySQL real, servidor PHP embutido, requisições HTTP
reais): cadastro → login → sessão → criar matéria → lançar horas →
concluir matéria do dia → calendário/streak → conquistas
desbloqueando automaticamente → configurações → logout. Todos os
`require_once` do PHP também foram validados programaticamente
(nenhum aponta para arquivo inexistente) e todo arquivo `.php` passou
em `php -l` sem erros de sintaxe.

Também adicionados, sem existir antes:
- Botão **"🔥 Concluir hoje"** por matéria no Planner (usa o
  `POST /api/complete.php` que já existia no back-end mas não tinha
  nenhuma interface).
- Botão de **logout** e nome do usuário logado na barra lateral.
- `.gitignore` + `config.example.php`, pra não vazar credenciais de
  novo.

---

## Endpoints da API

Todos em `backend/api/`, devolvem JSON, exigem sessão (cookie) exceto
os de auth. Ver comentário no topo de cada arquivo `.php` para
detalhes de payload.

| Método | Rota | Descrição |
|---|---|---|
| POST | `/api/auth/register.php` | Cria conta e já loga |
| POST | `/api/auth/login.php` | Loga |
| POST | `/api/auth/logout.php` | Encerra sessão |
| GET  | `/api/auth/me.php` | Usuário logado (ou `null`) |
| GET/POST/PUT/DELETE | `/api/subjects.php` | Matérias do planner |
| POST | `/api/complete.php` | Alterna conclusão diária de uma matéria |
| GET/POST | `/api/calendar.php` | Dias estudados / marca dia manualmente |
| GET | `/api/achievements.php` | Lista de conquistas com status |
| POST/GET | `/api/chat.php` | Chat com a IA (via Groq, no servidor) |
| GET/POST | `/api/settings.php` | Meta diária de horas |

---

## Observações

- O `comprovante.pdf` e o `fenix.png` enviados junto com os outros
  arquivos não fazem parte do código — o PDF era um documento pessoal
  enviado por engano e foi descartado; o `fenix.png` é usado como
  logo na tela de login.
- Se o chat der erro "Erro na API da Groq", confira se o modelo em
  `GROQ_MODEL` ainda está disponível na sua conta Groq — a lista de
  modelos gratuitos muda com o tempo.

 
 
