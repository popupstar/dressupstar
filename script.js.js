/* Data Katalog Item */
const WARDROBE_DATA = {
  hair: [
    { id: 'h1', name: 'Rambut Pink', icon: '💇‍♀️', width: 130, autoY: 25, autoX: 85 },
    { id: 'h2', name: 'Pita Bintang', icon: '🎀', width: 80, autoY: 20, autoX: 110 }
  ],
  tops: [
    { id: 't1', name: 'Kaos Pink Star', icon: '👕', width: 120, autoY: 135, autoX: 90 },
    { id: 't2', name: 'Jaket Crop', icon: '🧥', width: 130, autoY: 130, autoX: 85 }
  ],
  bottoms: [
    { id: 'b1', name: 'Rok Mini', icon: '👗', width: 100, autoY: 215, autoX: 100 },
    { id: 'b2', name: 'Celana Denim', icon: '👖', width: 95, autoY: 220, autoX: 102 }
  ],
  shoes: [
    { id: 's1', name: 'Sepatu Boots', icon: '👢', width: 75, autoY: 340, autoX: 112 },
    { id: 's2', name: 'Sneakers', icon: '👟', width: 75, autoY: 345, autoX: 112 }
  ],
  acc: [
    { id: 'a1', name: 'Kacamata Love', icon: '🕶️', width: 75, autoY: 65, autoX: 112 },
    { id: 'a2', name: 'Tas Bintang', icon: '👜', width: 70, autoY: 200, autoX: 60 }
  ],
  bg: [
    { id: 'bg1', name: 'Pink Polka', color: '#ffe6f0' },
    { id: 'bg2', name: 'Cyan Sparkle', color: '#e6f9ff' },
    { id: 'bg3', name: 'Yellow Glow', color: '#fffde6' }
  ]
};

let currentCategory = 'tops';

function startGame() {
  document.getElementById('landing-page').style.display = 'none';
  document.getElementById('game-page').style.display = 'flex';
  renderCategories();
  renderItems(currentCategory);
}

function openInvitation() {
  document.getElementById('invitation-modal').style.display = 'flex';
}

function closeInvitation() {
  document.getElementById('invitation-modal').style.display = 'none';
}

function renderCategories() {
  const categoryNames = { hair: 'Rambut', tops: 'Baju', bottoms: 'Celana/Rok', shoes: 'Sepatu', acc: 'Aksesoris', bg: 'Latar' };
  const tabsContainer = document.getElementById('category-tabs');
  tabsContainer.innerHTML = '';

  Object.keys(WARDROBE_DATA).forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `tab-btn ${cat === currentCategory ? 'active' : ''}`;
    btn.innerText = categoryNames[cat] || cat;
    btn.onclick = () => {
      currentCategory = cat;
      renderCategories();
      renderItems(cat);
    };
    tabsContainer.appendChild(btn);
  });
}

function renderItems(category) {
  const grid = document.getElementById('items-grid');
  grid.innerHTML = '';

  WARDROBE_DATA[category].forEach(item => {
    const card = document.createElement('div');
    card.className = 'item-card';
    
    if (category === 'bg') {
      card.style.backgroundColor = item.color;
      card.innerHTML = `<span style="font-size: 0.8rem; font-weight: bold; color: #444;">${item.name}</span>`;
      card.onclick = () => document.getElementById('stage-bg').style.backgroundColor = item.color;
    } else {
      card.innerHTML = `<span style="font-size: 2rem;">${item.icon}</span>`;
      card.onclick = () => spawnItemToStage(item);
    }

    grid.appendChild(card);
  });
}

function spawnItemToStage(item) {
  const stage = document.getElementById('avatar-stage');
  const existing = document.querySelectorAll(`.equipped-${currentCategory}`);
  existing.forEach(el => el.remove());

  const itemEl = document.createElement('div');
  itemEl.className = `equipped-item equipped-${currentCategory}`;
  itemEl.style.width = item.width + 'px';
  itemEl.style.left = item.autoX + 'px';
  itemEl.style.top = item.autoY + 'px';

  itemEl.innerHTML = `<div style="font-size: ${item.width * 0.7}px; text-align: center; line-height: 1;">${item.icon}</div>`;

  makeElementDraggable(itemEl);
  itemEl.ondblclick = () => itemEl.remove();

  stage.appendChild(itemEl);
}

function makeElementDraggable(elmnt) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  elmnt.onmousedown = dragMouseDown;
  elmnt.ontouchstart = dragTouchStart;

  function dragMouseDown(e) {
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
    elmnt.classList.add('active-drag');
  }

  function elementDrag(e) {
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
    elmnt.classList.remove('active-drag');
  }

  function dragTouchStart(e) {
    const touch = e.touches[0];
    pos3 = touch.clientX;
    pos4 = touch.clientY;
    document.ontouchend = closeTouchElement;
    document.ontouchmove = elementTouchMove;
    elmnt.classList.add('active-drag');
  }

  function elementTouchMove(e) {
    const touch = e.touches[0];
    pos1 = pos3 - touch.clientX;
    pos2 = pos4 - touch.clientY;
    pos3 = touch.clientX;
    pos4 = touch.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeTouchElement() {
    document.ontouchend = null;
    document.ontouchmove = null;
    elmnt.classList.remove('active-drag');
  }
}

function resetOutfit() {
  const items = document.querySelectorAll('.equipped-item');
  items.forEach(el => el.remove());
  document.getElementById('stage-bg').style.backgroundColor = 'transparent';
}

function downloadAvatar() {
  const stage = document.getElementById('avatar-stage');
  html2canvas(stage, { scale: 2 }).then(canvas => {
    const link = document.createElement('a');
    link.download = 'my-pop-up-star-avatar.png';
    link.href = canvas.toDataURL();
    link.click();
  });
}