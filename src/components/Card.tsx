interface CardProps {
  picUrl: string;
  isOpened: boolean;
}

function Card({ picUrl, isOpened }: CardProps) {
  return (
    <div className="w-full h-full relative">
      {!isOpened && <div className="absolute w-full h-full bg-zinc-400"></div>}
      <div className="w-full h-full bg-red-400"></div>
    </div>
  );
}

export default Card;
