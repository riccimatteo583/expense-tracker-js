const STORAGE_KEY = 'expenseTracker.expenses';
export const storage = {
  get() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },
  save(expenses) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  },
  add(expense) {
    const all = this.get();
    all.push(expense);
    this.save(all);
    return expense;
  },
  update(id, updates) {
    const all = this.get();
    const idx = all.findIndex(e => e.id === id);
    if (idx === -1) return null;
    all[idx] = {...all[idx], ...updates};
    this.save(all);
    return all[idx];
  },
  remove(id) {
    const all = this.get();
    const filtered = all.filter(e => e.id !== id);
    this.save(filtered);
    return filtered;
  }
};
