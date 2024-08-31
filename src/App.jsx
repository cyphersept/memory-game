import { useEffect, useState } from "react";
import * as Logic from "./Logic.js";
import { languages } from "./languages.js";

import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [score, setScore] = useState(0); // Current score
  const [best, setBest] = useState(0); // Best score
  const [boardState, setBoardState] = useState(["ae", "ad"]); // Card layout on board
  const [lang, setLang] = useState("en"); // Language for country names
  const [names, setNames] = useState("unset"); // {country_code: "Country Name"}
  const [pool, setPool] = useState("unset"); //  Set of country codes
  const [cardCount, setCardCount] = useState(10); //  Number of cards in play
  const [showResults, setShowResults] = useState(false); // Toggles visibility of <<Results>

  // Initializes game according to API data
  const fetchData = (reset = false, code = lang) => {
    fetch("https://flagcdn.com/" + code + "/codes.json")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setNames(data);
        if (reset === true) {
          let poolSet = new Set(Object.keys(data));
          setPool(poolSet);
          startGame(cardCount, poolSet);
        }
      });
  };

  // Starts a new game with a different card cardCount and pool
  const startGame = (cardCount, pool) => {
    setShowResults(false);
    if (score > best) setBest(score);
    setScore(0);
    Logic.clear();
    setBoardState(Logic.setCards(cardCount, pool));
  };

  // Pairs with event delegator to overcome bubbling issues
  const findCardAncestor = (element, target) => {
    let current = element;
    while (current) {
      if (current.classList.contains(target)) return current;
      current = current.parentElement;
    }
    return null; // If it is not a card
  };

  // Event delegator - What happens when a card is clicked
  const handleClick = (event) => {
    const card = findCardAncestor(event.target, "card");
    const success = Logic.pick(card.dataset.code);
    if (success) {
      setScore(score + 1);
      setBoardState(Logic.setCards(cardCount, pool));
    } else {
      setShowResults(true);
    }
  };

  // Lists options for language selector
  const langOptions = Object.keys(languages).map((key) => (
    <option key={key.toLocaleLowerCase()} value={key.toLocaleLowerCase()}>
      {languages[key]}
    </option>
  ));

  useEffect(() => fetchData(true), []);

  return (
    <>
      <header>
        <h1>🌎 Flag Memory Game 🌍</h1>
        <div className="flex options">
          <select
            name="language"
            id="language"
            value={lang}
            onChange={(e) => {
              setLang(e.target.value);
              fetchData(null, e.target.value);
            }}
          >
            {langOptions}
          </select>
          <div className="flex">
            <label htmlFor="difficulty">Difficulty:</label>
            <input
              type="range"
              id="difficulty"
              name="difficulty"
              min="5"
              step="5"
              max="25"
              value={"" + cardCount}
              onChange={(e) => {
                setCardCount(parseInt(e.target.value));
                setShowResults(true);
              }}
            />
          </div>
          <Score score={score} best={best} />
        </div>
      </header>
      <main>
        <Gameboard
          names={names}
          boardState={boardState}
          onClick={handleClick}
        />
        <Result
          score={score}
          best={best}
          onClick={() => startGame(cardCount, pool)}
          show={showResults}
        />
      </main>
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
function Gameboard({ boardState, names, onClick }) {
  const listCards = boardState.map((country, index) => (
    <Card
      key={index}
      flag={"https://flagcdn.com/" + country + ".svg"}
      name={names[country]}
      code={country}
    />
  ));
  return (
    <ul className="gameboard" onClickCapture={onClick}>
      {listCards}
    </ul>
  );
}
function Card({ code, flag, name }) {
  return (
    <li className="card" data-code={code}>
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
function Result({ score, best, onClick, show }) {
  const result = score > best ? "newBest" : score == best ? "tie" : "noChange";

  if (!show) return <></>;
  return (
    <>
      <div className="cover"></div>
      <div className={"modal " + result}>
        <h2>Results</h2>
        <Score score={score} best={best} />
        <h3>
          {result == "newBest" && "Congratulations! It's a new high score! "}
          {result == "tie" && "Wow! You matched your personal best! "}
          {result == "noChange" && "Good game! "}
          Play again?
        </h3>
        <button title="Play again" onClick={onClick}>
          ↻
        </button>
      </div>
    </>
  );
}

export default App;
