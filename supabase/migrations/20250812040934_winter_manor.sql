-- Sample Data for Personal Finance Management Application
-- Insert default categories and sources for testing

-- =============================================
-- SAMPLE USER (for testing)
-- =============================================
INSERT INTO users (email, password_hash, name) VALUES 
('demo@financeapp.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Demo User');

SET @user_id = LAST_INSERT_ID();

-- =============================================
-- DEFAULT EXPENSE CATEGORIES
-- =============================================
INSERT INTO expense_categories (user_id, name, icon, color, is_default) VALUES
(@user_id, 'Food & Drinks', '🍽️', '#FF6B6B', TRUE),
(@user_id, 'Transportation', '🚗', '#4ECDC4', TRUE),
(@user_id, 'Bills & Utilities', '⚡', '#45B7D1', TRUE),
(@user_id, 'Entertainment', '🎬', '#96CEB4', TRUE),
(@user_id, 'Health', '🏥', '#FFEAA7', TRUE),
(@user_id, 'Others', '📦', '#DDA0DD', TRUE);

-- =============================================
-- DEFAULT EXPENSE SOURCES
-- =============================================
-- Bank Accounts
INSERT INTO expense_sources (user_id, name, type, icon, is_default) VALUES
(@user_id, 'BRI', 'bank', '🏦', TRUE),
(@user_id, 'Mandiri', 'bank', '🏦', TRUE),
(@user_id, 'BCA', 'bank', '🏦', TRUE),
(@user_id, 'BNI', 'bank', '🏦', TRUE);

-- E-Wallets
INSERT INTO expense_sources (user_id, name, type, icon, is_default) VALUES
(@user_id, 'GoPay', 'ewallet', '📱', TRUE),
(@user_id, 'OVO', 'ewallet', '📱', TRUE),
(@user_id, 'ShopeePay', 'ewallet', '📱', TRUE),
(@user_id, 'LinkAja', 'ewallet', '📱', TRUE);

-- Cash
INSERT INTO expense_sources (user_id, name, type, icon, is_default) VALUES
(@user_id, 'Cash', 'cash', '💵', TRUE);

-- =============================================
-- SAMPLE EXPENSES (for testing)
-- =============================================
INSERT INTO expenses (user_id, category_id, source_id, amount, expense_date, notes) VALUES
(@user_id, 1, 1, 150000, CURDATE(), 'Lunch at restaurant'),
(@user_id, 2, 5, 25000, CURDATE(), 'Ojek online'),
(@user_id, 1, 9, 50000, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'Coffee and snacks'),
(@user_id, 3, 2, 500000, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'Electricity bill'),
(@user_id, 4, 6, 75000, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 'Movie tickets'),
(@user_id, 5, 3, 200000, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 'Doctor consultation'),
(@user_id, 1, 7, 35000, DATE_SUB(CURDATE(), INTERVAL 7 DAY), 'Breakfast'),
(@user_id, 2, 1, 100000, DATE_SUB(CURDATE(), INTERVAL 10 DAY), 'Fuel'),
(@user_id, 6, 9, 80000, DATE_SUB(CURDATE(), INTERVAL 15 DAY), 'Miscellaneous shopping');

-- =============================================
-- SAMPLE HISTORY LOGS (for testing)
-- =============================================
INSERT INTO history_logs (user_id, action, entity_type, entity_id, entity_name, details, new_data, amount) VALUES
(@user_id, 'create', 'expense', 1, 'Food & Drinks - 150000', 'Added expense of Rp 150,000 for Food & Drinks', '{"amount": 150000, "category": "Food & Drinks", "source": "BRI"}', 150000),
(@user_id, 'create', 'expense', 2, 'Transportation - 25000', 'Added expense of Rp 25,000 for Transportation', '{"amount": 25000, "category": "Transportation", "source": "GoPay"}', 25000),
(@user_id, 'create', 'category', 7, 'Shopping', 'Created new category "Shopping" with icon 🛒', '{"name": "Shopping", "icon": "🛒", "color": "#74B9FF"}', NULL);