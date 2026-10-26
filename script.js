/* Balo Games — library, filters, player, search, favorites and profile */
const games = [
  { id:"my-gun-life", title:"My Gun Life", icon:"⚡", desc:"Jump into a fast-paced action game.", category:"action", path:"games/my-gun-life/index.html", order:1 },
  { id:"evo-eater", title:"Evo Eater", icon:"🦅", desc:"Grow, evolve, and explore the arena.", category:"action", path:"games/evoeater/index.html", order:2 },
  { id:"tik-tak-toe", title:"Tik Tak Toe", icon:"❌⭕", desc:"A classic strategy game for a quick match.", category:"arcade", path:"games/tik-tak-toe/index.html", order:3 },
  { id:"memory-match", title:"Memory Match", icon:"🧠", desc:"Find matching cards and test your memory.", category:"arcade", path:"games/MATCH%20GAME/memory-match.html", order:4 },
  { id:"snake-king", title:"Snake King", icon:"🐍", desc:"Classic snake action with mobile and keyboard controls.", category:"arcade", path:"games/snake-king/index.html", order:5 },
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
const sectionTitle=document.getElementById("sectionTitle");
const categoryLabels={all:"All Games",action:"Action",adventure:"Adventure",arcade:"Arcade",latest:"Latest Games"};
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
  let filtered=games.filter(game=>{
    const categoryMatches=selectedCategory==="all"||selectedCategory==="latest"||game.category===selectedCategory;
    const haystack=(game.title+" "+game.desc+" "+game.category).toLowerCase();
    return categoryMatches&&haystack.includes(searchTerm);
  });
  if(selectedCategory==="latest"){
    filtered.sort((a,b)=>(b.order||0)-(a.order||0));
  }
  if(sectionTitle) sectionTitle.textContent=categoryLabels[selectedCategory]||"All Games";
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
const PROFILE_KEY="baloGamesProfile_v1";
function readData(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}");}catch(e){return {};}}
function writeData(data){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(data));}catch(e){}}
function getGameData(id){const data=readData();if(!data[id])data[id]={like:false,unlike:false,favorite:false,comments:[]};return data[id];}
function saveGameData(id,patch){const data=readData();data[id]=Object.assign({like:false,unlike:false,favorite:false,comments:[]},data[id]||{},patch);writeData(data);return data[id];}
function getProfile(){try{return JSON.parse(localStorage.getItem(PROFILE_KEY)||"null");}catch(e){return null;}}
function saveProfile(profile){try{localStorage.setItem(PROFILE_KEY,JSON.stringify(profile));}catch(e){}}

