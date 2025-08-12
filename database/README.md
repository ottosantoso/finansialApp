# Database Setup Guide

This directory contains the database schema and sample data for the Personal Finance Management Application.

## Files

- `schema.sql` - Complete database schema with all tables and relationships
- `sample_data.sql` - Sample data for testing and development
- `README.md` - This setup guide

## Database Structure

### Core Tables
- **users** - User accounts and authentication
- **expense_categories** - Customizable expense categories
- **expense_sources** - Payment sources (banks, e-wallets, cash)
- **expenses** - Individual expense records
- **history_logs** - Activity tracking and audit trail

### Future Feature Tables
- **budgets** - Budget management (ready for implementation)
- **recurring_expenses** - Recurring expense tracking (ready for implementation)

## Setup Instructions

### For MySQL/MariaDB

1. Create a new database:
```sql
CREATE DATABASE finance_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE finance_app;
```

2. Import the schema:
```bash
mysql -u your_username -p finance_app < schema.sql
```

3. Import sample data (optional):
```bash
mysql -u your_username -p finance_app < sample_data.sql
```

### For PostgreSQL

1. Create a new database:
```sql
CREATE DATABASE finance_app;
\c finance_app;
```

2. Convert and import schema (you may need to adjust MySQL-specific syntax):
```bash
psql -U your_username -d finance_app -f schema_postgresql.sql
```

### For Development (SQLite)

For local development, you can use SQLite. Convert the schema by:
1. Removing AUTO_INCREMENT and using INTEGER PRIMARY KEY
2. Replacing ENUM with CHECK constraints
3. Adjusting data types as needed

## Environment Variables

Set these environment variables for your application:

```env
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=finance_app
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

## API Endpoints Structure

Based on this schema, your API should include:

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

### Expenses
- `GET /api/expenses` - List user expenses
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/{id}` - Update expense
- `DELETE /api/expenses/{id}` - Delete expense

### Categories
- `GET /api/categories` - List user categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

### Sources
- `GET /api/sources` - List user sources
- `POST /api/sources` - Create new source
- `PUT /api/sources/{id}` - Update source
- `DELETE /api/sources/{id}` - Delete source

### History
- `GET /api/history` - List activity history
- `DELETE /api/history` - Clear history (admin)

### Analytics
- `GET /api/analytics/dashboard` - Dashboard statistics
- `GET /api/analytics/trends` - Expense trends
- `GET /api/analytics/categories` - Category breakdown

## Security Considerations

1. **Password Hashing**: Use bcrypt or similar for password hashing
2. **SQL Injection**: Use prepared statements/parameterized queries
3. **Authentication**: Implement JWT or session-based authentication
4. **Authorization**: Ensure users can only access their own data
5. **Input Validation**: Validate all input data
6. **Rate Limiting**: Implement rate limiting for API endpoints

## Indexing Strategy

The schema includes optimized indexes for:
- User-based queries (most common)
- Date-based filtering
- Category and source lookups
- History log searches

## Backup Strategy

Recommended backup approach:
1. Daily automated backups
2. Weekly full database dumps
3. Transaction log backups (for point-in-time recovery)
4. Test restore procedures regularly

## Migration Strategy

For production deployments:
1. Use database migration tools (Laravel migrations, Flyway, etc.)
2. Version control your schema changes
3. Test migrations on staging environment first
4. Plan for rollback procedures

## Performance Optimization

1. **Partitioning**: Consider partitioning expenses table by date for large datasets
2. **Archiving**: Archive old history logs to maintain performance
3. **Caching**: Implement Redis/Memcached for frequently accessed data
4. **Connection Pooling**: Use connection pooling for better resource management

## Monitoring

Monitor these key metrics:
- Query performance
- Database size growth
- Connection usage
- Slow query log
- Index usage statistics