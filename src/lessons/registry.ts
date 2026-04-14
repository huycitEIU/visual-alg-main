import { bubbleSortLesson } from './array-bubble-sort';
import { binarySearchLesson } from './array-binary-search';
import { averageElementsLesson } from './array-average';
import { countOccurrencesLesson } from './array-count-occurrences';
import { containsLesson } from './array-contains';
import { findMaxLesson } from './array-find-max';
import { findMinLesson } from './array-find-min';
import { indexOfMaxLesson } from './array-index-of-max';
import { indexOfMinLesson } from './array-index-of-min';
import { indexOfLesson } from './array-index-of';
import { lastIndexOfLesson } from './array-last-index-of';
import { reverseArrayLesson } from './array-reverse';
import { sumElementsLesson } from './array-sum';
import type { LessonDefinition } from './lesson-types';

export const lessons: LessonDefinition[] = [
  indexOfLesson,
  lastIndexOfLesson,
  containsLesson,
  binarySearchLesson,
  findMaxLesson,
  findMinLesson,
  indexOfMaxLesson,
  indexOfMinLesson,
  sumElementsLesson,
  averageElementsLesson,
  countOccurrencesLesson,
  reverseArrayLesson,
  bubbleSortLesson,
];

export function getLessonById(id: string): LessonDefinition | undefined {
  return lessons.find((lesson) => lesson.id === id);
}