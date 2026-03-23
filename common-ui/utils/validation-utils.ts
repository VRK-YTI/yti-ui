// Validator function for prefixes/identifiers. Based on the PREFIX_REGEX in ValidationConstants in common-backend
export const isValidIdentifier = (id: string | null | undefined): boolean => {
  if (!id) {
    return false;
  }
  const re = /^[a-z][a-z0-9_-]{1,31}$/;
  return re.test(id);
};
