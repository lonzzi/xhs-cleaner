import { state } from './state';
import { start, stop } from './ui-tab';

let modal: HTMLDivElement | null = null;

export function openModal() {
  if (!modal) createModal();
  modal!.style.display = 'flex';
}

function createModal() {
  modal = document.createElement('div');
  modal.style.cssText = `
    position:fixed;
    inset:0;
    background:rgba(0,0,0,.45);
    z-index:9999;
    display:flex;
    align-items:center;
    justify-content:center;
  `;

  modal.innerHTML = `
    <div style="width:320px;background:#fff;border-radius:16px;padding:16px">
      <div style="display:flex;justify-content:space-between">
        <strong>自动取消点赞</strong>
        <span class="close" style="cursor:pointer">×</span>
      </div>

      <label>最大数量
        <input class="max" type="number" value="50">
      </label>

      <button class="toggle"
        style="margin-top:12px;width:100%;background:#ff2442;color:#fff;border:none;border-radius:20px">
        开启
      </button>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('.close')!.addEventListener('click', () => {
    modal!.style.display = 'none';
  });

  modal.querySelector('.toggle')!.addEventListener('click', () => {
    if (state.enabled) {
      stop();
    } else {
      start();
    }
  });

  modal.querySelector('.max')!.addEventListener('change', (e) => {
    state.maxCount = Number((e.target as HTMLInputElement).value);
  });
}
