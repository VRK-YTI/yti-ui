export function getEnvParam(uri: string, v1?: boolean) {
  if (
    (uri.indexOf('uri.suomi.fi') === -1 &&
      uri.indexOf('iri.suomi.fi') === -1) ||
    typeof window === 'undefined'
  ) {
    return '';
  }

  const hostname = window.location.hostname;
  if (hostname.indexOf('dev') > -1) {
    return v1 ? '?env=awsdev' : '?env=awsdev_v2';
  } else if (hostname.indexOf('test') > -1) {
    return v1 ? '?env=awstest' : '?env=awstest_v2';
  } else if (hostname.indexOf('local') > -1) {
    return '?env=local';
  } else if (hostname.indexOf('beta') > -1) {
    return v1 ? '' : '?env=awsbeta_v2';
  }
  return '';
}
