// ==UserScript==
// @name         小红书 自动取消点赞
// @namespace    https://greasyfork.org
// @version      0.3.0
// @description  自动取消小红书点赞
// @match        https://www.xiaohongshu.com/*
// @grant        none
// ==/UserScript==


var e={enabled:!1,maxCount:50,interval:1000,scrollInterval:1000,autoScroll:!0,currentCount:0,cleanTimer:null,scrollTimer:null};var n=null;function d(){if(!n)w();n.style.display="block",l()}function i(){if(n)n.style.display="none"}function l(){if(!n)return;let r=Math.min(e.currentCount/e.maxCount*100,100),s=n.querySelector(".progress-fill"),p=n.querySelector(".progress-text"),o=n.querySelector(".progress-count");if(s)s.style.width=`${r}%`;if(p)p.textContent=`${r.toFixed(0)}%`;if(o)o.textContent=`${e.currentCount} / ${e.maxCount}`;if(e.currentCount>=e.maxCount)setTimeout(()=>{i()},2000)}function w(){n=document.createElement("div"),n.className="xhs-progress-container",n.style.cssText=`
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
  `,n.innerHTML=`
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
  `,document.body.appendChild(n),n.querySelector(".xhs-progress-close").addEventListener("click",()=>{i()})}function h(){if(e.currentCount>=e.maxCount)return;let r=document.querySelectorAll(".note-item"),s=!1;for(let p of r){if(e.currentCount>=e.maxCount)break;let o=p.getElementsByTagName("use");if(!o.length)continue;let f=o[o.length-1];if(f&&f.getAttribute("xlink:href")==="#liked"){s=!0;let x=p.querySelector(".like-lottie");if(x)x.click(),e.currentCount++,l()}}if(!s&&e.currentCount<e.maxCount)k()}function k(){window.scrollTo({top:document.documentElement.scrollHeight,behavior:"smooth"})}var t=null;function g(){if(!t)T();t.style.display="flex"}function c(){if(t)t.style.display="none"}function T(){t=document.createElement("div"),t.className="xhs-auto-unlike-modal",t.style.cssText=`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px);
    animation: fadeIn 0.2s ease-out;
  `,t.innerHTML=`
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
        <div class="xhs-modal-title">\uD83E\uDDF9 内容清理工具</div>
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
  `,document.body.appendChild(t),t.addEventListener("click",(s)=>{if(s.target===t)c()}),t.querySelector(".close").addEventListener("click",c),t.querySelector(".cancel").addEventListener("click",()=>{if(e.enabled){if(confirm("清理任务正在运行中，确定要关闭吗？"))c()}else c()});let r=t.querySelector(".toggle");r.addEventListener("click",()=>{if(e.enabled)m(),i(),r.textContent="开始清理",r.className="xhs-btn xhs-btn-primary toggle";else b(),c(),d(),r.textContent="停止清理",r.className="xhs-btn xhs-btn-stop toggle"}),t.querySelector(".max").addEventListener("change",(s)=>{e.maxCount=Number(s.target.value)})}function u(){if(!t)return;let r=t.querySelector(".toggle");if(e.enabled)r.textContent="停止清理",r.className="xhs-btn xhs-btn-stop toggle";else r.textContent="开始清理",r.className="xhs-btn xhs-btn-primary toggle",i()}var a=null;function b(){if(e.enabled)return;e.enabled=!0,e.currentCount=0,e.cleanTimer=window.setInterval(h,e.interval),u()}function m(){if(e.enabled=!1,e.cleanTimer)clearInterval(e.cleanTimer);i(),u()}function y(){if(a)return;let r=document.querySelector(".reds-tabs-list");if(!r)return;let s=document.createElement("style");s.textContent=`
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
  `,document.head.appendChild(s),a=document.createElement("div"),a.className="xhs-auto-unlike-btn",a.innerHTML="\uD83E\uDDF9 内容清理",a.onclick=g,r.appendChild(a)}function v(){return location.pathname.startsWith("/user/profile/")&&new URLSearchParams(location.search).get("tab")==="liked"}var C=new MutationObserver(()=>{if(v())y()});C.observe(document.body,{childList:!0,subtree:!0});
