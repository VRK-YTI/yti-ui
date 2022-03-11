import { DownloadIndicator, DownloadIndicatorWrapper, ErrorIndicator, SuccessIndicator } from './new-terminology.styles';

export default function FileUpload() {

  return (
    <DownloadIndicatorWrapper>
      <DownloadIndicator startFrame={400}/>
      <DownloadIndicator startFrame={200}/>
      <DownloadIndicator startFrame={0}/>
      <ErrorIndicator icon='error' />
      <SuccessIndicator icon='check' />
    </DownloadIndicatorWrapper>
  );
}
