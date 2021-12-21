let asPath = '/search';

const useRouter = () => ({
  replace: () => new Promise(() => {}),
  asPath: asPath,
  push: (str: string) => asPath = str,
});

export { useRouter };
