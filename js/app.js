import {storage} from './storage.js';
import {ui} from './ui.js';

function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8)}

const state = {editingId: null, expenses: []};

function load(){
  state.expenses = storage.get().sort((a,b)=>b.createdAt - a.createdAt);
  ui.renderFilterOptions(state.expenses);
  render();
}

function render(){
  const filter = ui.els.filter.value;
  const list = filter === 'all' ? state.expenses : state.expenses.filter(e=>e.category===filter);
  ui.renderList(list);
  ui.renderTotal(list);
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

function init(){
  ui.populateDate();
  load();
  ui.els.form.addEventListener('submit', onSubmit);
  ui.els.resetBtn.addEventListener('click', onReset);
  ui.els.filter.addEventListener('change', onFilter);
  window.addEventListener('expense:edit', onEdit);
  window.addEventListener('expense:delete', onDelete);
}

init();
