import { state } from './state';
import { start, stop } from './ui-tab';

let modal: HTMLDivElement | null = null;

export function openModal() {
  if (!modal) createModal();
  modal!.style.display = 'flex';
}

export function closeModal() {
  if (modal) modal.style.display = 'none';
}

function createModal() {
  modal = document.createElement('div');
  modal.className = 'xhs-auto-unlike-modal';
  modal.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px);
    animation: fadeIn 0.2s ease-out;
  `;

  modal.innerHTML = `
    <style>
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      .xhs-modal-content {
        width: 400px;
        background: #fff;
        border-radius: 20px;
        padding: 28px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.3s ease-out;
      }
      .xhs-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }
      .xhs-modal-title {
        font-size: 20px;
        font-weight: 600;
        color: #333;
      }
      .xhs-modal-close {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #f5f5f5;
        border: none;
        cursor: pointer;
        font-size: 20px;
        color: #666;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }
      .xhs-modal-close:hover {
        background: #e8e8e8;
        color: #333;
      }
      .xhs-modal-body {
        margin-bottom: 24px;
      }
      .xhs-form-group {
        margin-bottom: 16px;
      }
      .xhs-form-label {
        display: block;
        font-size: 14px;
        font-weight: 500;
        color: #666;
        margin-bottom: 8px;
      }
      .xhs-form-input {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid #e8e8e8;
        border-radius: 12px;
        font-size: 15px;
        transition: all 0.2s;
        box-sizing: border-box;
      }
      .xhs-form-input:focus {
        outline: none;
        border-color: #ff2442;
      }
      .xhs-modal-footer {
        display: flex;
        gap: 12px;
      }
      .xhs-btn {
        flex: 1;
        padding: 14px 24px;
        border: none;
        border-radius: 12px;
        font-size: 15px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }
      .xhs-btn-primary {
        background: linear-gradient(135deg, #ff2442 0%, #ff6b6b 100%);
        color: #fff;
        box-shadow: 0 4px 12px rgba(255, 36, 66, 0.3);
      }
      .xhs-btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(255, 36, 66, 0.4);
      }
      .xhs-btn-primary:active {
        transform: translateY(0);
      }
      .xhs-btn-secondary {
        background: #f5f5f5;
        color: #666;
      }
      .xhs-btn-secondary:hover {
        background: #e8e8e8;
        color: #333;
      }
      .xhs-btn-stop {
        background: linear-gradient(135deg, #666 0%, #888 100%);
        color: #fff;
      }
      .xhs-btn-stop:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      }
    </style>
    <div class="xhs-modal-content" onclick="event.stopPropagation()">
      <div class="xhs-modal-header">
        <div class="xhs-modal-title">🧹 内容清理工具</div>
        <button class="xhs-modal-close close">×</button>
      </div>
      <div class="xhs-modal-body">
        <div class="xhs-form-group">
          <label class="xhs-form-label">最大处理数量</label>
          <input class="xhs-form-input max" type="number" value="50" min="1" placeholder="请输入最大数量">
        </div>
      </div>
      <div class="xhs-modal-footer">
        <button class="xhs-btn xhs-btn-secondary cancel">关闭</button>
        <button class="xhs-btn xhs-btn-primary toggle">开始清理</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // 点击遮罩关闭
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // 关闭按钮
  modal.querySelector('.close')!.addEventListener('click', closeModal);

  // 关闭按钮 - 添加确认提醒
  modal.querySelector('.cancel')!.addEventListener('click', () => {
    if (state.enabled) {
      if (confirm('清理任务正在运行中，确定要关闭吗？')) {
        closeModal();
      }
    } else {
      closeModal();
    }
  });

  // 开启/停止按钮
  const toggleBtn = modal.querySelector('.toggle') as HTMLButtonElement;
  toggleBtn.addEventListener('click', () => {
    if (state.enabled) {
      stop();
      toggleBtn.textContent = '开始清理';
      toggleBtn.className = 'xhs-btn xhs-btn-primary toggle';
    } else {
      start();
      toggleBtn.textContent = '停止清理';
      toggleBtn.className = 'xhs-btn xhs-btn-stop toggle';
    }
  });

  // 输入框变化
  modal.querySelector('.max')!.addEventListener('change', (e) => {
    state.maxCount = Number((e.target as HTMLInputElement).value);
  });
}

// 更新按钮状态
export function updateToggleButton() {
  if (!modal) return;
  const toggleBtn = modal.querySelector('.toggle') as HTMLButtonElement;
  if (state.enabled) {
    toggleBtn.textContent = '停止清理';
    toggleBtn.className = 'xhs-btn xhs-btn-stop toggle';
  } else {
    toggleBtn.textContent = '开始清理';
    toggleBtn.className = 'xhs-btn xhs-btn-primary toggle';
  }
}
