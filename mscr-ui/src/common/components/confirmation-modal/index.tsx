import { Button, ModalFooter, Paragraph, Text } from 'suomifi-ui-components';
import { useBreakpoints } from 'yti-common-ui/components/media-query';
import {
  ModalContentSmPadding,
  ModalStyled,
  ModalTitleH1,
} from 'yti-common-ui/components/login-modal/login-modal.styles';

export default function ConfirmModal(props: {
  heading: string;
  text1: string;
  text2?: string;
  actionText: string;
  cancelText: string;
  confirmAction: () => void;
  onClose: () => void;
}) {
  const { isSmall } = useBreakpoints();

  function performAction(isCloseAction: boolean) {
    if (!isCloseAction) {
      props.confirmAction();
    }
    props.onClose();
  }

  return (
    <>
      <ModalStyled
        appElementId="__next"
        visible={true}
        variant={isSmall ? 'smallScreen' : 'default'}
        onEscKeyDown={() => performAction(true)}
        scrollable={false}
      >
        <ModalContentSmPadding>
          <ModalTitleH1 as={'h1'}>{props.heading}</ModalTitleH1>
          <Paragraph>
            <Text>{props.text1}</Text>
          </Paragraph>
          <br />
          {props.text2 && (
            <>
              <Paragraph>
                <Text>{props.text2}</Text>
              </Paragraph>
              <br />
            </>
          )}
        </ModalContentSmPadding>

        <ModalFooter>
          <Button onClick={(e) => performAction(false)}>
            {props.actionText}
          </Button>
          <Button
            variant="secondaryNoBorder"
            onClick={() => performAction(true)}
            id="cancel-button"
          >
            {props.cancelText}
          </Button>
        </ModalFooter>
      </ModalStyled>
    </>
  );
}
