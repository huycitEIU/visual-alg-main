import { bubbleSortLesson } from './array-bubble-sort';
import { binarySearchLesson } from './array-binary-search';
import { averageElementsLesson } from './array-average';
import { allIndicesLesson } from './array-all-indices';
import { countMaxOccurrencesLesson } from './array-count-max-occurrences';
import { countOccurrencesLesson } from './array-count-occurrences';
import { countUniqueLesson } from './array-count-unique';
import { containsLesson } from './array-contains';
import { findMaxLesson } from './array-find-max';
import { findMinLesson } from './array-find-min';
import { indexOfMaxLesson } from './array-index-of-max';
import { indexOfMinLesson } from './array-index-of-min';
import { indexOfLesson } from './array-index-of';
import { isSortedLesson } from './array-is-sorted';
import { lastIndexOfLesson } from './array-last-index-of';
import { longestRunLesson } from './array-longest-run';
import { mergeSortedLesson } from './array-merge-sorted';
import { missingNumberLesson } from './array-missing-number';
import { mostFrequentLesson } from './array-most-frequent';
import { pairsWithSumLesson } from './array-pairs-with-sum';
import { reverseArrayLesson } from './array-reverse';
import { removeDuplicatesLesson } from './array-remove-duplicates';
import { rotateArrayLesson } from './array-rotate';
import { sortAscendingLesson } from './array-sort-ascending';
import { sortDescendingLesson } from './array-sort-descending';
import { secondExtremeLesson } from './array-second-extreme';
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
  countMaxOccurrencesLesson,
  countUniqueLesson,
  mostFrequentLesson,
  secondExtremeLesson,
  allIndicesLesson,
  isSortedLesson,
  removeDuplicatesLesson,
  pairsWithSumLesson,
  rotateArrayLesson,
  longestRunLesson,
  mergeSortedLesson,
  missingNumberLesson,
  reverseArrayLesson,
  sortAscendingLesson,
  sortDescendingLesson,
  bubbleSortLesson,
];

export function getLessonById(id: string): LessonDefinition | undefined {
  return lessons.find((lesson) => lesson.id === id);
}