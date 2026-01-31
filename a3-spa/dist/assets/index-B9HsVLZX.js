(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function s(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(n){if(n.ep)return;n.ep=!0;const o=s(n);fetch(n.href,o)}})();let l=1e3,a="4x4";function d(e){let t=!1,s,r;const n=e.querySelector(".window-header");n.style.cursor="move",n.addEventListener("mousedown",o=>{t=!0,s=o.clientX-e.offsetLeft,r=o.clientY-e.offsetTop}),document.addEventListener("mousemove",o=>{t&&(e.style.left=`${o.clientX-s}px`,e.style.top=`${o.clientY-r}px`)}),document.addEventListener("mouseup",()=>{t=!1})}function m(e){l++,e.style.zIndex=l}document.addEventListener("click",e=>{const t=e.target.closest(".window");t&&m(t)});function f(e){const t=document.createElement("div");t.classList.add("window");const[s,r]=e.split("x").map(Number),n=Math.min(400/Math.max(s,r),120),o=r*(n+10)+40,i=s*(n+10)+110;return t.style.width=`${o}px`,t.style.height=`${i}px`,t.style.position="absolute",t.style.top="10px",t.style.left="50%",t.style.transform="translateX(-50%)",t.innerHTML=`
    <div class="window-header">
      <span>Memory Game</span>
      <button class="close-btn">X</button>
    </div>
    <iframe src="./exercise-memory-game-master/src/index.html" class="window-content" ></iframe>
  `,t.querySelector(".close-btn").addEventListener("click",()=>{t.remove()}),document.body.appendChild(t),t}function p(){const e=document.createElement("div");return e.classList.add("window"),e.style.position="absolute",e.style.top="10px",e.style.left="50%",e.style.transform="translateX(-50%)",e.innerHTML=`
    <div class="window-header">
      <span>Chat</span>
      <button class="close-btn">X</button>
    </div>
    <iframe src="./chat-app/src/index.html" class="window-content"></iframe>
  `,e.querySelector(".close-btn").addEventListener("click",()=>{e.remove()}),document.body.appendChild(e),e}function y(){const e=document.createElement("div");return e.classList.add("window"),e.style.width="600px",e.style.height="600px",e.style.position="absolute",e.style.top="10px",e.style.left="50%",e.style.transform="translateX(-50%)",e.innerHTML=`
    <div class="window-header">
      <span>Chat</span>
      <button class="close-btn">X</button>
    </div>
    <iframe src="./a2-quiz/src/index.html" class="window-content"></iframe>
  `,e.querySelector(".close-btn").addEventListener("click",()=>{e.remove()}),document.body.appendChild(e),e}const h=document.querySelectorAll(".app-icon");let c=null;function w(e){c&&c.classList.remove("selected"),c=e,c.classList.add("selected");const t=e.querySelector("p").textContent;console.log(`Selected: ${t}`)}h.forEach(e=>{e.addEventListener("click",()=>{w(e)}),e.addEventListener("dblclick",()=>{const t=e.id;if(t==="memory-game-icon"){const s=f(a);d(s),s.querySelector("iframe").focus()}else if(t==="chat-icon"){const s=p();d(s)}else if(t==="quiz-icon"){const s=y();d(s)}})});const u=document.createElement("style");u.innerHTML=`
  .app-icon.selected {
    border: 2px solid blue;
    background-color: lightblue;
    border-radius: 5px;
    width: 100px;
  }
`;document.getElementById("board-size-select").addEventListener("change",e=>{a=e.target.value});document.head.appendChild(u);
