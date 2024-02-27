# Credentials

Users use their [eduuni](https://eduuni.fi) credentials to login to the service.

# Authorization

Authorization is based on roles (e.g. TERMINOLOGY_EDITOR) assigned to the users in particular organization. All permissions and available actions are handled in `<project-name>/src/common/utils/has-permission`.

Checking permissions in component:

```js
<>
  {
    HasPermission({
      actions: 'ACTION_NAME',
      targetOrganization: 'ORGANIZATIN_ID'
    }) &&
    <RestrictedComponent />
  }
</>
```

# Session management and login process

1. User requests endpoint `/api/auth/login`
2. User is redirected to Shibboleth, which checks user's session. If session is not valid, user is redirected to Eduuni login.
3. After login user is redirected to `/api/auth/callback`
4. Callback handler requests yti-terminology-api or yti-datamodel-api endpoint `/terminology-api|datamodel-api/api/v1/frontend/authenticated-user` to get authenticated user and JSESSIONID cookie
5. If user is found, login information is stored to [NextIronSession](https://www.npmjs.com/package/next-iron-session), which is stateless session utility for NextJS
6. JSESSIONID is sent to the client and stored also to iron session. In SSR it have to manually add to each backend reaquest

For NextIronSession SECRET_COOKIE_PASSWORD environment variable (at least 32 characters) have to be set. For example:

```
# .env.local
SECRET_COOKIE_PASSWORD=6d63f5c34eed82f179d45906095dcdf
```

# Impersonate users

In [yti-compose](), there is a script to add fake users to the local database. Make sure that fake login is allowed in `config/yti-terminology-api.yaml`
