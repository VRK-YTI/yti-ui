export default function toUri(uri: string): string {
  if (uri.length < 1) {
    return uri;
  }

  let validUri = uri.trim().toLowerCase();

  if (!validUri.startsWith('http://') && !validUri.startsWith('https://')) {
    validUri = 'https://' + validUri;
  }

  return validUri;
}
