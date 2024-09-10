import {
  SearchResponse,
  TerminogyResponseObject,
} from '@app/common/interfaces/interfaces-v2';
import { GetServerSideProps } from 'next';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const Sitemap = () => {};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const terminologiesData: SearchResponse<TerminogyResponseObject> =
    await fetch(
      `${process.env.TERMINOLOGY_API_URL}/frontend/search-terminologies?pageSize=10000`,
      {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
      }
    ).then((data) => data.json());

  const URI = 'https://sanastot.suomi.fi';

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${URI}</loc>
      </url>
      ${terminologiesData.responseObjects
        ?.map(
          (t) =>
            `<url>
          <loc>${URI}/terminology/${t.prefix}</loc>
        </url>`
        )
        .join('')}
    </urlset>
  `;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap;
