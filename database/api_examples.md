# API Implementation Examples

This file contains example API implementations for the Personal Finance Management Application.

## Laravel/PHP Examples

### ExpenseController.php
```php
<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\HistoryLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        $query = Expense::with(['category', 'source'])
            ->where('user_id', Auth::id());

        // Apply filters
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('source_id')) {
            $query->where('source_id', $request->source_id);
        }

        if ($request->has('date_from')) {
            $query->where('expense_date', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->where('expense_date', '<=', $request->date_to);
        }

        $expenses = $query->orderBy('expense_date', 'desc')
            ->paginate(50);

        return response()->json($expenses);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:expense_categories,id',
            'source_id' => 'required|exists:expense_sources,id',
            'amount' => 'required|numeric|min:0',
            'expense_date' => 'required|date',
            'notes' => 'nullable|string|max:1000'
        ]);

        $expense = Expense::create([
            'user_id' => Auth::id(),
            'category_id' => $request->category_id,
            'source_id' => $request->source_id,
            'amount' => $request->amount,
            'expense_date' => $request->expense_date,
            'notes' => $request->notes
        ]);

        // Log the activity
        HistoryLog::create([
            'user_id' => Auth::id(),
            'action' => 'create',
            'entity_type' => 'expense',
            'entity_id' => $expense->id,
            'entity_name' => $expense->category->name . ' - ' . $expense->amount,
            'details' => "Added expense of Rp " . number_format($expense->amount) . " for " . $expense->category->name,
            'new_data' => $expense->toJson(),
            'amount' => $expense->amount
        ]);

        return response()->json($expense->load(['category', 'source']), 201);
    }

    public function destroy($id)
    {
        $expense = Expense::with(['category', 'source'])
            ->where('user_id', Auth::id())
            ->findOrFail($id);

        // Log before deletion
        HistoryLog::create([
            'user_id' => Auth::id(),
            'action' => 'delete',
            'entity_type' => 'expense',
            'entity_id' => $expense->id,
            'entity_name' => $expense->category->name . ' - ' . $expense->amount,
            'details' => "Deleted expense of Rp " . number_format($expense->amount) . " for " . $expense->category->name,
            'old_data' => $expense->toJson(),
            'amount' => $expense->amount
        ]);

        $expense->delete();

        return response()->json(['message' => 'Expense deleted successfully']);
    }
}
```

### AnalyticsController.php
```php
<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    public function dashboard()
    {
        $userId = Auth::id();
        $today = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();
        $thisYear = Carbon::now()->startOfYear();

        // Calculate totals
        $totalToday = Expense::where('user_id', $userId)
            ->whereDate('expense_date', $today)
            ->sum('amount');

        $totalThisMonth = Expense::where('user_id', $userId)
            ->where('expense_date', '>=', $thisMonth)
            ->sum('amount');

        $totalThisYear = Expense::where('user_id', $userId)
            ->where('expense_date', '>=', $thisYear)
            ->sum('amount');

        // Highest category this month
        $highestCategory = Expense::select('category_id', DB::raw('SUM(amount) as total'))
            ->with('category')
            ->where('user_id', $userId)
            ->where('expense_date', '>=', $thisMonth)
            ->groupBy('category_id')
            ->orderBy('total', 'desc')
            ->first();

        // Top source this month
        $topSource = Expense::select('source_id', DB::raw('SUM(amount) as total'))
            ->with('source')
            ->where('user_id', $userId)
            ->where('expense_date', '>=', $thisMonth)
            ->groupBy('source_id')
            ->orderBy('total', 'desc')
            ->first();

        return response()->json([
            'totalToday' => $totalToday,
            'totalThisMonth' => $totalThisMonth,
            'totalThisYear' => $totalThisYear,
            'highestCategory' => [
                'name' => $highestCategory->category->name ?? 'None',
                'amount' => $highestCategory->total ?? 0
            ],
            'topSource' => [
                'name' => $topSource->source->name ?? 'None',
                'amount' => $topSource->total ?? 0
            ]
        ]);
    }

    public function trends(Request $request)
    {
        $userId = Auth::id();
        $timeFrame = $request->get('timeFrame', 'month');

        if ($timeFrame === 'month') {
            $data = Expense::select(
                DB::raw('DAY(expense_date) as day'),
                DB::raw('SUM(amount) as total')
            )
            ->where('user_id', $userId)
            ->whereMonth('expense_date', Carbon::now()->month)
            ->whereYear('expense_date', Carbon::now()->year)
            ->groupBy('day')
            ->orderBy('day')
            ->get();
        } else {
            $data = Expense::select(
                DB::raw('MONTH(expense_date) as month'),
                DB::raw('SUM(amount) as total')
            )
            ->where('user_id', $userId)
            ->whereYear('expense_date', Carbon::now()->year)
            ->groupBy('month')
            ->orderBy('month')
            ->get();
        }

        return response()->json($data);
    }
}
```

