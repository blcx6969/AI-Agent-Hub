const Tasks = {
  data: JSON.parse(localStorage.getItem('tasks') || '[]'),
  save() { localStorage.setItem('tasks', JSON.stringify(this.data)); },
  init() {
    this.render();
    document.getElementById('btn-new-task').addEventListener('click', () => this.new());
  },
  render() {
    const list = document.getElementById('task-list');
    const total = document.getElementById('task-total');
    const done = document.getElementById('task-done');
    const running = document.getElementById('task-running');
    const failed = document.getElementById('task-failed');
    if (!list) return;
    let t=0,d=0,r=0,f=0;
    list.innerHTML = this.data.length ? '' : '<div class="memory-item" style="text-align:center;color:var(--text3);padding:24px">暂无任务，点击上方按钮创建</div>';
    this.data.forEach((task, idx) => {
      const status = task.status || 'pending';
      if (status==='done') d++; else if (status==='running') r++; else if (status==='failed') f++;
      t++;
      const subs = task.subtasks ? task.subtasks.map(s => '<li>'+s+'</li>').join('') : '';
      const actions = status==='pending' ? '<button class="btn btn-primary" onclick="Tasks.run('+idx+')">执行</button><button class="btn" onclick="Tasks.del('+idx+')">删除</button>' :
                      status==='running' ? '<button class="btn" onclick="Tasks.complete('+idx+')">完成</button>' :
                      '';
      const card = document.createElement('div');
      card.className = 'task-card';
      card.innerHTML = '<div class="head"><span class="status-dot '+status+'"></span><span class="task-title">'+task.title+'</span></div>' +
        (task.desc ? '<div class="task-desc">'+task.desc+'</div>' : '') +
        (subs ? '<ul class="task-sub">'+subs+'</ul>' : '') +
        (task.time ? '<div class="task-time">'+task.time+'</div>' : '') +
        (actions ? '<div class="task-actions">'+actions+'</div>' : '');
      list.appendChild(card);
    });
    if (total) { total.textContent = t; done.textContent = d; running.textContent = r; failed.textContent = f; }
  },
  new() {
    const title = prompt('任务名称：');
    if (!title) return;
    const desc = prompt('任务描述（可选）：');
    const time = new Date().toLocaleString('zh-CN');
    this.data.unshift({ title, desc: desc||'', status: 'pending', subtasks: [], time });
    this.save(); this.render();
  },
  run(idx) {
    this.data[idx].status = 'running';
    this.data[idx].time = new Date().toLocaleString('zh-CN');
    this.save(); this.render();
    this.simulate(idx);
  },
  async simulate(idx) {
    const task = this.data[idx];
    if (!task.desc) { task.status = 'done'; this.save(); this.render(); return; }
    // 简单模拟任务分解
    const steps = task.desc.split(/[,，、;；]/).filter(s => s.trim()).map(s => s.trim());
    task.subtasks = steps.length ? steps : [task.desc];
    this.save(); this.render();
    // 逐个执行
    for (let i = 0; i < task.subtasks.length; i++) {
      await new Promise(r => setTimeout(r, 1000));
      if (this.data[idx]?.status !== 'running') break;
    }
    if (this.data[idx]?.status === 'running') {
      this.data[idx].status = 'done';
      this.data[idx].time = new Date().toLocaleString('zh-CN');
      this.save(); this.render();
    }
  },
  complete(idx) { this.data[idx].status = 'done'; this.save(); this.render(); },
  del(idx) { this.data.splice(idx, 1); this.save(); this.render(); }
};
document.addEventListener('DOMContentLoaded', () => Tasks.init());
