export function getModelId(slug?: string | string[]): string | undefined {
  if (!slug) {
    return;
  }

  return Array.isArray(slug) ? slug[0] : slug;
}

export function getResourceInfo(slug?: string | string[]):
  | {
      type: string;
      id: string;
    }
  | undefined {
  if (!slug) {
    return;
  }

  return Array.isArray(slug) && slug.length > 1
    ? {
        type: slug[1],
        id: slug[2] ?? '',
      }
    : undefined;
}
