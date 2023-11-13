/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRouter } from 'next/router';

export default function useSetPage() {
  const router = useRouter();

  const getPage = (): number => {
    if (!router.query.page) {
      return 1;
    }

    return Array.isArray(router.query.page)
      ? parseInt(router.query.page[0], 10)
      : parseInt(router.query.page, 10);
  };

  const setPage = (page: number) => {
    if (page === 1) {
      resetPage();
      return;
    }

    router.replace(
      {
        pathname: router.pathname,
        query: { ...router.query, page: page },
      },
      undefined,
      { shallow: true }
    );
  };

  const resetPage = () => {
    const { page, ...query } = router.query;

    router.replace(
      {
        pathname: router.pathname,
        query: query,
      },
      undefined,
      { shallow: true }
    );
  };

  return {
    getPage,
    setPage,
    resetPage,
  };
}
