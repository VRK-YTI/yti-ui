export interface Identifier<T> {

  id: string;
  type: {
    id: T;
    graph: { id: string; }
  }
}
