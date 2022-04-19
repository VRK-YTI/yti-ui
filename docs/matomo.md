# Configuring Matomo Integration

## Development

By default, Matomo is disabled in development. If you need to enable it, just
add the following lines to `.env.local` and restart Next.js. These settings
are the same as in development servers.

Be careful not to typo any of these variables. Production site is still
protected so you can't corrupt its analytics accidentally.

```env
# Matomo settings
NEXT_PUBLIC_MATOMO_ENABLED=true
NEXT_PUBLIC_MATOMO_URL=https://suomi.matomo.cloud
NEXT_PUBLIC_MATOMO_SITE_ID=25
```

## Servers

Add the following environment variables to the server config. Pick the values
from site's settings in Matomo.

| Name                         | Value                        | Notes                                                                     |
| ---------------------------- | ---------------------------- | ------------------------------------------------------------------------- |
| `NEXT_PUBLIC_MATOMO_ENABLED` | `true`                       | Value must be `true`, not `1` etc.                                        |
| `NEXT_PUBLIC_MATOMO_URL`     | `https://suomi.matomo.cloud` | Check this from Matomo site settings. This must be without leading slash. |
| `NEXT_PUBLIC_MATOMO_SITE_ID` | integer                      | Check this from Matomo site settings.                                     |
