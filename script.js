/* Balo Games — game library, search, category filters, and play controls */
const games = [
  { id:"snake-king", title:"Snake King", icon:"🐍", desc:"Classic snake action with mobile and keyboard controls.", category:"arcade", path:"games/snake-king/index.html" },
  { id:"memory-match", title:"Memory Match", icon:"🧠", desc:"Find matching cards and test your memory.", category:"arcade", path:"games/MATCH%20GAME/memory-match.html" },
  { id:"my-gun-life", title:"My Gun Life", icon:"⚡", desc:"Jump into a fast-paced action game.", category:"action", path:"games/my-gun-life/index.html" },
  { id:"tik-tak-toe", title:"Tic Tac Toe", icon:"❌⭕", desc:"A classic strategy game for a quick match.", category:"arcade", path:"games/tik-tak-toe/index.html" },
  { id:"evo-eater", title:"Evo-Eater", icon:"🦅", desc:"Grow, evolve, and explore the arena.", category:"action", path:"games/evoeater/index.html" },
  { id:"coming-soon-adventure", title:"Adventure Games", icon:"🗺️", desc:"A new adventure is being prepared.", category:"adventure", path:"", comingSoon:true },
  { id:"coming-soon-arcade", title:"More Arcade Games", icon:"🕹️", desc:"More quick-play challenges are on the way.", category:"arcade", path:"", comingSoon:true }
];

function initBaloGames(){
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
  const resetFilters=document.getElementById("resetFilters");
  const categoryButtons=document.querySelectorAll(".category[data-category]");

  if(!grid || !gameSearch || !categoryButtons.length){
    console.error("Balo Games: required homepage elements are missing.");
    return;
  }

  let selectedCategory="all";
  let searchTerm="";

  function isGameOpen(){
    return gameOverlay && gameOverlay.classList.contains("open");
  }

  function showGames(list){
    grid.innerHTML="";

    list.forEach(game=>{
      const card=document.createElement(game.comingSoon ? "article" : "a");
      card.className="game-card"+(game.comingSoon ? " coming-soon-card" : "");

      if(!game.comingSoon) card.href=game.path;

      const art=document.createElement("div");
      art.className="game-image game-image-"+game.id;
      art.setAttribute("aria-hidden","true");

      const icon=document.createElement("span");
      icon.className="game-icon";
      icon.textContent=game.icon;

      const tag=document.createElement("span");
      tag.className="game-category-tag";
      tag.textContent=game.category;
      art.append(icon,tag);

      const info=document.createElement("div");
      info.className="game-info";

      const title=document.createElement("h3");
      title.textContent=game.title;

      const desc=document.createElement("p");
      desc.textContent=game.desc;

      const action=document.createElement("span");
      action.className="game-action"+(game.comingSoon ? " coming-soon-label" : "");
      action.textContent=game.comingSoon ? "Coming soon ✦" : "Play game →";

      info.append(title,desc,action);
      card.append(art,info);

      if(!game.comingSoon){
        card.setAttribute("aria-label","Play "+game.title);
        card.addEventListener("click",event=>{
          event.preventDefault();
          openGame(game.path);
        });
      }else{
        card.setAttribute("aria-label",game.title+", coming soon");
      }

      grid.appendChild(card);
    });

    if(gameCount){
      gameCount.textContent=list.length+(list.length===1 ? " game" : " games")+" shown";
    }

    if(emptyGames) emptyGames.hidden=list.length!==0;
    grid.hidden=list.length===0;
  }

  function applyFilters(){
    const filtered=games.filter(game=>{
      const categoryMatches=selectedCategory==="all" || game.category===selectedCategory;
      const haystack=(game.title+" "+game.desc+" "+game.category).toLowerCase();
      return categoryMatches && haystack.includes(searchTerm);
    });
    showGames(filtered);
  }

  function setActiveCategory(category){
    categoryButtons.forEach(button=>{
      const active=button.dataset.category===category;
      button.classList.toggle("active",active);
      button.setAttribute("aria-pressed",String(active));
    });
  }

  function filterGames(category){
    selectedCategory=category;
    setActiveCategory(category);
    applyFilters();
  }

  function requestLandscape(){
    try{
      if(screen.orientation && typeof screen.orientation.lock==="function"){
        screen.orientation.lock("landscape").catch(()=>{});
      }
    }catch(error){}
  }

  function openGame(path){
    if(!path || !gameOverlay || !gameFrame) return;
    requestLandscape();
    gameFrame.src=path;
    gameOverlay.classList.add("open");
    document.body.style.overflow="hidden";
    if(gameCloseBtn) gameCloseBtn.focus();
  }

  function closeGame(){
    if(gameOverlay) gameOverlay.classList.remove("open");
    if(gameFrame) gameFrame.src="";
    if(confirmBackdrop) confirmBackdrop.classList.remove("open");
    document.body.style.overflow="";
    if(logoBtn) logoBtn.focus();
  }

  function showConfirm(){
    if(!confirmBackdrop) return;
    confirmBackdrop.classList.add("open");
    if(confirmYesBtn) confirmYesBtn.focus();
  }

  function hideConfirm(){
    if(!confirmBackdrop) return;
    confirmBackdrop.classList.remove("open");
    if(gameCloseBtn) gameCloseBtn.focus();
  }

  /* FIX: the category buttons now have their click handlers. */
  categoryButtons.forEach(button=>{
    button.addEventListener("click",()=>{
      filterGames(button.dataset.category || "all");
    });
  });

  if(logoBtn){
    logoBtn.addEventListener("click",event=>{
      event.preventDefault();
      if(isGameOpen()) showConfirm();
      else window.scrollTo({top:0,behavior:"smooth"});
    });
  }

  if(gameCloseBtn) gameCloseBtn.addEventListener("click",showConfirm);
  if(confirmYesBtn) confirmYesBtn.addEventListener("click",closeGame);
  if(confirmNoBtn) confirmNoBtn.addEventListener("click",hideConfirm);
  if(confirmCloseBtn) confirmCloseBtn.addEventListener("click",hideConfirm);

  if(confirmBackdrop){
    confirmBackdrop.addEventListener("click",event=>{
      if(event.target===confirmBackdrop) hideConfirm();
    });
  }

  document.addEventListener("keydown",event=>{
    if(event.key!=="Escape") return;
    if(confirmBackdrop && confirmBackdrop.classList.contains("open")) hideConfirm();
    else if(isGameOpen()) showConfirm();
  });

  gameSearch.addEventListener("input",()=>{
    searchTerm=gameSearch.value.trim().toLowerCase();
    if(clearSearch) clearSearch.hidden=!gameSearch.value;
    applyFilters();
  });

  if(clearSearch){
    clearSearch.addEventListener("click",()=>{
      gameSearch.value="";
      searchTerm="";
      clearSearch.hidden=true;
      applyFilters();
      gameSearch.focus();
    });
  }

  if(resetFilters){
    resetFilters.addEventListener("click",()=>{
      gameSearch.value="";
      searchTerm="";
      if(clearSearch) clearSearch.hidden=true;
      filterGames("all");
      gameSearch.focus();
    });
  }

  setActiveCategory("all");
  applyFilters();
}

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",initBaloGames);
}else{
  initBaloGames();
}
