-- ═══════════════════════════════════════════════════════════
-- PHYNIX / EstudaAI — Schema do banco de dados
-- Execute este arquivo inteiro no phpMyAdmin ou via:
--   mysql -u root -p < schema.sql
-- ═══════════════════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS phynix CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE phynix;

-- ─────────────────────────────────────────────
-- Usuários
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120)  NOT NULL,
  email         VARCHAR(190)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────
-- Matérias do planner (ea_subjects)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subjects (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  name          VARCHAR(120) NOT NULL,
  target_hours  DECIMAL(6,1) NOT NULL DEFAULT 0,
  days_per_week VARCHAR(20)  DEFAULT '5',
  color         VARCHAR(9)   DEFAULT '#4f8aff',
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────
-- Horas por mês/matéria (ea_hours_log)
-- ─────────────────────────────────────────────
-- Horas por mês/matéria (ea_hours_log)
CREATE TABLE IF NOT EXISTS hours_log (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT NOT NULL,
  subject_id   INT NOT NULL,
  ym           CHAR(7) NOT NULL,           -- formato 'YYYY-MM' (chamado "ym" pois
                                            -- "year_month" é palavra reservada do
                                            -- MySQL/MariaDB — usar sem aspas quebra o CREATE TABLE)
  hours        DECIMAL(6,1) NOT NULL DEFAULT 0,
  UNIQUE KEY uniq_month (user_id, subject_id, ym),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- ─────────────────────────────────────────────
-- Dias marcados como estudados (ea_days)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS studied_days (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  user_id  INT NOT NULL,
  day      DATE NOT NULL,
  UNIQUE KEY uniq_day (user_id, day),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────
-- Matérias concluídas por dia — foguinhos (ea_daily_completions)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS daily_completions (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  day         DATE NOT NULL,
  subject_id  INT NOT NULL,
  UNIQUE KEY uniq_completion (user_id, day, subject_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────
-- Horas/conclusões agregadas por dia — usado no calendário (ea_study_log)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS study_log (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT NOT NULL,
  day          DATE NOT NULL,
  hours        DECIMAL(6,1) NOT NULL DEFAULT 0,
  completions  INT NOT NULL DEFAULT 0,
  UNIQUE KEY uniq_log_day (user_id, day),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────
-- Conquistas desbloqueadas (ea_achievements)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS achievements (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  user_id         INT NOT NULL,
  achievement_id  VARCHAR(50) NOT NULL,
  unlocked_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_ach (user_id, achievement_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────
-- Histórico de conversas (ea_chat_history)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_sessions (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  preview     VARCHAR(255) DEFAULT '',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS chat_messages (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  session_id  INT NOT NULL,
  role        ENUM('user','assistant') NOT NULL,
  content     TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ─────────────────────────────────────────────
-- Configurações do usuário — meta diária (ea_goal)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
  user_id           INT PRIMARY KEY,
  daily_goal_hours  INT NOT NULL DEFAULT 4,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
