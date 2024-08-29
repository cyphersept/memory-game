import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [boardState, setBoardState] = useState(["ae", "ad"]);
  const [lang, setLang] = useState("en");
  const [names, setNames] = useState({});

  const fetchData = () => {
    fetch("https://flagcdn.com/" + lang + "/codes.json")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setNames(data);
      });
  };

  const handleClick = () => {};

  useEffect(() => fetchData, []);

  return (
    <>
      <header>
        <h1>Flag Memory Game</h1>
        <Score score={score} best={best} />
      </header>
      <Gameboard names={names} boardState={boardState} />
    </>
  );
}

function Score({ score, best }) {
  return (
    <div className="score">
      <span className="current">Current: {score}</span>
      <span className="best">Best: {best}</span>
    </div>
  );
}
function Gameboard({ boardState, names }) {
  const listCards = boardState.map((country, index) => (
    <Card
      key={index}
      flag={"https://flagcdn.com/" + country + ".svg"}
      name={names[country]}
    />
  ));
  return (
    <main>
      <ul className="gameboard">{listCards}</ul>
    </main>
  );
}
function Card({ flag, name }) {
  return (
    <li className="card">
      <div className="inner">
        <div className="flex front">
          <img src={flag} />
        </div>
        <div className="back">
          <p>{name}</p>
        </div>
      </div>
    </li>
  );
}
function Result({ score, best, onClick }) {
  const result = score > best ? "newBest" : score == best ? "tie" : "noChange";

  return (
    <div className={"modal " + result}>
      <h1>Results</h1>
      <Score score={score} best={best} />
      <h2>
        {result == "newBest" && "Congratulations! It's a new high score! "}
        {result == "tie" && "Wow! You matched your personal best! "}
        {result == "noChange" && "Good game! "}
        Play again?
      </h2>
      <button title="Play again">↻</button>
    </div>
  );
}

function Logic() {
  const picked = new Set();
  const alreadyPicked = (val) => picked.has(val);
  const allArePicked = (arr) => arr.every(alreadyPicked);

  // Marks a value as picked
  const pick = (val) => picked.add(val);

  // Returns a random element from the set
  const randomElement = (set) => [...set][Math.floor(Math.random() * set.size)];

  // Give each card a random value
  const setCards = (size, pool) => {
    const arr = Array(size);
    for (let index = 0; index < arr.length; index++) {
      arr[index] = randomElement(pool);
    }
    // If the board contains no new cards, introduce some
    while (allArePicked(arr)) {
      const ratio = picked.size / pool.size;
      const unpickedSet = pool.difference(picked);
      arr.forEach(() => {
        if (Math.random > ratio) randomElement(unpickedSet);
      });
    }
    return arr;
  };

  // Clears all picked cards
  const clear = () => picked.clear;

  return { setCards, pick, clear };
}

export default App;
