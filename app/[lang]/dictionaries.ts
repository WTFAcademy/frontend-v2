import 'server-only'
 
const dictionaries = {
  en: () => import('@/public/dictionaries/en.json').then((module) => module.default),
  zh: () => import('@/public/dictionaries/zh.json').then((module) => module.default),
}
 
export const getDictionary = async (locale) => dictionaries[['zh', 'en'].includes(locale) ? locale : 'zh']()