# Expense Tracker (Vanilla JS)

A simple, responsive personal expense tracker built with plain HTML, CSS, and JavaScript. Data is stored locally in the browser using localStorage — no backend, no accounts.

Features

- Add, edit, and delete expenses
- Filter expenses by category
- View total spending for current filter
- Responsive layout for desktop and mobile
- Clean, modern UI
- All data stored in localStorage under the key `expenseTracker.expenses`

Files

- index.html — main HTML file
- css/style.css — styles
- js/app.js — application logic and initialization
- js/storage.js — localStorage wrapper
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
- All changes persist in your browser's localStorage.

Deployment

- This is a static project and can be hosted via GitHub Pages or any static hosting service.

License

This project is provided as-is.
