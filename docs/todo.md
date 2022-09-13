# Thing to do later

## Enable Swedish

The Swedish language is disabled from the UI at the moment. That's because
the Swedish UI will be broken until the texts have been translated.

Once texts have been translated, enable Swedish by applying the following patch:

```patch
diff --git a/next-i18next.config.js b/next-i18next.config.js
index 413921fe..62362153 100644
--- a/next-i18next.config.js
+++ b/next-i18next.config.js
@@ -1,7 +1,7 @@
 module.exports = {
   i18n: {
     defaultLocale: 'fi',
-    locales: ['fi', 'en' /* 'sv' */],
+    locales: ['fi', 'en', 'sv'],
     localeDetection: false,
   },
 };
diff --git a/src/common/components/locale-chooser/use-locales.ts b/src/common/components/locale-chooser/use-locales.ts
index 02f07e96..560b092a 100644
--- a/src/common/components/locale-chooser/use-locales.ts
+++ b/src/common/components/locale-chooser/use-locales.ts
@@ -16,13 +16,13 @@ export default function useLocales(): UseLocalesResult {
   const router = useRouter();
   const currentLocale = router.locale?.toLowerCase() ?? 'fi';

-  if (!['fi', /*'sv',*/ 'en'].includes(currentLocale)) {
+  if (!['fi', 'sv', 'en'].includes(currentLocale)) {
     console.warn(`Unsupported locale: ${currentLocale}`);
   }

   const locales: { locale: Locale; label: string }[] = [
     { locale: 'fi', label: 'Suomeksi (FI)' },
-    // { locale: 'sv', label: 'På svenska (SV)' },
+    { locale: 'sv', label: 'På svenska (SV)' },
     { locale: 'en', label: 'In English (EN)' },
   ];
```
