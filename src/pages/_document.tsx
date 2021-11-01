import Document from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import { ServerStyleSheets as MaterialUiServerStyleSheets } from '@material-ui/core/styles';
import flush from 'styled-jsx/server';

// https://github.com/msreekm/nextjs-material-ui-styled-components-boilerplate/blob/master/pages/_document.js
export default class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const sheet = new ServerStyleSheet();
    const materialUiSheets = new MaterialUiServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App: any) => (props: any) =>
            sheet.collectStyles(
              materialUiSheets.collect(<App {...props} />)
            ),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {materialUiSheets.getStyleElement()}
            {sheet.getStyleElement()}
            {flush() || null}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }
}