function injectHomeTools(){
  if(document.getElementById("balo-home-tools"))return;
  const style=document.createElement("style");style.id="balo-home-tools";style.textContent=`
  #balo-home-tools{position:absolute;right:clamp(12px,4vw,44px);top:12px;z-index:5}
  #baloFavoritesBtn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:54px;padding:14px 25px;border:2px solid rgba(255,255,255,.95);border-radius:16px;background:linear-gradient(135deg,#fff,#eaf3ff);color:#0754c9;font-size:16px;font-weight:900;letter-spacing:.2px;box-shadow:0 7px 0 rgba(0,35,110,.22),0 12px 28px rgba(0,0,0,.2);cursor:pointer;transition:transform .18s,box-shadow .18s}
  #baloFavoritesBtn:hover{transform:translateY(-3px);box-shadow:0 10px 0 rgba(0,35,110,.18),0 16px 30px rgba(0,0,0,.24)}
  #baloFavoritesBtn:active{transform:translateY(2px);box-shadow:0 3px 0 rgba(0,35,110,.2)}
  .top-area{position:relative;padding-top:76px!important}
  @media(max-width:600px){#balo-home-tools{top:9px;right:9px}#baloFavoritesBtn{min-height:42px;padding:10px 13px;border-radius:12px;font-size:12px}.top-area{padding-top:62px!important}}
  `;
  document.head.appendChild(style);
  const area=document.querySelector(".top-area");
  if(area){const tools=document.createElement("div");tools.id="balo-home-tools";tools.innerHTML=`<button id="baloFavoritesBtn" type="button">⭐ Favourite Games</button>`;area.appendChild(tools);}
  document.getElementById("baloFavoritesBtn")?.addEventListener("click",showFavorites);
}
function showFavorites(){
  let panel=document.getElementById("baloFavoritesPage");
  if(!panel){
    panel=document.createElement("section");panel.id="baloFavoritesPage";panel.setAttribute("role","dialog");panel.setAttribute("aria-modal","true");panel.setAttribute("aria-label","My Favourite Games");
    panel.innerHTML='<style>#baloFavoritesPage{position:fixed;inset:0;z-index:3000;background:#101114;color:#fff;display:none;overflow:auto;padding:24px clamp(14px,4vw,48px)}#baloFavoritesPage.open{display:block}.balo-fav-top{display:flex;align-items:center;justify-content:space-between;gap:12px;border-bottom:1px solid #30323a;padding-bottom:16px;margin-bottom:22px}.balo-fav-top h2{font-size:clamp(22px,3vw,32px);margin:0}.balo-fav-close{border:0;border-radius:10px;padding:10px 16px;background:#fff;color:#111;font-weight:800;cursor:pointer}.balo-fav-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,220px));gap:16px}.balo-fav-card{border:1px solid #333640;border-radius:14px;overflow:hidden;background:#1b1d24;color:#fff;text-align:left;cursor:pointer;padding:0}.balo-fav-card .art{height:105px;display:grid;place-items:center;background:linear-gradient(135deg,#ff1493,#0754c9);font-size:42px}.balo-fav-card strong{display:block;padding:12px}.balo-fav-empty{padding:35px 16px;text-align:center;border:1px solid #30323a;border-radius:14px;color:#ddd;max-width:680px;margin:35px auto;font-size:17px;line-height:1.7}@media(max-width:520px){#baloFavoritesPage{padding:16px}.balo-fav-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}}</style><div class="balo-fav-top"><h2>⭐ My Favourite Games</h2><button class="balo-fav-close" id="baloFavClose" type="button">✕ Close</button></div><div id="baloFavContent"></div>';
    document.body.appendChild(panel);panel.querySelector("#baloFavClose").addEventListener("click",()=>{panel.classList.remove("open");document.body.style.overflow="";});
    panel.addEventListener("click",e=>{if(e.target===panel){panel.classList.remove("open");document.body.style.overflow="";}});
  }
  const content=panel.querySelector("#baloFavContent");content.innerHTML="";
  const favs=games.filter(g=>getGameData(g.id).favorite&&!g.comingSoon);
  if(!favs.length){content.innerHTML='<div class="balo-fav-empty">Sorry, you have no favourite games yet. 😊<br>Please favourite a game first, then it will appear here.</div>';}
  else {const grid=document.createElement("div");grid.className="balo-fav-grid";favs.forEach(game=>{const b=document.createElement("button");b.type="button";b.className="balo-fav-card";const art=document.createElement("div");art.className="art";art.textContent=game.icon;const name=document.createElement("strong");name.textContent=game.title;b.append(art,name);b.addEventListener("click",()=>{panel.classList.remove("open");document.body.style.overflow="";openGame(game);});grid.appendChild(b);});content.appendChild(grid);}
  panel.classList.add("open");document.body.style.overflow="hidden";
}
function openProfile(){const modal=document.getElementById("baloProfileModal"),input=document.getElementById("baloProfileName"),profile=getProfile();if(profile)input.value=profile.name;modal.classList.add("open");setTimeout(()=>input.focus(),50);}
function closeProfile(){document.getElementById("baloProfileModal")?.classList.remove("open");}
function saveProfileFromUI(){const input=document.getElementById("baloProfileName"),name=input.value.trim();if(!name){input.focus();return;}saveProfile({name,createdAt:getProfile()?.createdAt||new Date().toISOString()});document.getElementById("baloProfileBtn").textContent="👤 "+name;closeProfile();toast("Profile saved! 👤");}

