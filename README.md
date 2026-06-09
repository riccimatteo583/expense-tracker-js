# Expense Tracker (Vanilla JS)

A simple, responsive personal expense tracker built with plain HTML, CSS, and JavaScript. Data is stored locally in the browser using localStorage — no backend, no accounts.

Features

- Add, edit, and delete expenses
- Filter expenses by category
- Filter expenses by date range
- View total spending for current filter
- Export and import expenses as CSV for backup
- Choose display currency (USD, EUR, GBP, JPY, AUD) — affects display only
- Light and dark themes with preference saved
- Responsive layout for desktop and mobile
- Clean, modern UI
- All data stored in localStorage under the key `expenseTracker.expenses`

Files

- index.html — main HTML file
- css/style.css — styles
- js/app.js — application logic and initialization
- js/storage.js — localStorage wrapper with CSV export/import and settings
- js/ui.js — DOM rendering and UI helpers
- README.md — this file
- .gitignore

Installation

1. Clone the repository

   git clone https://github.com/riccimatteo583/expense-tracker-js.git
   cd expense-tracker-js

2. Open index.html in your browser (double-click or use a local server)

   - To use a simple local server with Python 3:
     python -m http.server 8000
     Open http://localhost:8000

Usage

- Fill the form at the top to add a new expense.
- Click the pencil icon to edit an expense; the form will switch to edit mode.
- Click the trash icon to delete an expense.
- Use the Filter dropdown to view expenses by category; the total updates accordingly.
- Use the Date range inputs to limit results by date.
- Change the Currency selector to adjust how amounts are displayed (no conversion).
- Use Export CSV to download a backup file.
- Use Import CSV to merge expenses from a CSV backup. The CSV should have a header with columns: id,description,amount,category,date,createdAt. Missing ids will be generated. Rows with invalid data are skipped.
- Theme toggle in the header switches between light and dark themes and is saved to your browser.

Notes

- Import merges rows and avoids duplicates by id.
- Currency selection affects only display formatting.

License

This project is provided as-is.
