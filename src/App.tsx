import axios from 'axios';
import { useEffect, useState } from 'react';
import Card from './components/Card';
import LoadingSpinner from './components/LoadingSpinner';
import { CardInfo, GetCardsInfo } from './interfaces';
import { api } from './utils/api';
import { shuffle } from './utils/shuffle';

const NUM_OF_PAIRS = 8;

async function getCardsData() {
  const cardsInfo = await api<GetCardsInfo>(
    `https://picsum.photos/v2/list?page=10&limit=${NUM_OF_PAIRS}`
  );
  const cards = cardsInfo.map((card) => ({
    id: card.id,
    picUrl: card.download_url,
    isOpened: false,
  }));
  return cards;
}

function App() {
  const [moveCount, setMoveCount] = useState(0);
  const [cardsInfo, setCardsInfo] = useState<CardInfo[] | undefined>([]);
  const [score, setScore] = useState(0);
  const [firstSelected, setFirstSelected] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsLoading(true);
    getCardsData()
      .then((cards) => {
        const copiedCards = cards.map((c) => ({ ...c }));
        const doubledShuffledCards = shuffle([...cards, ...copiedCards]);
        setCardsInfo(doubledShuffledCards);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
        setError('Failed fetching data. Try refereshing the page.')
      });
  }, []);

  function openCard(idx: number): void {
    setCardsInfo((prev) => {
      const newCardsInfo = [...(prev ?? [])];
      newCardsInfo[idx].isOpened = true;
      return newCardsInfo;
    });
  }

  function closePair(idx1: number, idx2: number): void {
    setCardsInfo((prev) => {
      const newCardsInfo = [...(prev ?? [])];
      newCardsInfo[idx1].isOpened = false;
      newCardsInfo[idx2].isOpened = false;
      return newCardsInfo;
    });
  }

  function onCardClick(idx: number): void {
    if (cardsInfo && cardsInfo[idx].isOpened && idx !== firstSelected) return;
    if (firstSelected === -1) {
      setFirstSelected(idx);
      openCard(idx);
    } else {
      openCard(idx);
      if (cardsInfo && cardsInfo[idx].id === cardsInfo[firstSelected].id) {
        setScore((score) => score + 1);
      } else {
        setTimeout(() => {
          console.log('close');
          closePair(firstSelected, idx);
        }, 1000);
      }
      setFirstSelected(-1);
      setMoveCount((move) => move + 1);
    }
  }

  function reset() {
    const resettedCardsInfo = cardsInfo?.map((card) => ({
      ...card,
      isOpened: false,
    }));
    setCardsInfo(resettedCardsInfo);
    setMoveCount(0);
    setScore(0);
  }

  return (
    <div className="h-screen w-full bg-slate-800 flex flex-col items-center pt-6 text-white">
      <h1 className="font-bold text-lg">Memory Game</h1>
      <p className="w-2/3 text-center text-xs sm:w-1/3 md:w-1/4">
        <b>How to play: </b>In a move, you can open two cards. If they match,
        they will be left opened. Your task is to open all cards with the least
        number of moves.
        <br />
        <b>Move count: {moveCount}</b>
      </p>
      {score >= NUM_OF_PAIRS && (
        <div className="text-sm flex flex-col items-center">
          <p>You did it!</p>
          <button className="p-2 rounded text-white bg-red-500 hover:bg-red-400" onClick={reset}>
            Reset
          </button>
        </div>
      )}
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <h2 className="text-red-500">{error}</h2>
      ) : (
        <div className="mt-5 w-4/5 h-3/4 grid grid-cols-4 grid-rows-4 gap-4 cursor-pointer">
          {cardsInfo?.map((card, idx) => (
            <div key={idx} onClick={() => onCardClick(idx)}>
              <Card picUrl={card.picUrl} isOpened={card.isOpened} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
