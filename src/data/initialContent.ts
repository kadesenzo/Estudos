import { generateLibraryCourses } from './coursesFromTelegram';
import { SubjectCategory } from '../types';

export const INITIAL_CATEGORIES: SubjectCategory[] = [
  'Matemática',
  'Física',
  'Química',
  'Redação',
  'Português',
  'Biologia',
  'História',
  'Geografia',
  'Filosofia',
  'Simulados',
  'Concursos Militares',
  'Outros'
];

// Single source of truth: courses from Telegram sequenced strictly from the beginning!
export const INITIAL_COURSES = generateLibraryCourses();
