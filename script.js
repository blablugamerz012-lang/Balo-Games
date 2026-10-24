/* Balo Games — library, filters, and Poki-style game player */
const games = [
  { id:"snake-king", title:"Snake King", icon:"🐍", desc:"Classic snake action with mobile and keyboard controls.", category:"arcade", path:"games/snake-king/index.html" },
  { id:"memory-match", title:"Memory Match", icon:"🧠", desc:"Find matching cards and test your memory.", category:"arcade", path:"games/MATCH%20GAME/memory-match.html" },
  { id:"my-gun-life", title:"My Gun Life", icon:"⚡", desc:"Jump into a fast-paced action game.", category:"action", path:"games/my-gun-life/index.html" },
  { id:"tik-tak-toe", title:"Tic Tac Toe", icon:"❌⭕", desc:"A classic strategy game for a quick match.", category:"arcade", path:"games/tik-tak-toe/index.html" },
  { id:"evo-eater", title:"Evo-Eater", icon:"🦅", desc:"Grow, evolve, and explore the arena.", category:"action", path:"games/evoeater/index.html" },
  { id:"coming-soon-adventure", title:"Adventure Games", icon:"🗺️", desc:"A new adventure is being prepared.", category:"adventure", path:"", comingSoon:true },
  { id:"coming-soon-arcade", title:"More Arcade Games", icon:"🕹️", desc:"More quick-play challenges are on the way.", category:"arcade", path:"", comingSoon:true }
];

const grid=document.getElementById("gameGrid");
const gameOverlay=document.getElementById("gameOverlay");
const logoBtn=document.getElementById("logoBtn");
const gameSearch=document.getElementById("gameSearch");
const clearSearch=document.getElementById("clearSearch");
const gameCount=document.getElementById("gameCount");
const emptyGames=document.getElementById("emptyGames");
const categoryButtons=document.querySelectorAll(".category[data-category]");
let selectedCategory="all";
let searchTerm="";
let currentGame=null;

function showGames(list){
  if(!grid)return;
  grid.innerHTML="";
  list.forEach(game=>{
    const card=document.createElement(game.comingSoon?"article":"a");
    card.className="game-card"+(game.comingSoon?" coming-soon-card":"");
    if(!game.comingSoon)card.href=game.path;
    const art=document.createElement("div");art.className="game-image game-image-"+game.id;art.setAttribute("aria-hidden","true");
    const icon=document.createElement("span");icon.className="game-icon";icon.textContent=game.icon;
    const tag=document.createElement("span");tag.className="game-category-tag";tag.textContent=game.category;art.append(icon,tag);
    const info=document.createElement("div");info.className="game-info";
    const title=document.createElement("h3");title.textContent=game.title;
    const desc=document.createElement("p");desc.textContent=game.desc;
    const action=document.createElement("span");action.className="game-action"+(game.comingSoon?" coming-soon-label":"");action.textContent=game.comingSoon?"Coming soon ✦":"Play game →";
    info.append(title,desc,action);card.append(art,info);
    if(!game.comingSoon){
      card.setAttribute("aria-label","Play "+game.title);
      card.addEventListener("click",event=>{event.preventDefault();openGame(game);});
    }else card.setAttribute("aria-label",game.title+", coming soon");
    grid.appendChild(card);
  });
  if(gameCount)gameCount.textContent=list.length+(list.length===1?" game":" games")+" shown";
  if(emptyGames)emptyGames.hidden=list.length!==0;
  grid.hidden=list.length===0;
}

function applyFilters(){
  const filtered=games.filter(game=>{
    const categoryMatches=selectedCategory==="all"||game.category===selectedCategory;
    const haystack=(game.title+" "+game.desc+" "+game.category).toLowerCase();
    return categoryMatches&&haystack.includes(searchTerm);
  });
  showGames(filtered);
}

function filterGames(category){
  selectedCategory=category;
  categoryButtons.forEach(button=>{
    const active=button.dataset.category===category;
    button.classList.toggle("active",active);
    button.setAttribute("aria-pressed",String(active));
  });
  applyFilters();
}

categoryButtons.forEach(button=>button.addEventListener("click",()=>filterGames(button.dataset.category||"all")));

