/* Shared app logic for multi-page To-Do app
   - Data per-user stored at key: todo_data_{email}
   - Current user stored at: todo_current_user
   - Exposes functions used by pages: renderTaskList, createTask, updateTask, deleteTask, getTaskById, computeStats
*/

function userKey(){
  const u = localStorage.getItem('todo_current_user');
  return u ? ('todo_data_' + u) : null;
}
function loadData(){
  const k = userKey(); if(!k) return [];
  return JSON.parse(localStorage.getItem(k) || '[]');
}
function saveData(arr){
  const k = userKey(); if(!k) return;
  localStorage.setItem(k, JSON.stringify(arr));
}

function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,6); }

// Create
function createTask(obj){
  const arr = loadData();
  arr.push(Object.assign({ id: uid(), done:false, createdAt: Date.now() }, obj));
  saveData(arr);
}

// Read helpers
function getTaskById(id){
  const arr = loadData();
  return arr.find(t => t.id === id);
}

// Update
function updateTask(id, newObj){
  const arr = loadData();
  const i = arr.findIndex(t => t.id === id);
  if(i===-1) return;
  arr[i] = Object.assign({}, arr[i], newObj);
  saveData(arr);
}

// Delete
function deleteTask(id){
  const arr = loadData();
  const filtered = arr.filter(t => t.id !== id);
  saveData(filtered);
}

// Render list used on dashboard.html
function renderTaskList(){
  const listRoot = document.getElementById('taskList');
  const emptyEl = document.getElementById('empty');
  if(!listRoot) return;
  const arr = loadData();
  // apply filter
  const filter = document.getElementById('filter') ? document.getElementById('filter').value : 'all';
  let filtered = arr.slice();
  if(filter === 'active') filtered = filtered.filter(t => !t.done);
  if(filter === 'done') filtered = filtered.filter(t => t.done);
  // sort
  const sort = document.getElementById('sort') ? document.getElementById('sort').value : 'created_desc';
  if(sort === 'created_desc') filtered.sort((a,b)=>b.createdAt - a.createdAt);
  if(sort === 'created_asc') filtered.sort((a,b)=>a.createdAt - b.createdAt);
  if(sort === 'priority') filtered.sort((a,b)=> {
    const p = { high:3, medium:2, low:1 };
    return (p[b.priority]||0) - (p[a.priority]||0);
  });

  listRoot.innerHTML = '';
  if(filtered.length === 0){
    emptyEl.style.display = 'block';
    return;
  } else {
    emptyEl.style.display = 'none';
  }

  filtered.forEach((t, index) => {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;flex:1">
        <input type="checkbox" ${t.done ? 'checked' : ''} data-id="${t.id}" aria-label="marcar tarefa">
        <div style="flex:1">
          <div class="todo-text ${t.done ? 'done' : ''}" data-id="${t.id}">${escapeHtml(t.title)}</div>
          <div class="muted" style="font-size:13px">${t.when ? t.when + ' • ' : ''}${t.priority ? capitalize(t.priority) : ''}</div>
        </div>
      </div>
      <div>
        <button class="link-btn" data-id="${t.id}" data-action="edit">✏️</button>
        <button class="delete-btn" data-id="${t.id}">✕</button>
      </div>
    `;
    listRoot.appendChild(li);
  });

  // attach events
  listRoot.querySelectorAll('input[type=checkbox]').forEach(cb=>{
    cb.addEventListener('change', function(e){
      const id = e.target.getAttribute('data-id');
      const task = getTaskById(id);
      if(!task) return;
      updateTask(id, { done: e.target.checked });
      // visual feedback: re-render and announce
      renderTaskList();
    });
  });

  listRoot.querySelectorAll('[data-action=edit]').forEach(btn=>{
    btn.addEventListener('click', function(){
      const id = btn.getAttribute('data-id');
      window.location.href = 'task.html?id=' + encodeURIComponent(id);
    });
  });

  listRoot.querySelectorAll('.delete-btn').forEach(btn=>{
    btn.addEventListener('click', function(){
      const id = btn.getAttribute('data-id');
      if(confirm('Deseja realmente excluir?')){ deleteTask(id); renderTaskList(); }
    });
  });
}

// small helpers
function escapeHtml(text){ return (text+'').replace(/[&<>"']/g, function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]; }); }
function capitalize(s){ return s ? (s.charAt(0).toUpperCase()+s.slice(1)) : ''; }

// computed stats for stats.html
function computeStats(){
  const arr = loadData();
  const total = arr.length;
  const done = arr.filter(t=>t.done).length;
  const pct = total ? Math.round((done/total)*100) : 0;
  if (!humor || !img) return;

  if (arr.length <= 20) {
    humor.textContent = 'Péssimo 😾';
    img.src = 'https://i.imgur.com/zlplSNY.png';
  } else if (arr.length <= 50) {
    humor.textContent = 'Neutro 😐';
    img.src = 'https://i.imgur.com/USC3Bwo.png';
  } else if (arr.length <= 80) {
    humor.textContent = 'Feliz 🙂';
    img.src = 'https://i.imgur.com/Qi4wz5q.png';
  } else {
    humor.textContent = 'Radiante 😺';
    img.src = 'https://i.imgur.com/2Qh8P8l.png';
  }
  return { total, done, pct };


  
}



