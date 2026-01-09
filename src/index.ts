// ==UserScript==
// @name         小红书 自动取消点赞
// @namespace    https://greasyfork.org
// @version      0.3.0
// @description  自动取消小红书点赞
// @match        https://www.xiaohongshu.com/*
// @grant        none
// ==/UserScript==

import { createTabButton } from './ui-tab';
import { isLikedPage } from './utils';

const observer = new MutationObserver(() => {
  if (isLikedPage()) {
    createTabButton();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
