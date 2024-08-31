const picked = new Set();
const currentHand = new Set();
const alreadyPicked = (val) => picked.has(val);
const allArePicked = (arr) => arr.every(alreadyPicked);

// Returns a random element from the set
const randomElement = (set) => [...set][Math.floor(Math.random() * set.size)];

// Attemps to pick a card
const pick = (val) => {
  if (alreadyPicked(val)) return false;
  else {
    picked.add(val);
    return true;
  }
};

// Give each card a random value
const setCards = (size, pool) => {
  const arr = Array(size);
  currentHand.clear();

  // Add unique cards to board
  for (let index = 0; index < arr.length; index++) {
    const uniqueEl = randomElement(pool.difference(currentHand));
    arr[index] = uniqueEl;
    currentHand.add(uniqueEl);
  }
  // If the board contains no new cards, introduce some
  while (allArePicked(arr)) {
    const ratio = picked.size / pool.size;
    const unpickedSet = pool.difference(picked);
    arr.forEach(() => {
      if (Math.random > ratio)
        randomElement(unpickedSet.difference(currentHand));
    });
  }
  return arr;
};

// Clears all picked cards
const clear = () => picked.clear();

export { setCards, pick, clear };
