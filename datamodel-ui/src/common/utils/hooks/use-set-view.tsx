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

  const handleRouter = (key: keyof ViewList, subkey?: keyof ViewListItem) => {
    const modelId = router.query.slug && router.query.slug[0];

    if (!modelId) {
      return;
    }

    router.replace({
      pathname: `${modelId}/${key}`,
      query: router.query.lang && { lang: router.query.lang },
    });
  };

  const setView = (key: keyof ViewList, subkey?: keyof ViewListItem) => {
    dispatch(setReduxView(key, subkey));

    handleRouter(key, subkey);
  };

  return {
    setView,
  };
}