if(gameSearch)gameSearch.addEventListener("input",()=>{
  searchTerm=gameSearch.value.trim().toLowerCase();
  if(clearSearch)clearSearch.hidden=!gameSearch.value;
  applyFilters();
});
if(clearSearch)clearSearch.addEventListener("click",()=>{
  gameSearch.value="";searchTerm="";clearSearch.hidden=true;applyFilters();gameSearch.focus();
});
const resetFilters=document.getElementById("resetFilters");
if(resetFilters)resetFilters.addEventListener("click",()=>{
  gameSearch.value="";searchTerm="";if(clearSearch)clearSearch.hidden=true;filterGames("all");gameSearch.focus();
});

/* Saved player data. This persists on the visitor's browser/device. */
const STORAGE_KEY="baloGamesPlayerData_v1";
function readData(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}");}catch(e){return {};}}
function writeData(data){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(data));}catch(e){}}
function getGameData(id){
  const data=readData();
  if(!data[id])data[id]={like:false,unlike:false,favorite:false,comments:[]};
  return data[id];
}
function saveGameData(id,patch){
  const data=readData();
  data[id]=Object.assign({like:false,unlike:false,favorite:false,comments:[]},data[id]||{},patch);
  writeData(data);return data[id];
}

function injectPlayerStyles(){
  if(document.getElementById("balo-player-styles"))return;
  const style=document.createElement("style");style.id="balo-player-styles";
  style.textContent=`
#gameOverlay{padding:0!important;background:#101114!important;align-items:stretch!important;justify-content:center!important}
#gameOverlay.open{display:flex!important}
.balo-player{width:100%;height:100%;display:grid;grid-template-columns:190px minmax(0,900px) minmax(80px,1fr);gap:18px;align-items:center;padding:26px 22px}
.balo-side{background:#191b21;border:1px solid #2c2f38;border-radius:16px;padding:14px;color:#fff;display:flex;flex-direction:column;gap:10px;box-shadow:0 8px 30px rgba(0,0,0,.22)}
.balo-title{font-weight:800;font-size:15px;margin:3px 5px 8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.balo-btn{width:100%;border:0;border-radius:11px;padding:11px 9px;background:#272a32;color:#fff;font-weight:700;cursor:pointer;font-size:13px;transition:.15s}
.balo-btn:hover{background:#343844}.balo-btn.active{background:linear-gradient(135deg,#ff69b4,#ff1493)}
.balo-btn .count{opacity:.8;margin-left:4px}
.balo-game-wrap{min-width:0;display:flex;flex-direction:column;gap:9px;align-items:center}
.balo-game-head{width:100%;display:flex;align-items:center;justify-content:space-between;gap:10px;color:#fff;padding:0 3px}
.balo-game-name{font-size:18px;font-weight:800}.balo-close{border:0;border-radius:10px;padding:9px 13px;background:#fff;color:#222;font-weight:800;cursor:pointer}
.balo-frame-shell{width:100%;background:#000;border-radius:14px;overflow:hidden;box-shadow:0 12px 45px rgba(0,0,0,.42)}
#gameOverlay #gameFrame{display:block;width:100%;height:min(78vh,720px);border:0;border-radius:0;background:#fff}
.balo-empty-right{min-width:0}
#baloToast{position:fixed;left:50%;bottom:25px;transform:translateX(-50%);z-index:2000;background:#191b21;color:#fff;padding:12px 18px;border-radius:12px;box-shadow:0 8px 25px rgba(0,0,0,.35);font-weight:700;font-size:14px;opacity:0;pointer-events:none;transition:.2s}
#baloToast.show{opacity:1}
#baloCommentModal{position:fixed;inset:0;z-index:1800;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(0,0,0,.65)}
#baloCommentModal.open{display:flex}
#baloCommentBox{width:min(430px,100%);background:#fff;color:#222;border-radius:18px;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.4)}
#baloCommentBox h3{margin-bottom:8px}#baloCommentBox p{color:#666;font-size:13px;margin-bottom:12px}
#baloCommentInput{width:100%;min-height:90px;resize:vertical;border:1px solid #ddd;border-radius:12px;padding:11px;font:inherit;outline:none}
#baloCommentInput:focus{border-color:#ff1493}.balo-comment-actions{display:flex;justify-content:flex-end;gap:9px;margin-top:12px}
.balo-comment-actions button{border:0;border-radius:10px;padding:10px 15px;font-weight:800;cursor:pointer}#baloCommentCancel{background:#eee}#baloCommentSend{background:#ff1493;color:#fff}
@media(max-width:850px){.balo-player{grid-template-columns:72px minmax(0,1fr);gap:8px;padding:10px}.balo-side{padding:7px;gap:6px}.balo-title{display:none}.balo-btn{padding:10px 5px;font-size:11px}.balo-empty-right{display:none}#gameOverlay #gameFrame{height:78vh}}
@media(max-width:560px){.balo-player{grid-template-columns:1fr;grid-template-rows:auto 1fr}.balo-side{flex-direction:row;overflow-x:auto;align-items:center}.balo-title{display:block;margin:0;min-width:max-content}.balo-btn{width:auto;min-width:74px}#gameOverlay #gameFrame{height:70vh}}
`;
  document.head.appendChild(style);
}

