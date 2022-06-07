# Configuring Matomo Integration

## Development

By default, Matomo is disabled in development. If you need to enable it,
uncheck "Only track visits and actions when the action URL starts with one of
the above URLs." checkbox from site settings in Matomo and add the following
lines to `.env.local` and restart Next.js.

Be careful not to typo any of these variables. Production site is still
protected so you can't corrupt its analytics accidentally.

```env
# Matomo settings
MATOMO_ENABLED=true
MATOMO_URL=https://suomi.matomo.cloud
MATOMO_SITE_ID=25
```

## Servers

Add the following environment variables to the server config. Pick the values
from site's settings in Matomo.

| Name             | Value                        | Notes                                                                     |
| ---------------- | ---------------------------- | ------------------------------------------------------------------------- |
| `MATOMO_ENABLED` | `true`                       | Value must be `true`, not `1` etc.                                        |
| `MATOMO_URL`     | `https://suomi.matomo.cloud` | Check this from Matomo site settings. This must be without leading slash. |
| `MATOMO_SITE_ID` | integer                      | Check this from Matomo site settings.                                     |
