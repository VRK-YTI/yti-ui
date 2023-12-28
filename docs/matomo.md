# Configuring Matomo Integration

## Development

By default, Matomo is disabled in development. If you need to enable it, just
add the following lines to `.env.local` and restart Next.js. These settings
are the same as in development servers.

Be careful not to typo any of these variables. The production site is still
protected so you can't corrupt its analytics accidentally.

```env
# Matomo settings
MATOMO_ENABLED=true
MATOMO_URL=https://suomi.matomo.cloud
MATOMO_SITE_ID=<id>
```

## Servers

Add the following environment variables to the server config. Pick the values
from the site's settings in Matomo.

| Name             | Value                        | Notes                                                                       |
| ---------------- | ---------------------------- | --------------------------------------------------------------------------- |
| `MATOMO_ENABLED` | `true`                       | Value must be `true`, not `1` etc.                                          |
| `MATOMO_URL`     | `https://suomi.matomo.cloud` | Check this from Matomo site settings. This must be without a leading slash. |
| `MATOMO_SITE_ID` | integer                      | Check this from Matomo site settings.                                       |
