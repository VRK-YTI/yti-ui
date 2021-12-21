export interface BaseEntity<T extends string> {
  id: string;
  code: string;
  uri: string;
  number: number;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;

  type: Type<T>;
  identifier: Identifier<T>;

  properties: {};
  references: {};
  referrers: {};
}

export interface GenericEntity<
  T extends string,
  P extends { [key: string]: Property[] },
  R1 extends { [key: string]: BaseEntity<string>[] },
  R2 extends { [key: string]: BaseEntity<string>[] }
> extends BaseEntity<T> {
  properties: P;
  references: R1;
  referrers: R2;
}

export interface Property {
  lang: string;
  value: string;
  regex: string;
}

export interface Identifier<T extends string> {
  id: string;
  type: Type<T>;
}

export interface Type<T extends string> {
  id: T;
  graph: {
    id: string;
  };
  uri: string;
}
