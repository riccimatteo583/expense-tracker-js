const STORAGE_KEY = 'expenseTracker.expenses';
const SETTINGS_KEY = 'expenseTracker.settings';

function readSettings(){
  try{const raw = localStorage.getItem(SETTINGS_KEY); return raw?JSON.parse(raw):{};}catch{return{}}}
function writeSettings(s){localStorage.setItem(SETTINGS_KEY,JSON.stringify(s));}

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
  },
  exportCSV(){
    const arr = this.get();
    const header = ['id','description','amount','category','date','createdAt'];
    function esc(v){
      const s = v==null?'':String(v);
      if (/[",\n]/.test(s)) return '"'+s.replace(/"/g,'""')+'"';
      return s;
    }
    const lines = [header.join(',')];
    for (const r of arr){
      lines.push([r.id,r.description,r.amount,r.category,r.date,r.createdAt].map(esc).join(','));
    }
    return lines.join('\n');
  },
  importCSV(csv){
    if (!csv) return {imported:0,errors:['empty input']};
    const rows = parseCSVRows(csv);
    if (!rows.length) return {imported:0,errors:['no rows']};
    const header = rows[0].map(h=>h.trim().toLowerCase());
    const idx = {id:header.indexOf('id'),description:header.indexOf('description'),amount:header.indexOf('amount'),category:header.indexOf('category'),date:header.indexOf('date'),createdAt:header.indexOf('createdat')};
    const out=[];const errors=[];
    for (let i=1;i<rows.length;i++){
      const r=rows[i];
      if (r.length === 0 || (r.length===1 && r[0]==='')) continue;
      const obj={};
      obj.id = idx.id>-1 && r[idx.id] ? r[idx.id] : null;
      obj.description = idx.description>-1 ? (r[idx.description]||'') : '';
      obj.amount = idx.amount>-1 ? Number(r[idx.amount]) : NaN;
      obj.category = idx.category>-1 ? (r[idx.category]||'') : '';
      obj.date = idx.date>-1 ? (r[idx.date]||'') : '';
      obj.createdAt = idx.createdAt>-1 && r[idx.createdAt] ? Number(r[idx.createdAt]) : Date.now();
      if (!obj.description || !isFinite(obj.amount) || obj.amount<0 || !obj.date){
        errors.push(`row ${i+1}: invalid data`);
        continue;
      }
      if (!obj.id) obj.id = (Date.now().toString(36)+Math.random().toString(36).slice(2,8));
      out.push(obj);
    }
    if (out.length){
      const existing = this.get();
      // merge: skip items with same id
      const map = new Map(existing.map(e=>[e.id,e]));
      for (const o of out){ if (!map.has(o.id)) map.set(o.id,o); }
      const merged = Array.from(map.values()).sort((a,b)=>b.createdAt - a.createdAt);
      this.save(merged);
    }
    return {imported:out.length,errors};

    function parseCSVRows(text){
      const rows=[];let i=0;const len=text.length;let cur='';let row=[];let inQuotes=false;
      while(i<len){
        const ch=text[i];
        if (inQuotes){
          if (ch==='"'){
            if (text[i+1]==='"'){cur+='"';i+=2;continue;} else {inQuotes=false;i++;continue}
          } else {cur+=ch;i++;continue}
        } else {
          if (ch==='"'){inQuotes=true;i++;continue}
          if (ch===','){row.push(cur);cur='';i++;continue}
          if (ch==='\r'){i++;continue}
          if (ch==='\n'){row.push(cur);rows.push(row);row=[];cur='';i++;continue}
          cur+=ch;i++;continue
        }
      }
      // end
      if (inQuotes){ /* malformed, but try to close */ }
      if (cur!=='' || row.length){ row.push(cur); rows.push(row); }
      return rows;
    }
  },
  getSetting(key){
    const s = readSettings();
    return s[key];
  },
  setSetting(key,val){
    const s = readSettings(); s[key]=val; writeSettings(s);
  }
};
