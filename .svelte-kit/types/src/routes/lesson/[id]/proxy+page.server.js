// @ts-nocheck
import { getLessonById } from '$lib/data/lessons';
import { error } from '@sveltejs/kit';

/** @param {Parameters<import('./$types').PageServerLoad>[0]} event */
export function load({ params }) {
  const { id } = params;
  const lesson = getLessonById(id);
  
  if (!lesson) {
    throw error(404, 'Lesson not found');
  }
  
  return {
    lesson
  };
}