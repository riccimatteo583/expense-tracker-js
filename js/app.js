import {storage} from './storage.js';
import {ui} from './ui.js';

function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8)}

const state = {editingId: null, expenses: [], currency: 'USD', formatter: null};

function loadSettings(){
  const cur = storage.getSetting('currency') || 'USD';
  state.currency = cur;
  state.formatter = new Intl.NumberFormat(undefined,{style:'currency',currency:state.currency,minFractionDigits:2});
  ui.els.currencySelect.value = state.currency;
  const theme = storage.getSetting('theme') || 'light';
  setTheme(theme);
}

function load(){
  state.expenses = storage.get().sort((a,b)=>b.createdAt - a.createdAt);
  ui.renderFilterOptions(state.expenses);
  render();
}

function applyFilters(list){
  const filter = ui.els.filter.value;
  let out = filter === 'all' ? list.slice() : list.filter(e=>e.category===filter);
  const start = ui.els.startDate.value;
  const end = ui.els.endDate.value;
  if (start){
    const s = new Date(start);
    out = out.filter(e=>new Date(e.date) >= s);
  }
  if (end){
    const ed = new Date(end); ed.setHours(23,59,59,999);
    out = out.filter(e=>new Date(e.date) <= ed);
  }
  return out;
}

function render(){
  const filtered = applyFilters(state.expenses);
  ui.renderList(filtered, state.formatter);
  ui.renderTotal(filtered, state.formatter);
}

function onSubmit(e){
  e.preventDefault();
  const desc = ui.els.desc.value.trim();
  const amount = parseFloat(ui.els.amount.value);
  const category = ui.els.category.value;
  const date = ui.els.date.value;
  if (!desc || !isFinite(amount) || amount < 0 || !category || !date) return;

  if (state.editingId){
    const updated = {description:desc,amount:amount,category,date};
    const res = storage.update(state.editingId, updated);
    if (res){
      state.expenses = storage.get().sort((a,b)=>b.createdAt - a.createdAt);
      state.editingId = null;
      ui.clearForm();
      ui.renderFilterOptions(state.expenses);
      render();
    }
    return;
  }

  const item = {id:uid(),description:desc,amount:amount,category,date,createdAt:Date.now()};
  storage.add(item);
  state.expenses.unshift(item);
  ui.clearForm();
  ui.renderFilterOptions(state.expenses);
  render();
}

function onReset(){
  state.editingId = null;
  ui.clearForm();
}

function onEdit(e){
  const expense = e.detail;
  state.editingId = expense.id;
  ui.setEditMode(expense);
}

function onDelete(e){
  const {id} = e.detail;
  if (!confirm('Delete this expense?')) return;
  state.expenses = storage.remove(id);
  if (state.editingId === id){
    state.editingId = null;
    ui.clearForm();
  }
  ui.renderFilterOptions(state.expenses);
  render();
}

function onFilter(){ render(); }

function onCurrencyChange(){
  const code = ui.els.currencySelect.value || 'USD';
  state.currency = code;
  state.formatter = new Intl.NumberFormat(undefined,{style:'currency',currency:state.currency,minFractionDigits:2});
  storage.setSetting('currency',code);
  render();
}

function onExport(){
  const csv = storage.exportCSV();
  const blob = new Blob([csv],{type:'text/csv;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'expenses-backup.csv';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function onImportFile(files){
  const f = files && files[0];
  if (!f) return;
  try{
    const txt = await f.text();
    const res = storage.importCSV(txt);
    if (res.imported>0) {
      state.expenses = storage.get().sort((a,b)=>b.createdAt - a.createdAt);
      ui.renderFilterOptions(state.expenses);
      render();
      alert(`Imported ${res.imported} expense(s).`);
    } else {
      alert('No valid rows imported.');
    }
  }catch(err){
    alert('Failed to import file.');
  }
}

function onImportClick(){
  ui.els.importFile.value = '';
  ui.els.importFile.click();
}

function setTheme(theme){
  const isDark = theme === 'dark';
  document.body.classList.toggle('dark', isDark);
  ui.els.themeToggle.checked = isDark;
  storage.setSetting('theme', isDark ? 'dark' : 'light');
}

function onThemeToggle(){
  const checked = ui.els.themeToggle.checked;
  setTheme(checked ? 'dark' : 'light');
}

function init(){
  ui.populateDate();
  loadSettings();
  load();
  ui.els.form.addEventListener('submit', onSubmit);
  ui.els.resetBtn.addEventListener('click', onReset);
  ui.els.filter.addEventListener('change', onFilter);
  ui.els.startDate.addEventListener('change', onFilter);
  ui.els.endDate.addEventListener('change', onFilter);
  ui.els.currencySelect.addEventListener('change', onCurrencyChange);
  ui.els.exportBtn.addEventListener('click', onExport);
  ui.els.importBtn.addEventListener('click', onImportClick);
  ui.els.importFile.addEventListener('change', (ev)=>onImportFile(ev.target.files));
  window.addEventListener('expense:edit', onEdit);
  window.addEventListener('expense:delete', onDelete);
  ui.els.themeToggle.addEventListener('change', onThemeToggle);
}

init();
