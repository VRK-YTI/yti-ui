import { TerminologySearchResult } from '@app/common/interfaces/terminology.interface';
import { GetServerSideProps } from 'next';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const Sitemap = () => {};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const terminologiesData: TerminologySearchResult = await fetch(
    `${process.env.TERMINOLOGY_API_URL}/api/v1/frontend/searchTerminology`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        query: '',
        statuses: [],
        groups: [],
        searchConcepts: true,
        prefLang: 'fi',
        pageSize: 10000,
        pageFrom: 0,
      }),
    }
  ).then((data) => data.json());

  const URI = 'https://sanastot.suomi.fi';

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${URI}</loc>
      </url>
      ${terminologiesData.terminologies
        ?.map(
          (t) =>
            `<url>
          <loc>${URI}/terminology/${t.id}</loc>
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
