import { state } from './state';
import { cleanLikes } from './logic';
import { openModal, updateToggleButton } from './ui-modal';

let tabBtn: HTMLDivElement | null = null;

export function start() {
  if (state.enabled) return;
  state.enabled = true;
  state.currentCount = 0;

  state.cleanTimer = window.setInterval(cleanLikes, state.interval);
  updateToggleButton();
}

export function stop() {
  state.enabled = false;
  if (state.cleanTimer) clearInterval(state.cleanTimer);
  updateToggleButton();
}

export function createTabButton() {
  if (tabBtn) return;

  const tabs = document.querySelector('.reds-tabs-list');
  if (!tabs) return;

  // 添加样式
  const style = document.createElement('style');
  style.textContent = `
    .xhs-auto-unlike-btn {
      padding: 8px 20px;
      background: linear-gradient(135deg, #ff2442 0%, #ff6b6b 100%);
      color: #fff;
      border-radius: 20px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s;
      box-shadow: 0 2px 8px rgba(255, 36, 66, 0.3);
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-left: 12px;
    }
    .xhs-auto-unlike-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 36, 66, 0.4);
    }
    .xhs-auto-unlike-btn:active {
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  tabBtn = document.createElement('div');
  tabBtn.className = 'xhs-auto-unlike-btn';
  tabBtn.innerHTML = '🧹 内容清理';

  tabBtn.onclick = openModal;
  tabs.appendChild(tabBtn);
}
