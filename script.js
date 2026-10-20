/* Balo Games — game library, search, and play controls */
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
const gameFrame=document.getElementById("gameFrame");
const logoBtn=document.getElementById("logoBtn");
const gameCloseBtn=document.getElementById("gameCloseBtn");
const confirmBackdrop=document.getElementById("confirmBackdrop");
const confirmYesBtn=document.getElementById("confirmYesBtn");
const confirmNoBtn=document.getElementById("confirmNoBtn");
const confirmCloseBtn=document.getElementById("confirmCloseBtn");
const gameSearch=document.getElementById("gameSearch");
const clearSearch=document.getElementById("clearSearch");
const gameCount=document.getElementById("gameCount");
const emptyGames=document.getElementById("emptyGames");
let selectedCategory="all";
let searchTerm="";
function isGameOpen(){return gameOverlay.classList.contains("open");}
function showGames(list){
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
    if(!game.comingSoon){card.setAttribute("aria-label","Play "+game.title);card.addEventListener("click",event=>{event.preventDefault();openGame(game.path);});}else card.setAttribute("aria-label",game.title+", coming soon");
    grid.appendChild(card);
  });
  gameCount.textContent=list.length+(list.length===1?" game":" games")+" shown";emptyGames.hidden=list.length!==0;grid.hidden=list.length===0;
}
function applyFilters(){const filtered=games.filter(game=>{const categoryMatches=selectedCategory==="all"||game.category===selectedCategory;const haystack=(game.title+" "+game.desc+" "+game.category).toLowerCase();return categoryMatches&&haystack.includes(searchTerm)});showGames(filtered)}
function filterGames(category){selectedCategory=category;document.querySelectorAll(".category[data-category]").forEach(button=>{const active=button.dataset.category===category;button.classList.toggle("active",active);button.setAttribute("aria-pressed",String(active))});applyFilters()}
function requestLandscape(){try{if(screen.orientation&&typeof screen.orientation.lock==="function"){screen.orientation.lock("landscape").catch(()=>{});}}catch(error){}}
function openGame(path){if(!path)return;requestLandscape();gameFrame.src=path;gameOverlay.classList.add("open");document.body.style.overflow="hidden";gameCloseBtn.focus()}
function closeGame(){gameOverlay.classList.remove("open");gameFrame.src="";confirmBackdrop.classList.remove("open");document.body.style.overflow="";logoBtn.focus()}
function showConfirm(){confirmBackdrop.classList.add("open");confirmYesBtn.focus()}
function hideConfirm(){confirmBackdrop.classList.remove("open");gameCloseBtn.focus()}
logoBtn.addEventListener("click",()=>{if(isGameOpen())showConfirm();else window.scrollTo({top:0,behavior:"smooth"})});gameCloseBtn.addEventListener("click",showConfirm);confirmYesBtn.addEventListener("click",closeGame);confirmNoBtn.addEventListener("click",hideConfirm);confirmCloseBtn.addEventListener("click",hideConfirm);confirmBackdrop.addEventListener("click",event=>{if(event.target===confirmBackdrop)hideConfirm()});
document.addEventListener("keydown",event=>{if(event.key==="Escape"&&confirmBackdrop.classList.contains("open"))hideConfirm();else if(event.key==="Escape"&&isGameOpen())showConfirm()});
gameSearch.addEventListener("input",()=>{searchTerm=gameSearch.value.trim().toLowerCase();clearSearch.hidden=!gameSearch.value;applyFilters()});
clearSearch.addEventListener("click",()=>{gameSearch.value="";searchTerm="";clearSearch.hidden=true;applyFilters();gameSearch.focus()});
document.getElementById("resetFilters").addEventListener("click",()=>{gameSearch.value="";searchTerm="";clearSearch.hidden=true;filterGames("all");gameSearch.focus()});
showGames(games);
