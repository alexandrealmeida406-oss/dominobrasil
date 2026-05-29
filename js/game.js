// ══════════════════════════════════════════════
//   DOMINÓ BRASIL — game.js  (lógica do jogo)
// ══════════════════════════════════════════════

export function makeDominos() {
  const t = [];
  for (let i = 0; i <= 6; i++)
    for (let j = i; j <= 6; j++)
      t.push([i, j]);
  return t;
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = 0 | Math.random() * (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function dealHands(numPlayers) {
  const tiles = shuffle(makeDominos());
  const tilesPerPlayer = numPlayers <= 2 ? 7 : 7;
  const hands = [];
  for (let p = 0; p < numPlayers; p++)
    hands.push(tiles.splice(0, tilesPerPlayer));
  return { hands, boneyard: tiles };
}

export function canPlay(tile, leftEnd, rightEnd, chainLength) {
  if (chainLength === 0) return true;
  return tile[0] === leftEnd || tile[1] === leftEnd ||
         tile[0] === rightEnd || tile[1] === rightEnd;
}

export function anyCanPlay(hand, leftEnd, rightEnd, chainLength) {
  return hand.some(t => canPlay(t, leftEnd, rightEnd, chainLength));
}

export function placeTile(chain, tile, side, leftEnd, rightEnd) {
  let newLeft = leftEnd, newRight = rightEnd;
  const newChain = [...chain];

  if (chain.length === 0) {
    newChain.push({ tile, flip: false });
    newLeft  = tile[0];
    newRight = tile[1];
  } else if (side === 'left') {
    const flip = tile[1] === leftEnd;
    newChain.unshift({ tile, flip: !flip });
    newLeft = flip ? tile[0] : tile[1];
  } else {
    const flip = tile[0] !== rightEnd;
    newChain.push({ tile, flip });
    newRight = flip ? tile[0] : tile[1];
  }
  return { chain: newChain, leftEnd: newLeft, rightEnd: newRight };
}

export function sumHand(hand) {
  return hand.reduce((s, t) => s + t[0] + t[1], 0);
}

export function decideSide(tile, leftEnd, rightEnd, chain) {
  if (chain.length === 0) return 'right';
  const cL = tile[0] === leftEnd || tile[1] === leftEnd;
  const cR = tile[0] === rightEnd || tile[1] === rightEnd;
  if (cL && !cR) return 'left';
  return 'right';
}

// Simple AI: pick first playable tile
export function aiChoose(hand, leftEnd, rightEnd, chainLength) {
  for (let i = 0; i < hand.length; i++) {
    if (canPlay(hand[i], leftEnd, rightEnd, chainLength))
      return i;
  }
  return -1;
}