## Node.js/Express Examples

### expenseRoutes.js
```javascript
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');

// Get all expenses
router.get('/', auth, async (req, res) => {
    try {
        const { category_id, source_id, date_from, date_to } = req.query;
        let query = `
            SELECT e.*, c.name as category_name, c.icon as category_icon, 
                   s.name as source_name, s.icon as source_icon
            FROM expenses e
            JOIN expense_categories c ON e.category_id = c.id
            JOIN expense_sources s ON e.source_id = s.id
            WHERE e.user_id = ?
        `;
        const params = [req.user.id];

        if (category_id) {
            query += ' AND e.category_id = ?';
            params.push(category_id);
        }

        if (source_id) {
            query += ' AND e.source_id = ?';
            params.push(source_id);
        }

        if (date_from) {
            query += ' AND e.expense_date >= ?';
            params.push(date_from);
        }

        if (date_to) {
            query += ' AND e.expense_date <= ?';
            params.push(date_to);
        }

        query += ' ORDER BY e.expense_date DESC LIMIT 100';

        const [expenses] = await db.execute(query, params);
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create expense
router.post('/', auth, async (req, res) => {
    try {
        const { category_id, source_id, amount, expense_date, notes } = req.body;

        // Validate input
        if (!category_id || !source_id || !amount || !expense_date) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Insert expense
        const [result] = await db.execute(
            'INSERT INTO expenses (user_id, category_id, source_id, amount, expense_date, notes) VALUES (?, ?, ?, ?, ?, ?)',
            [req.user.id, category_id, source_id, amount, expense_date, notes]
        );

        // Get the created expense with relations
        const [expense] = await db.execute(`
            SELECT e.*, c.name as category_name, c.icon as category_icon,
                   s.name as source_name, s.icon as source_icon
            FROM expenses e
            JOIN expense_categories c ON e.category_id = c.id
            JOIN expense_sources s ON e.source_id = s.id
            WHERE e.id = ?
        `, [result.insertId]);

        // Log the activity
        await db.execute(
            'INSERT INTO history_logs (user_id, action, entity_type, entity_id, entity_name, details, new_data, amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
                req.user.id,
                'create',
                'expense',
                result.insertId,
                `${expense[0].category_name} - ${amount}`,
                `Added expense of Rp ${amount.toLocaleString('id-ID')} for ${expense[0].category_name}`,
                JSON.stringify(expense[0]),
                amount
            ]
        );

        res.status(201).json(expense[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
```

### historyRoutes.js
```javascript
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');

// Get history logs
router.get('/', auth, async (req, res) => {
    try {
        const { action, entity_type, timeFrame } = req.query;
        let query = 'SELECT * FROM history_logs WHERE user_id = ?';
        const params = [req.user.id];

        if (action && action !== 'all') {
            query += ' AND action = ?';
            params.push(action);
        }

        if (entity_type && entity_type !== 'all') {
            query += ' AND entity_type = ?';
            params.push(entity_type);
        }

        if (timeFrame && timeFrame !== 'all') {
            switch (timeFrame) {
                case 'today':
                    query += ' AND DATE(created_at) = CURDATE()';
                    break;
                case 'week':
                    query += ' AND created_at >= DATE_SUB(NOW(), INTERVAL 1 WEEK)';
                    break;
                case 'month':
                    query += ' AND created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)';
                    break;
            }
        }

        query += ' ORDER BY created_at DESC LIMIT 200';

        const [logs] = await db.execute(query, params);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Clear history logs
router.delete('/', auth, async (req, res) => {
    try {
        await db.execute('DELETE FROM history_logs WHERE user_id = ?', [req.user.id]);
        res.json({ message: 'History cleared successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
```

## Deployment Notes

### For Netlify Functions
Since Netlify doesn't support traditional databases, you would need to:
1. Use a cloud database service (PlanetScale, Supabase, etc.)
2. Create serverless functions for API endpoints
3. Use environment variables for database connection

### For Traditional Hosting
1. Upload SQL files to your hosting provider
2. Create database and import schema
3. Configure environment variables
4. Deploy your backend API
5. Update frontend API endpoints

### Environment Variables
```env
# Database
DB_HOST=your-database-host
DB_PORT=3306
DB_DATABASE=finance_app
DB_USERNAME=your-username
DB_PASSWORD=your-password

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d

# App
APP_URL=https://your-domain.com
API_URL=https://api.your-domain.com
```