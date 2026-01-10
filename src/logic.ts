import { state } from './state';
import { updateProgress } from './ui-progress';

export function cleanLikes() {
  if (state.currentCount >= state.maxCount) return;

  const items = document.querySelectorAll<HTMLElement>('.note-item');

  for (const el of items) {
    if (state.currentCount >= state.maxCount) break;

    const uses = el.getElementsByTagName('use');
    if (!uses.length) continue;

    const last = uses[uses.length - 1];
    if (last && last.getAttribute('xlink:href') === '#liked') {
      const btn = el.querySelector<HTMLElement>('.like-lottie');
      if (btn) {
        btn.click();
        state.currentCount++;
        updateProgress();
      }
    }
  }
}
