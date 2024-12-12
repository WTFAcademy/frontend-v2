import 'server-only'

type Locale = 'en' | 'zh'

const dictionaries = {
  en: () => import('@/public/dictionaries/en.json').then((module) => module.default),
  zh: () => import('@/public/dictionaries/zh.json').then((module) => module.default),
}

export const getDictionary = async (locale: string | null = 'zh') => 
  dictionaries[(['zh', 'en'].includes(locale ?? 'zh') ? locale : 'zh') as Locale]()
