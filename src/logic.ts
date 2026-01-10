import { state } from './state';
import { updateProgress } from './ui-progress';

export function cleanLikes() {
  if (state.currentCount >= state.maxCount) return;

  const items = document.querySelectorAll<HTMLElement>('.note-item');
  let hasLikedItems = false;

  for (const el of items) {
    if (state.currentCount >= state.maxCount) break;

    const uses = el.getElementsByTagName('use');
    if (!uses.length) continue;

    const last = uses[uses.length - 1];
    if (last && last.getAttribute('xlink:href') === '#liked') {
      hasLikedItems = true;
      const btn = el.querySelector<HTMLElement>('.like-lottie');
      if (btn) {
        btn.click();
        state.currentCount++;
        updateProgress();
      }
    }
  }

  // 如果当前可见区域没有已点赞的项目，自动向下滚动加载更多
  if (!hasLikedItems && state.currentCount < state.maxCount) {
    scrollToLoadMore();
  }
}

function scrollToLoadMore() {
  // 滚动到页面底部以触发加载更多
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: 'smooth',
  });
}
