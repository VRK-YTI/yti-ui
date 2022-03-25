import withSession from '@app/common/utils/session';

export default withSession(async (req, res) => {
  // eventually we want to return to this path
  let target = req.query['target'] ?? '/';

  // but SSO should first return to auth callback
  target = '/api/auth/callback?target=' + target;

  const path = `/Shibboleth.sso/Login?target=${encodeURIComponent(target)}`;
  res.redirect(path);
});