function buildPlayer(){
  injectPlayerStyles();
  gameOverlay.innerHTML=`
    <div class="balo-player">
      <aside class="balo-side" aria-label="Game options">
        <div class="balo-title" id="baloPlayerTitle">Game</div>
        <button class="balo-btn" id="baloLikeBtn" type="button">👍 Like <span class="count" id="baloLikeCount"></span></button>
        <button class="balo-btn" id="baloUnlikeBtn" type="button">👎 Unlike <span class="count" id="baloUnlikeCount"></span></button>
        <button class="balo-btn" id="baloFavoriteBtn" type="button">⭐ Favorite</button>
        <button class="balo-btn" id="baloShareBtn" type="button">↗ Share</button>
        <button class="balo-btn" id="baloFullscreenBtn" type="button">⛶ Full Screen</button>
        <button class="balo-btn" id="baloExitBtn" type="button">✕ Close Game</button>
      </aside>
      <section class="balo-game-wrap">
        <div class="balo-game-head"><div class="balo-game-name" id="baloGameName">Balo Games</div><button class="balo-close" id="baloTopClose" type="button">✕</button></div>
        <div class="balo-frame-shell"><iframe id="gameFrame" src="" title="Game" allowfullscreen></iframe></div>
      </section>
      <div class="balo-empty-right" aria-hidden="true"></div>
    </div>
    <div id="baloCommentModal" role="dialog" aria-modal="true" aria-label="Write a comment">
      <div id="baloCommentBox"><h3 id="baloCommentTitle">Tell us what you think</h3><p>Your comment is saved on this device for this game.</p><textarea id="baloCommentInput" maxlength="500" placeholder="Write your comment..."></textarea><div class="balo-comment-actions"><button id="baloCommentCancel" type="button">Cancel</button><button id="baloCommentSend" type="button">Send Comment</button></div></div>
    </div>
    <div id="baloToast" role="status" aria-live="polite"></div>`;

  document.getElementById("baloLikeBtn").addEventListener("click",toggleLike);
  document.getElementById("baloUnlikeBtn").addEventListener("click",toggleUnlike);
  document.getElementById("baloFavoriteBtn").addEventListener("click",toggleFavorite);
  document.getElementById("baloShareBtn").addEventListener("click",shareGame);
  document.getElementById("baloFullscreenBtn").addEventListener("click",fullscreenGame);
  document.getElementById("baloExitBtn").addEventListener("click",closeGame);
  document.getElementById("baloTopClose").addEventListener("click",closeGame);
  document.getElementById("baloCommentCancel").addEventListener("click",closeComment);
  document.getElementById("baloCommentSend").addEventListener("click",submitComment);
}

function updatePlayerState(){
  if(!currentGame)return;
  const d=getGameData(currentGame.id);
  const like=document.getElementById("baloLikeBtn"),unlike=document.getElementById("baloUnlikeBtn"),fav=document.getElementById("baloFavoriteBtn");
  if(!like)return;
  like.classList.toggle("active",d.like);unlike.classList.toggle("active",d.unlike);fav.classList.toggle("active",d.favorite);
  document.getElementById("baloLikeCount").textContent=d.like?"✓":"";
  document.getElementById("baloUnlikeCount").textContent=d.unlike?"✓":"";
  fav.innerHTML=d.favorite?"⭐ Favorited":"⭐ Favorite";
}

