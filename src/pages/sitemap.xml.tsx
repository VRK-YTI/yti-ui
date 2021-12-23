import React from 'react';

// This type isn't correctly recognized.
import { TerminologySearchResult } from '../common/interfaces/terminology.interface';

/*
  Currently static pages and terminologies are added to sitemap.

  For the future: Would be a good idea to add timestamp of last update to every
  terminology. Check frequency would be good to add to them possibly to help scraping.
*/

const Sitemap = () => { };

export const getServerSideProps = async ({ res }) => {

  const terminologies = await fetch('http://localhost:3000/terminology-api/api/v1/frontend/searchTerminology', {
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
  }).then(data => data.json());

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://localhost:3000</loc>
      </url>
      <url>
        <loc>https://localhost:3000/search</loc>
      </url>
      <url>
        <loc>https://localhost:3000/404</loc>
      </url>
      ${terminologies.terminologies.map((t: TerminologySearchResult['terminologies']) => (
    `<url>
          <loc>http://localhost:3000/terminology/${t.id}</loc>
        </url>`
  )).join('')}
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
