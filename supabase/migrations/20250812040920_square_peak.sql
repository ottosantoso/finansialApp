-- Personal Finance Management Application Database Schema
-- Created for easy deployment and data management

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- EXPENSE CATEGORIES TABLE
-- =============================================
CREATE TABLE expense_categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(10) NOT NULL DEFAULT '📦',
    color VARCHAR(7) NOT NULL DEFAULT '#DDA0DD',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_categories (user_id)
);

-- =============================================
-- EXPENSE SOURCES TABLE
-- =============================================
CREATE TABLE expense_sources (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    type ENUM('bank', 'ewallet', 'cash') NOT NULL,
    icon VARCHAR(10) NOT NULL DEFAULT '🏦',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_sources (user_id)
);

-- =============================================
-- EXPENSES TABLE
-- =============================================
CREATE TABLE expenses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    source_id BIGINT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    expense_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES expense_categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (source_id) REFERENCES expense_sources(id) ON DELETE RESTRICT,
    INDEX idx_user_expenses (user_id),
    INDEX idx_expense_date (expense_date),
    INDEX idx_category_expenses (category_id),
    INDEX idx_source_expenses (source_id)
);

-- =============================================
-- HISTORY LOGS TABLE
-- =============================================
CREATE TABLE history_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    action ENUM('create', 'update', 'delete') NOT NULL,
    entity_type ENUM('expense', 'category', 'source') NOT NULL,
    entity_id BIGINT NOT NULL,
    entity_name VARCHAR(255) NOT NULL,
    details TEXT NOT NULL,
    old_data JSON,
    new_data JSON,
    amount DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_logs (user_id),
    INDEX idx_log_date (created_at),
    INDEX idx_entity_logs (entity_type, entity_id)
);

-- =============================================
-- BUDGETS TABLE (Future Feature)
-- =============================================
CREATE TABLE budgets (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    category_id BIGINT,
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    period ENUM('daily', 'weekly', 'monthly', 'yearly') NOT NULL DEFAULT 'monthly',
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES expense_categories(id) ON DELETE SET NULL,
    INDEX idx_user_budgets (user_id),
    INDEX idx_active_budgets (is_active)
);

-- =============================================
-- RECURRING EXPENSES TABLE (Future Feature)
-- =============================================
CREATE TABLE recurring_expenses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    source_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    frequency ENUM('daily', 'weekly', 'monthly', 'yearly') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    next_due_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES expense_categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (source_id) REFERENCES expense_sources(id) ON DELETE RESTRICT,
    INDEX idx_user_recurring (user_id),
    INDEX idx_due_date (next_due_date),
    INDEX idx_active_recurring (is_active)
);