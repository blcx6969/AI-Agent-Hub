const Memory = {
  data: JSON.parse(localStorage.getItem('memory') || '[]'),
  currentCat: 'all',
  save() { localStorage.setItem('memory', JSON.stringify(this.data)); },
  init() {
    this.render();
    document.getElementById('btn-add-memory').addEventListener('click', () => this.add());
    document.getElementById('memory-search').addEventListener('input', () => this.render());
    document.querySelectorAll('.memory-cat').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.memory-cat').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentCat = btn.dataset.cat;
        this.render();
      });
    });
  },
  render() {
    const list = document.getElementById('memory-list');
    if (!list) return;
    const search = (document.getElementById('memory-search')?.value || '').toLowerCase();
    const filtered = this.data.filter(item => {
      if (this.currentCat !== 'all' && item.cat !== this.currentCat) return false;
      if (search && !item.title.toLowerCase().includes(search) && !item.content.toLowerCase().includes(search)) return false;
      return true;
    });
    list.innerHTML = filtered.length ? '' : '<div class="memory-item" style="text-align:center;color:var(--text3);padding:24px">没有找到相关内容</div>';
    filtered.forEach(item => {
      const div = document.createElement('div');
      div.className = 'memory-item';
      div.innerHTML = '<div class="head"><span class="tag">'+item.cat+'</span><span class="title">'+item.title+'</span></div>' +
        '<div class="preview">'+item.content+'</div><div class="time">'+item.time+'</div>';
      div.addEventListener('click', () => {
        const expanded = div.querySelector('.preview');
        if (expanded) {
          if (expanded.style.webkitLineClamp === 'unset') {
            expanded.style.webkitLineClamp = '2';
          } else {
            expanded.style.webkitLineClamp = 'unset';
          }
        }
      });
      list.appendChild(div);
    });
  },
  add() {
    const title = prompt('知识标题：');
    if (!title) return;
    const content = prompt('知识内容：');
    if (!content) return;
    const cats = ['project','workflow','contact','spec'];
    let cat = prompt('分类 (project/workflow/contact/spec)：', 'project');
    if (!cats.includes(cat)) cat = 'project';
    this.data.unshift({ title, content, cat, time: new Date().toLocaleString('zh-CN') });
    this.save(); this.render();
  }
};
document.addEventListener('DOMContentLoaded', () => Memory.init());
