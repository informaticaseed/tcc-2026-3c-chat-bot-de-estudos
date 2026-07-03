# TCC 2026 — [Nome do Grupo]
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

## ⚡ Comandos rápidos

```bash
# Clonar o repositório
git clone <URL>

# Rodar o projeto
pip install -r requirements.txt
python src/app.py

# Rodar os testes
pytest tests/ -v
```
