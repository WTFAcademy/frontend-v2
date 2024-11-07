import { atom } from 'jotai';
import { TChapter } from '../api/use-chapters-api';

export const chapterListAtom = atom<TChapter[]>([]);
