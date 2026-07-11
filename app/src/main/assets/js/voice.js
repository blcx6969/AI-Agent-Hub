const Voice = {
  recognition: null,
  isListening: false,
  init() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      const btn = document.getElementById('btn-voice');
      if (btn) btn.style.display = 'none';
      return;
    }
    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'zh-CN';
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.onresult = (e) => {
      let final = '';
      for (const r of e.results) {
        if (r.isFinal) final += r[0].transcript;
      }
      if (final) {
        document.getElementById('voice-text').textContent = final;
        this.close();
        const input = document.getElementById('chat-input');
        if (input) { input.value = final; input.dispatchEvent(new Event('input')); }
        setTimeout(() => {
          const send = document.getElementById('btn-send');
          if (send) send.click();
        }, 300);
      } else {
        const text = e.results[e.results.length-1][0].transcript;
        document.getElementById('voice-text').textContent = text || '...';
      }
    };
    this.recognition.onerror = () => { this.close(); };
    this.recognition.onend = () => { if (this.isListening) this.recognition.start(); };
    document.getElementById('btn-voice').addEventListener('click', () => this.open());
    document.getElementById('voice-close-btn').addEventListener('click', () => this.close());
  },
  open() {
    if (!this.recognition) return;
    this.isListening = true;
    document.getElementById('voice-overlay').classList.remove('hidden');
    document.getElementById('voice-text').textContent = '';
    document.getElementById('voice-status').textContent = '正在聆听...';
    this.recognition.start();
  },
  close() {
    this.isListening = false;
    if (this.recognition) try { this.recognition.stop(); } catch(e) {}
    document.getElementById('voice-overlay').classList.add('hidden');
  }
};
document.addEventListener('DOMContentLoaded', () => Voice.init());
