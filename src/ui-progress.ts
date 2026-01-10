import { state } from './state';

let progressBar: HTMLDivElement | null = null;

export function showProgress() {
  if (!progressBar) createProgressBar();
  progressBar!.style.display = 'block';
  updateProgress();
}

export function hideProgress() {
  if (progressBar) progressBar.style.display = 'none';
}

export function updateProgress() {
  if (!progressBar) return;

  const percent = Math.min((state.currentCount / state.maxCount) * 100, 100);
  const progressFill = progressBar.querySelector('.progress-fill') as HTMLDivElement;
  const progressText = progressBar.querySelector('.progress-text') as HTMLDivElement;
  const progressCount = progressBar.querySelector('.progress-count') as HTMLDivElement;

  if (progressFill) {
    progressFill.style.width = `${percent}%`;
  }

  if (progressText) {
    progressText.textContent = `${percent.toFixed(0)}%`;
  }

  if (progressCount) {
    progressCount.textContent = `${state.currentCount} / ${state.maxCount}`;
  }

  // 完成时自动隐藏
  if (state.currentCount >= state.maxCount) {
    setTimeout(() => {
      hideProgress();
    }, 2000);
  }
}

function createProgressBar() {
  progressBar = document.createElement('div');
  progressBar.className = 'xhs-progress-container';
  progressBar.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    width: 320px;
    background: #fff;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    z-index: 9998;
    display: none;
    animation: slideInRight 0.3s ease-out;
  `;

  progressBar.innerHTML = `
    <style>
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      .xhs-progress-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }
      .xhs-progress-title {
        font-size: 15px;
        font-weight: 600;
        color: #333;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .xhs-progress-status {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #52c41a;
        animation: pulse 1.5s ease-in-out infinite;
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      .xhs-progress-close {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #f5f5f5;
        border: none;
        cursor: pointer;
        font-size: 16px;
        color: #999;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }
      .xhs-progress-close:hover {
        background: #e8e8e8;
        color: #666;
      }
      .xhs-progress-bar {
        width: 100%;
        height: 8px;
        background: #f0f0f0;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 12px;
      }
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #ff2442 0%, #ff6b6b 100%);
        border-radius: 4px;
        transition: width 0.3s ease;
      }
      .xhs-progress-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .progress-text {
        font-size: 18px;
        font-weight: 600;
        color: #ff2442;
      }
      .progress-count {
        font-size: 13px;
        color: #999;
      }
    </style>
    <div class="xhs-progress-header">
      <div class="xhs-progress-title">
        <span class="xhs-progress-status"></span>
        清理进行中
      </div>
      <button class="xhs-progress-close">×</button>
    </div>
    <div class="xhs-progress-bar">
      <div class="progress-fill" style="width: 0%"></div>
    </div>
    <div class="xhs-progress-info">
      <span class="progress-text">0%</span>
      <span class="progress-count">0 / 50</span>
    </div>
  `;

  document.body.appendChild(progressBar);

  // 关闭按钮
  progressBar.querySelector('.xhs-progress-close')!.addEventListener('click', () => {
    hideProgress();
  });
}
