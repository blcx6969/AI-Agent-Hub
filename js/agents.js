// ===== Agents Module (CellClaw & Tasker) =====
const Agents = {
  init() {
    document.querySelectorAll('.agent-card .head').forEach(h => {
      h.addEventListener('click', () => {
        const body = h.nextElementSibling;
        body.classList.toggle('show');
      });
    });
    document.getElementById('cellclaw-toggle').addEventListener('change', (e) => {
      App.config.cellclawEnabled = e.target.checked;
      localStorage.setItem('cellclaw_enabled', e.target.checked ? '1' : '0');
    });
    document.getElementById('tasker-toggle').addEventListener('change', (e) => {
      App.config.taskerEnabled = e.target.checked;
      localStorage.setItem('tasker_enabled', e.target.checked ? '1' : '0');
    });
    document.getElementById('cellclaw-url').addEventListener('input', (e) => {
      App.config.cellclawUrl = e.target.value;
      localStorage.setItem('cellclaw_url', e.target.value);
    });
    document.getElementById('cellclaw-key').addEventListener('input', (e) => {
      App.config.cellclawKey = e.target.value;
      localStorage.setItem('cellclaw_key', e.target.value);
    });
    document.getElementById('tasker-url').addEventListener('input', (e) => {
      App.config.taskerUrl = e.target.value;
      localStorage.setItem('tasker_url', e.target.value);
    });
    document.querySelector('.test-btn[data-agent="cellclaw"]').addEventListener('click', () => this.testCellClaw());
    document.getElementById('cellclaw-commands').addEventListener('change', (e) => {
      if (e.target.value) this.sendCellClawCommand(e.target.value);
      e.target.value = '';
    });
    document.querySelector('.save-workflows')?.addEventListener('click', () => this.saveWorkflows());
    document.querySelector('.add-workflow')?.addEventListener('click', () => this.addWorkflow());
    this.loadConfig();
  },
  loadConfig() {
    document.getElementById('cellclaw-url').value = App.config.cellclawUrl || '';
    document.getElementById('cellclaw-key').value = App.config.cellclawKey || '';
    document.getElementById('tasker-url').value = App.config.taskerUrl || '';
    document.getElementById('cellclaw-toggle').checked = localStorage.getItem('cellclaw_enabled') === '1';
    document.getElementById('tasker-toggle').checked = localStorage.getItem('tasker_enabled') === '1';
  },
  async testCellClaw() {
    const url = App.config.cellclawUrl;
    if (!url) { toast('请先配置 CellClaw 地址'); return; }
    try {
      const r = await fetch(url + '/status', { signal: AbortSignal.timeout(3000) });
      if (r.ok) { toast('CellClaw 连接成功'); Dashboard.updateStatus('cellclaw', 'online'); }
      else { toast('CellClaw 连接失败'); Dashboard.updateStatus('cellclaw', 'offline'); }
    } catch(e) { toast('CellClaw 连接失败：' + e.message); Dashboard.updateStatus('cellclaw', 'offline'); }
  },
  async sendCellClawCommand(cmd) {
    const url = App.config.cellclawUrl;
    if (!url) { toast('请先配置 CellClaw'); return; }
    try {
      const r = await fetch(url + '/api/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: cmd })
      });
      if (r.ok) toast('命令已发送: ' + cmd);
      else toast('命令发送失败');
    } catch(e) { toast('命令发送失败：' + e.message); }
  },
  addWorkflow() {
    const list = document.getElementById('tasker-workflows');
    const item = document.createElement('div');
    item.className = 'workflow-item';
    item.innerHTML = '<select class="tasker-action"><option value="">选择触发事件...</option><option value="time">定时触发</option><option value="notification">通知监听</option><option value="app">应用启动</option><option value="battery">电量变化</option></select><select class="tasker-action"><option value="">选择动作...</option><option value="cellclaw">调用 CellClaw</option><option value="notify">发送通知</option><option value="http">HTTP 请求</option><option value="mcp">MCP 查询</option></select><button class="btn icon-only" onclick="this.parentElement.remove()">×</button>';
    list.appendChild(item);
  },
  saveWorkflows() {
    const items = document.querySelectorAll('.workflow-item');
    const workflows = [];
    items.forEach(item => {
      const selects = item.querySelectorAll('select');
      if (selects[0]?.value && selects[1]?.value) {
        workflows.push({ trigger: selects[0].value, action: selects[1].value });
      }
    });
    localStorage.setItem('tasker_workflows', JSON.stringify(workflows));
    toast('工作流已保存 (' + workflows.length + ' 条)');
  }
};
document.addEventListener('DOMContentLoaded', () => Agents.init());
