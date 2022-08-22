interface CardProps {
  picUrl: string;
  isOpened: boolean;
}

function Card({ picUrl, isOpened }: CardProps) {
  return (
    <div className="w-full h-full relative">
      {!isOpened && <div className="absolute w-full h-full bg-zinc-400"></div>}
      <img src={picUrl} className="w-full h-full object-cover" />
    </div>
  );
}

export default Card;
