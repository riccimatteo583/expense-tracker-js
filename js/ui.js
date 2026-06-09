function el(sel){return document.querySelector(sel)}
function money(n){return n.toLocaleString(undefined,{style:'currency',currency:'USD'})}
export const ui = {
  get els(){
    return {
      form: el('#expense-form'),
      desc: el('#description'),
      amount: el('#amount'),
      category: el('#category'),
      date: el('#date'),
      submitBtn: el('#submit-btn'),
      resetBtn: el('#reset-btn'),
      filter: el('#filter-category'),
      list: el('#expenses-list'),
      total: el('#total-amount')
    };
  },
  populateDate(){
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth()+1).padStart(2,'0');
    const dd = String(d.getDate()).padStart(2,'0');
    this.els.date.value = `${yyyy}-${mm}-${dd}`;
  },
  clearForm(){
    this.els.form.reset();
    this.populateDate();
    this.els.submitBtn.textContent = 'Add Expense';
  },
  setEditMode(expense){
    this.els.desc.value = expense.description;
    this.els.amount.value = expense.amount;
    this.els.category.value = expense.category;
    this.els.date.value = expense.date;
    this.els.submitBtn.textContent = 'Save Changes';
  },
  renderList(expenses){
    const ul = this.els.list;
    ul.innerHTML = '';
    if (!expenses.length){
      ul.innerHTML = `<li class="empty">No expenses yet</li>`;
      return;
    }
    for (const e of expenses){
      const li = document.createElement('li');
      li.className = 'expense-item';
      li.dataset.id = e.id;

      const left = document.createElement('div');
      left.className = 'expense-left';
      const meta = document.createElement('div');
      meta.className = 'expense-meta';
      const desc = document.createElement('div');
      desc.className = 'expense-desc';
      desc.textContent = e.description;
      const cat = document.createElement('div');
      cat.className = 'expense-cat';
      cat.textContent = `${e.category} • ${e.date}`;
      meta.appendChild(desc);
      meta.appendChild(cat);
      left.appendChild(meta);

      const right = document.createElement('div');
      right.className = 'expense-right';
      const amt = document.createElement('div');
      amt.className = 'amount';
      amt.textContent = money(Number(e.amount));

      const editBtn = document.createElement('button');
      editBtn.className = 'icon-btn edit';
      editBtn.title = 'Edit';
      editBtn.innerHTML = '✏️';
      editBtn.addEventListener('click', ()=>{
        const ev = new CustomEvent('expense:edit',{detail:e});
        window.dispatchEvent(ev);
      });

      const delBtn = document.createElement('button');
      delBtn.className = 'icon-btn delete';
      delBtn.title = 'Delete';
      delBtn.innerHTML = '🗑️';
      delBtn.addEventListener('click', ()=>{
        const ev = new CustomEvent('expense:delete',{detail:{id:e.id}});
        window.dispatchEvent(ev);
      });

      right.appendChild(amt);
      right.appendChild(editBtn);
      right.appendChild(delBtn);

      li.appendChild(left);
      li.appendChild(right);
      ul.appendChild(li);
    }
  },
  renderTotal(expenses){
    const total = expenses.reduce((s,n)=>s+Number(n.amount),0);
    this.els.total.textContent = money(total);
  },
  renderFilterOptions(expenses){
    const categories = Array.from(new Set(expenses.map(e=>e.category))).filter(Boolean);
    const sel = this.els.filter;
    const cur = sel.value || 'all';
    sel.innerHTML = '<option value="all">All Categories</option>';
    for (const c of categories){
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      sel.appendChild(opt);
    }
    sel.value = cur;
  }
};
