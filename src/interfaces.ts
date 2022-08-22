export type GetCardsInfo = {
  id: string;
  download_url: string;
}[];

export interface CardInfo {
  id: string;
  picUrl: string;
  isOpened: boolean;
}