import { getLessonById } from '$lib/data/lessons';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
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