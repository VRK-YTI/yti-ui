import {
  ViewList,
  ViewListItem,
  setView as setReduxView,
} from '@app/common/components/model/model.slice';
import { useStoreDispatch } from '@app/store';
import { useRouter } from 'next/router';

export default function useSetView() {
  const router = useRouter();
  const dispatch = useStoreDispatch();

  const handleRouter = (
    key: keyof ViewList,
    subkey?: keyof ViewListItem,
    id?: string
  ) => {
    const modelId = router.query.slug && router.query.slug[0];

    if (!modelId) {
      return;
    }

    const query = {
      ...(router.query.lang && { lang: router.query.lang }),
      ...(router.query.ver && { ver: router.query.ver }),
    };

    if (key === 'info' || !subkey || subkey === 'list') {
      router.replace(
        {
          pathname: `${modelId}/${key}`,
          query: query,
        },
        undefined,
        { shallow: true }
      );
      return;
    }

    let type = '';

    switch (key) {
      case 'attributes':
        type = 'attribute';
        break;
      case 'associations':
        type = 'association';
        break;
      default:
        type = 'class';
    }

    router.replace(
      {
        pathname: `${modelId}/${type}/${id}`,
        query: query,
      },
      undefined,
      { shallow: true }
    );
  };

  const setView = (
    key: keyof ViewList,
    subkey?: keyof ViewListItem,
    id?: string
  ) => {
    dispatch(setReduxView(key, subkey));

    if (subkey === 'edit' || subkey === 'create') {
      return;
    }

    handleRouter(key, subkey, id);
  };

  return {
    setView,
  };
}
