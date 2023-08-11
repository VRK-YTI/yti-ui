export function pathForModelType(isApplicationProfile?: boolean) {
  return isApplicationProfile ? 'profile/' : 'library/';
}
