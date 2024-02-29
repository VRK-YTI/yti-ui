export enum State {
  Draft = 'DRAFT',
  Published = 'PUBLISHED',
  Invalid = 'INVALID',
  Deprecated = 'DEPRECATED',
  Removed = 'REMOVED',
}

export const possibleStatesAtRegistration: State[] = [
  State.Draft, State.Published, State.Deprecated
];
