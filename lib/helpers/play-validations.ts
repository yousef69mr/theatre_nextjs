import { PlayFestivalType } from "@/types";

export const isPlayLive = (playFestivals: PlayFestivalType[]): boolean => {
  const festivals = playFestivals;

  for (let festival of festivals) {
    for (let show of festival.showTimes) {
      // console.log(show, new Date().getTime() < new Date(show).getTime());
      if (new Date() <= new Date(show)) {
        return true;
      }
    }
  }

  return false;
};
