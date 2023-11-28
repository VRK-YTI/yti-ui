import { toPng } from 'html-to-image';
import { getRectOfNodes, getTransformForBounds, useReactFlow } from 'reactflow';
import { Button, IconDownload } from 'suomifi-ui-components';

function downloadImg(dataUrl: string, fileName: string) {
  const a = document.createElement('a');
  a.setAttribute('download', `${fileName}.png`);
  a.setAttribute('href', dataUrl);
  a.click();
}

export default function DownloadPicture({
  modelId,
  setRef,
}: {
  modelId: string;
  setRef: (value: HTMLButtonElement | null) => void;
}) {
  const { getNodes } = useReactFlow();

  const handleClick = () => {
    const el = document
      .getElementsByClassName('react-flow__renderer')
      .item(0) as HTMLElement;

    if (!el) {
      return;
    }

    const imgWidth = el.clientWidth;
    const imgHeight = el.clientHeight;
    const nodesBounds = getRectOfNodes(getNodes());
    const transform = getTransformForBounds(
      nodesBounds,
      imgWidth,
      imgHeight,
      0.5,
      2
    );

    toPng(el, {
      backgroundColor: 'white',
      width: imgWidth,
      height: imgHeight,
      style: {
        width: imgWidth.toString(),
        height: imgHeight.toString(),
        transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})})`,
      },
    }).then((dataUrl) => downloadImg(dataUrl, modelId));
  };

  return (
    <Button
      id="graph-tools_download-picture"
      icon={<IconDownload />}
      onClick={() => handleClick()}
      onMouseEnter={(ref) => setRef(ref.currentTarget)}
      onMouseLeave={() => setRef(null)}
    />
  );
}
