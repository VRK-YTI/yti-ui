import FrontPage from '../front-page';
import { useGetPersonalContentQuery } from '@app/common/components/personal/personal.slice';
import { Type } from '@app/common/interfaces/search.interface';

export default function PersonalWorkspace({ contentType } : {contentType: Type}) {
  const { data, isLoading } =
    useGetPersonalContentQuery(contentType);

  const items = data?.hits.hits.map((result) => {
    const info = result._source;
    return {
      label: info.label,
      namespace: info.namespace,
      state: info.state,
      numberOfRevisions: info.numberOfRevisions,
      pid: info.id,
    };
  });
  console.log('items: ', items);
  const keys = ['label', 'namespace', 'state', 'numberOfRevisions', 'pid'];

  return <FrontPage></FrontPage>;
}
