import axios from 'axios';
import { useEffect, useState } from 'react';
import Card from './components/Card';
import LoadingSpinner from './components/LoadingSpinner';
import { CardInfo } from './interfaces';
import { shuffle } from './utils/shuffle';

async function getCardsData() {
  const response = await axios.get('https://picsum.photos/v2/list?limit=8');
  const cards = response.data.map((card: any) => ({
    id: card.id,
    picUrl: card.download_url,
    isOpened: false,
  }));
  return cards;
}

function App() {
  const [moveCount, setMoveCount] = useState(0);
  const [cardsInfo, setCardsInfo] = useState<CardInfo[] | null>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsLoading(true);
    getCardsData()
      .then((cards) => {
        const doubledShuffledCards = shuffle([...cards, ...cards]);
        setCardsInfo(doubledShuffledCards);
        setIsLoading(false);
      })
      .catch(() => setError('Failed fetching data. Try refereshing the page.'));
  }, []);

  return (
    <div className="h-screen w-full bg-slate-800 flex flex-col items-center pt-6 text-white">
      <h1 className="font-bold text-lg">Memory Game</h1>
      <p className="w-2/3 text-center text-xs sm:w-1/3 md:w-1/4">
        <b>How to play: </b>In a move, you can pick two cards. If they match,
        they will be left opened. Your task is to open all cards with the least
        number of moves.
        <br />
        <b>Move count: {moveCount}</b>
      </p>
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <h2 className="text-red-500">{error}</h2>
      ) : (
        <div className="mt-5 w-4/5 h-3/4 grid grid-cols-4 grid-rows-4 gap-4">
          {cardsInfo?.map((card, idx) => (
            <div key={idx} onClick={() => console.log(idx)}>
              <Card picUrl={card.picUrl} isOpened={card.isOpened} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
