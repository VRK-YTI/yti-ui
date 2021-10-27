
import Error from '../common/components/error/error';
import Layout from '../common/components/layout/layout';

export default function Custom404() {
  return <Layout error>
    <Error />
  </Layout>;
}
