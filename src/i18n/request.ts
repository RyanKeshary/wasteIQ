import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
 
export default getRequestConfig(async ({requestLocale}) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  console.log("i18n/request.ts - incoming locale:", locale);
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !routing.locales.includes(locale as any)) {
    console.log("i18n/request.ts - locale invalid, calling notFound()");
    notFound();
  }
 
  try {
    const messages = (await import(`../../messages/${locale}.json`)).default;
    return {
      locale,
      messages
    };
  } catch (error) {
    console.error("i18n/request.ts - error loading messages:", error);
    notFound();
  }
});
