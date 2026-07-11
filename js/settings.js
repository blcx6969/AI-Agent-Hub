// ===== Settings Module =====
const SMAP = {deepseek_key:'deepseekKey',deepseek_url:'deepseekUrl',deepseek_model:'deepseekModel',mcp_host:'mcpHost',mcp_reconnect:'mcpReconnect',theme:'theme'};
function sv(k,v){App.config[SMAP[k]||k]=v;localStorage.setItem(k,v);}
const $ = document.getElementById.bind(document);
const Settings = {
  init() {
    this.loadSettings();
    this.bindEvents();
  },
  loadSettings() {
    $('#setting-deepseek-key').value = App.config.deepseekKey || '';
    $('#setting-deepseek-url').value = App.config.deepseekUrl || 'https://api.deepseek.com';
    $('#setting-deepseek-model').value = App.config.deepseekModel || 'deepseek-chat';
    $('#setting-mcp-host').value = App.config.mcpHost || 'ws://localhost:8080/mcp';
    $('#setting-mcp-reconnect').checked = App.config.mcpReconnect;
    $('#setting-theme').value = App.config.theme || 'dark';
  },
  bindEvents() {
    $('#setting-deepseek-key').addEventListener('input',e=>sv('deepseek_key',e.target.value));
    $('#setting-deepseek-url').addEventListener('input',e=>sv('deepseek_url',e.target.value));
    $('#setting-deepseek-model').addEventListener('change',e=>sv('deepseek_model',e.target.value));
    $('#setting-mcp-host').addEventListener('input',e=>sv('mcp_host',e.target.value));
    $('#setting-mcp-reconnect').addEventListener('change',e=>sv('mcp_reconnect',e.target.checked?'true':'false'));
    $('#setting-theme').addEventListener('change',e=>{sv('theme',e.target.value);App.applyTheme();});
  }
};
document.addEventListener('DOMContentLoaded',()=>Settings.init());
