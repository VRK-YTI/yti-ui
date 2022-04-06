import {
  DownloadIndicator,
  DownloadIndicatorWrapper,
} from './new-terminology.styles';

export default function FileUpload() {
  return (
    <DownloadIndicatorWrapper>
      <DownloadIndicator startFrame={0} />
      <DownloadIndicator startFrame={200} />
      <DownloadIndicator startFrame={400} />
    </DownloadIndicatorWrapper>
  );
}
