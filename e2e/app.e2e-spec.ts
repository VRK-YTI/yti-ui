import { IowTermedUiPage } from './app.po';

describe('iow-termed-ui App', function() {
  let page: IowTermedUiPage;

  beforeEach(() => {
    page = new IowTermedUiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
