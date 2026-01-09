import { state } from './state';
import { cleanLikes } from './logic';
import { openModal } from './ui-modal';

let tabBtn: HTMLDivElement | null = null;

export function start() {
  if (state.enabled) return;
  state.enabled = true;
  state.currentCount = 0;

  state.cleanTimer = window.setInterval(cleanLikes, state.interval);
}

export function stop() {
  state.enabled = false;
  if (state.cleanTimer) clearInterval(state.cleanTimer);
}

export function createTabButton() {
  if (tabBtn) return;

  const tabs = document.querySelector('.reds-tabs-list');
  if (!tabs) return;

  tabBtn = document.createElement('div');
  tabBtn.textContent = '自动取消';
  tabBtn.style.cursor = 'pointer';
  tabBtn.style.color = '#ff2442';

  tabBtn.onclick = openModal;
  tabs.appendChild(tabBtn);
}