function openGame(game){
  if(!game||!game.path)return;
  currentGame=game;buildPlayer();
  document.getElementById("baloPlayerTitle").textContent=game.title;
  document.getElementById("baloGameName").textContent=game.title;
  document.getElementById("gameFrame").src=game.path;
  gameOverlay.classList.add("open");document.body.style.overflow="hidden";updatePlayerState();
}
function closeGame(){
  gameOverlay.classList.remove("open");const frame=document.getElementById("gameFrame");if(frame)frame.src="";document.body.style.overflow="";currentGame=null;
}
function toast(message){const el=document.getElementById("baloToast");if(!el)return;el.textContent=message;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2200);}
function toggleLike(){
  if(!currentGame)return;const d=getGameData(currentGame.id);if(d.like){saveGameData(currentGame.id,{like:false});updatePlayerState();return;}
  saveGameData(currentGame.id,{like:true,unlike:false});updatePlayerState();openComment("Thanks for the Like! 😊","Tell us what you liked about this game.");
}
function toggleUnlike(){
  if(!currentGame)return;const d=getGameData(currentGame.id);if(d.unlike){saveGameData(currentGame.id,{unlike:false});updatePlayerState();return;}
  saveGameData(currentGame.id,{unlike:true,like:false});updatePlayerState();toast("Thanks for your feedback 😔");
}
function toggleFavorite(){
  if(!currentGame)return;const d=getGameData(currentGame.id);saveGameData(currentGame.id,{favorite:!d.favorite});updatePlayerState();toast(d.favorite?"Removed from Favorites":"Added to Favorites ⭐");
}
function openComment(title,placeholder){
  const modal=document.getElementById("baloCommentModal"),input=document.getElementById("baloCommentInput");
  document.getElementById("baloCommentTitle").textContent=title;input.placeholder=placeholder||"Write your comment...";input.value="";modal.classList.add("open");setTimeout(()=>input.focus(),50);
}
function closeComment(){const modal=document.getElementById("baloCommentModal");if(modal)modal.classList.remove("open");}
function submitComment(){
  if(!currentGame)return;const input=document.getElementById("baloCommentInput"),text=input.value.trim();if(!text){input.focus();return;}
  const d=getGameData(currentGame.id);d.comments=Array.isArray(d.comments)?d.comments:[];d.comments.push({text,time:new Date().toISOString()});saveGameData(currentGame.id,{comments:d.comments});closeComment();toast("Thanks for your comment! 😊");
}
async function shareGame(){
  if(!currentGame)return;const url=new URL(currentGame.path,window.location.href).href;
  try{
    if(navigator.share){await navigator.share({title:currentGame.title+" - Balo Games",text:"Play "+currentGame.title+" on Balo Games",url});toast("Shared successfully! ❤️");}
    else if(navigator.clipboard){await navigator.clipboard.writeText(url);toast("Game link copied! 🔗");}
    else window.prompt("Copy this game link:",url);
  }catch(e){if(e&&e.name!=="AbortError")toast("Share cancelled");}
}
async function fullscreenGame(){
  try{
    if(document.fullscreenElement){await document.exitFullscreen();return;}
    const shell=document.querySelector(".balo-frame-shell"),frame=document.getElementById("gameFrame");
    if(shell&&shell.requestFullscreen)await shell.requestFullscreen();else if(frame&&frame.requestFullscreen)await frame.requestFullscreen();
  }catch(e){toast("Full screen is not available here");}
}

if(logoBtn)logoBtn.addEventListener("click",event=>{
  if(gameOverlay.classList.contains("open")){event.preventDefault();closeGame();}
});

document.addEventListener("keydown",event=>{
  if(event.key==="Escape"){
    const modal=document.getElementById("baloCommentModal");
    if(modal&&modal.classList.contains("open"))closeComment();
  }
});

filterGames("all");
