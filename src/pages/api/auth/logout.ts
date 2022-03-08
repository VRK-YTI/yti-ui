import withSession from '../../../common/utils/session';

export default withSession(async (req, res) => {
  const target = (req.query['target'] as string) ?? '/';

  // invalidate cookie
  res.setHeader(
    'Set-Cookie',
    'JSESSIONID=deleted; path=/terminology-api; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  );

  req.session.destroy();
  res.redirect(target);
});
