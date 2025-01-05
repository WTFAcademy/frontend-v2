import { useRouter, usePathname } from 'next/navigation';

export const useLanguage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentLang = pathname?.split('/')[1] || 'zh';

  const changeLanguage = (locale: 'zh' | 'en') => {
    // 1. 设置 cookie
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`
    
    // 2. 构建新的 URL 路径
    const newPathname = pathname.replace(`/${currentLang}`, `/${locale}`)
    
    // 3. 使用 router.replace 而不是 push 来避免在历史记录中添加新条目
    router.replace(newPathname)
    
    // 4. 强制刷新页面以清除缓存数据
    router.refresh()
  }

  return {
    language: currentLang,
    changeLanguage
  };
};