function injectPlayerStyles(){
  if(document.getElementById("balo-player-styles"))return;
  const style=document.createElement("style");style.id="balo-player-styles";style.textContent=`
#gameOverlay{padding:0!important;background:#101114!important;align-items:stretch!important;justify-content:center!important}#gameOverlay.open{display:flex!important}.balo-player{width:100%;height:100%;display:grid;grid-template-columns:190px minmax(0,900px) minmax(80px,1fr);gap:18px;align-items:center;padding:20px 22px}.balo-side{background:#191b21;border:1px solid #2c2f38;border-radius:16px;padding:14px;color:#fff;display:flex;flex-direction:column;gap:10px;box-shadow:0 8px 30px rgba(0,0,0,.22)}.balo-title{font-weight:800;font-size:15px;margin:3px 5px 8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.balo-btn{width:100%;border:0;border-radius:11px;padding:11px 9px;background:#272a32;color:#fff;font-weight:700;cursor:pointer;font-size:13px;transition:.15s}.balo-btn:hover{background:#343844}.balo-btn.active{background:linear-gradient(135deg,#ff69b4,#ff1493)}.balo-btn .count{opacity:.8;margin-left:4px}.balo-game-wrap{min-width:0;display:flex;flex-direction:column;gap:9px;align-items:center}.balo-game-head{width:100%;display:flex;align-items:center;justify-content:space-between;gap:10px;color:#fff;padding:0 3px}.balo-game-name{font-size:18px;font-weight:800}.balo-close{border:0;border-radius:10px;padding:9px 13px;background:#fff;color:#222;font-weight:800;cursor:pointer}.balo-frame-shell{width:100%;background:#000;border-radius:14px;overflow:hidden;box-shadow:0 12px 45px rgba(0,0,0,.42)}#gameOverlay #gameFrame{display:block;width:100%;height:min(82vh,760px);border:0;border-radius:0;background:#fff}.balo-frame-shell:fullscreen{width:100vw;height:100vh;border-radius:0}.balo-frame-shell:fullscreen #gameFrame{width:100vw;height:100vh}.balo-empty-right{min-width:0}#baloToast{position:fixed;left:50%;bottom:25px;transform:translateX(-50%);z-index:2200;background:#191b21;color:#fff;padding:12px 18px;border-radius:12px;box-shadow:0 8px 25px rgba(0,0,0,.35);font-weight:700;font-size:14px;opacity:0;pointer-events:none;transition:.2s}#baloToast.show{opacity:1}#baloCommentModal{position:fixed;inset:0;z-index:1800;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(0,0,0,.65)}#baloCommentModal.open{display:flex}#baloCommentBox{width:min(430px,100%);background:#fff;color:#222;border-radius:18px;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.4)}#baloCommentBox h3{margin-bottom:8px}#baloCommentBox p{color:#666;font-size:13px;margin-bottom:12px}#baloCommentInput{width:100%;min-height:90px;resize:vertical;border:1px solid #ddd;border-radius:12px;padding:11px;font:inherit;outline:none}#baloCommentInput:focus{border-color:#ff1493}.balo-comment-actions{display:flex;justify-content:flex-end;gap:9px;margin-top:12px}.balo-comment-actions button{border:0;border-radius:10px;padding:10px 15px;font-weight:800;cursor:pointer}#baloCommentCancel{background:#eee}#baloCommentSend{background:#ff1493;color:#fff}@media(max-width:850px){.balo-player{grid-template-columns:72px minmax(0,1fr);gap:8px;padding:10px}.balo-side{padding:7px;gap:6px}.balo-title{display:none}.balo-btn{padding:10px 5px;font-size:11px}.balo-empty-right{display:none}#gameOverlay #gameFrame{height:82vh}}@media(max-width:560px){.balo-player{grid-template-columns:1fr;grid-template-rows:auto 1fr}.balo-side{flex-direction:row;overflow-x:auto;align-items:center}.balo-title{display:block;margin:0;min-width:max-content}.balo-btn{width:auto;min-width:74px}#gameOverlay #gameFrame{height:72vh}}
`;document.head.appendChild(style);
}
function buildPlayer(){injectPlayerStyles();gameOverlay.innerHTML=`<div class="balo-player"><aside class="balo-side" aria-label="Game options"><div class="balo-title" id="baloPlayerTitle">Game</div><button class="balo-btn" id="baloLikeBtn" type="button">👍 Like <span class="count" id="baloLikeCount"></span></button><button class="balo-btn" id="baloUnlikeBtn" type="button">👎 Unlike <span class="count" id="baloUnlikeCount"></span></button><button class="balo-btn" id="baloFavoriteBtn" type="button">⭐ Favorite</button><button class="balo-btn" id="baloShareBtn" type="button">↗ Share</button><button class="balo-btn" id="baloFullscreenBtn" type="button">⛶ Full Screen</button><button class="balo-btn" id="baloExitBtn" type="button">✕ Close Game</button></aside><section class="balo-game-wrap"><div class="balo-game-head"><div class="balo-game-name" id="baloGameName">Balo Games</div><button class="balo-close" id="baloTopClose" type="button">✕</button></div><div class="balo-frame-shell"><iframe id="gameFrame" src="" title="Game" allowfullscreen></iframe></div></section><div class="balo-empty-right" aria-hidden="true"></div></div><div id="baloCommentModal" role="dialog" aria-modal="true" aria-label="Write a comment"><div id="baloCommentBox"><h3 id="baloCommentTitle">Tell us what you think</h3><p>Your comment is saved on this device for this game.</p><textarea id="baloCommentInput" maxlength="500" placeholder="Write your comment..."></textarea><div class="balo-comment-actions"><button id="baloCommentCancel" type="button">Cancel</button><button id="baloCommentSend" type="button">Send Comment</button></div></div></div><div id="baloToast" role="status" aria-live="polite"></div>`;document.getElementById("baloLikeBtn").addEventListener("click",toggleLike);document.getElementById("baloUnlikeBtn").addEventListener("click",toggleUnlike);document.getElementById("baloFavoriteBtn").addEventListener("click",toggleFavorite);document.getElementById("baloShareBtn").addEventListener("click",shareGame);document.getElementById("baloFullscreenBtn").addEventListener("click",fullscreenGame);document.getElementById("baloExitBtn").addEventListener("click",closeGame);document.getElementById("baloTopClose").addEventListener("click",closeGame);document.getElementById("baloCommentCancel").addEventListener("click",closeComment);document.getElementById("baloCommentSend").addEventListener("click",submitComment);}
function updatePlayerState(){if(!currentGame)return;const d=getGameData(currentGame.id);const like=document.getElementById("baloLikeBtn"),unlike=document.getElementById("baloUnlikeBtn"),fav=document.getElementById("baloFavoriteBtn");if(!like)return;like.classList.toggle("active",d.like);unlike.classList.toggle("active",d.unlike);fav.classList.toggle("active",d.favorite);document.getElementById("baloLikeCount").textContent=d.like?"✓":"";document.getElementById("baloUnlikeCount").textContent=d.unlike?"✓":"";fav.innerHTML=d.favorite?"⭐ Favorited":"⭐ Favorite";}
function openGame(game){if(!game||!game.path)return;currentGame=game;buildPlayer();document.getElementById("baloPlayerTitle").textContent=game.title;document.getElementById("baloGameName").textContent=game.title;document.getElementById("gameFrame").src=game.path;gameOverlay.classList.add("open");document.body.style.overflow="hidden";updatePlayerState();}
function closeGame(){if(document.fullscreenElement&&document.exitFullscreen)document.exitFullscreen().catch(()=>{});gameOverlay.classList.remove("open");const frame=document.getElementById("gameFrame");if(frame)frame.src="";document.body.style.overflow="";currentGame=null;}
function toast(message){const el=document.getElementById("baloToast");if(!el)return;el.textContent=message;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2200);}
function toggleLike(){if(!currentGame)return;const d=getGameData(currentGame.id);if(d.like){saveGameData(currentGame.id,{like:false});updatePlayerState();return;}saveGameData(currentGame.id,{like:true,unlike:false});updatePlayerState();openComment("Thanks for the Like! 😊","Tell us what you liked about this game.");}
function toggleUnlike(){if(!currentGame)return;const d=getGameData(currentGame.id);if(d.unlike){saveGameData(currentGame.id,{unlike:false});updatePlayerState();return;}saveGameData(currentGame.id,{unlike:true,like:false});updatePlayerState();toast("Thanks for your feedback 😔");}
function toggleFavorite(){if(!currentGame)return;const d=getGameData(currentGame.id);saveGameData(currentGame.id,{favorite:!d.favorite});updatePlayerState();toast(d.favorite?"Removed from Favorites":"Added to Favorites ⭐");}
function openComment(title,placeholder){const modal=document.getElementById("baloCommentModal"),input=document.getElementById("baloCommentInput");document.getElementById("baloCommentTitle").textContent=title;input.placeholder=placeholder||"Write your comment...";input.value="";modal.classList.add("open");setTimeout(()=>input.focus(),50);}
function closeComment(){const modal=document.getElementById("baloCommentModal");if(modal)modal.classList.remove("open");}
function submitComment(){if(!currentGame)return;const input=document.getElementById("baloCommentInput"),text=input.value.trim();if(!text){input.focus();return;}const d=getGameData(currentGame.id);d.comments=Array.isArray(d.comments)?d.comments:[];d.comments.push({text,time:new Date().toISOString()});saveGameData(currentGame.id,{comments:d.comments});closeComment();toast("Thanks for your comment! 😊");}
async function shareGame(){if(!currentGame)return;const url=new URL(currentGame.path,window.location.href).href;try{if(navigator.share){await navigator.share({title:currentGame.title+" - Balo Games",text:"Play "+currentGame.title+" on Balo Games",url});toast("Shared successfully! ❤️");}else if(navigator.clipboard){await navigator.clipboard.writeText(url);toast("Game link copied! 🔗");}else window.prompt("Copy this game link:",url);}catch(e){if(e&&e.name!=="AbortError")toast("Share cancelled");}}
async function fullscreenGame(){try{if(document.fullscreenElement){await document.exitFullscreen();return;}const shell=document.querySelector(".balo-frame-shell"),frame=document.getElementById("gameFrame");if(shell&&shell.requestFullscreen){await shell.requestFullscreen();}else if(frame&&frame.requestFullscreen){await frame.requestFullscreen();}else if(frame){window.open(frame.src,"_blank","noopener,noreferrer");}}catch(e){toast("Full screen is not available here");}}
if(logoBtn)logoBtn.addEventListener("click",event=>{if(gameOverlay.classList.contains("open")){event.preventDefault();closeGame();}});
document.addEventListener("keydown",event=>{if(event.key==="Escape"){const fav=document.getElementById("baloFavoritesPage"),modal=document.getElementById("baloCommentModal"),profile=document.getElementById("baloProfileModal");if(fav&&fav.classList.contains("open")){fav.classList.remove("open");document.body.style.overflow="";return;}if(modal&&modal.classList.contains("open")){closeComment();return;}if(profile&&profile.classList.contains("open"))closeProfile();}});
injectHomeTools();filterGames("all");
