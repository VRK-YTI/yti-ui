declare interface Options {
  stripListLeaders?: boolean;
  gfm?: boolean;
}

declare function removeMd(markdown: string, options?: Options): string;

declare namespace removeMd {}

export = removeMd;
