import {Button as Sbutton} from 'suomifi-ui-components';
import ConfirmModal from '@app/common/components/confirmation-modal';
import * as React from 'react';

export enum FooterTypes {
  'CROSSWALK_EDITOR',
  'CROSSWALK_METADATA',
  'SCHEMA_METADATA',
}

export default function FixedButtonFooter(props: { performFooterActionCallback?: any; footerType: FooterTypes; isEditModeActive: boolean; isPublished?: boolean}) {
  const [isEditModeActive, setEditModeActive] = React.useState<boolean>(false);
  const [isSaveConfirmModalOpen, setSaveConfirmModalOpen] = React.useState<boolean>(false);
  const [isPublishConfirmModalOpen, setPublishConfirmModalOpen] = React.useState<boolean>(false);

  function performFooterAction(action: string) {
    if (action === 'save' && props.performFooterActionCallback){
      setSaveConfirmModalOpen(false);
      props.performFooterActionCallback('save');
      setEditModeActive(false);
    }
    if (action === 'publish' && props.performFooterActionCallback){
      setPublishConfirmModalOpen(false);
      props.performFooterActionCallback('publish');
      setEditModeActive(false);
    }
    if (action === 'finishEditing') {
      props.performFooterActionCallback('setEditModeInactive');
      setEditModeActive(false);
    }
    if (action === 'setEditModeActive') {
      props.performFooterActionCallback('setEditModeActive');
      setEditModeActive(true);
    }
    if (action === 'cancel') {
      props.performFooterActionCallback('cancel');
      setEditModeActive(false);
    }
    if (action === 'close') {
      setSaveConfirmModalOpen(false);
      setPublishConfirmModalOpen(false);
    }
  }

  return(<>
  <div className='fixed-footer'>
    <div className='row'>
      <div className='col-8'>
      </div>

          <div className='col-4 d-flex flex-row justify-content-end'>
            {isEditModeActive && !props.isPublished &&
                <Sbutton onClick={() => {
                  setPublishConfirmModalOpen(true);
                }}>Publish</Sbutton>
            }

            {/* Save is always available for metadata regardless is the crosswalk published or not */}
            {isEditModeActive && ((props.footerType === FooterTypes.SCHEMA_METADATA) || (props.footerType === FooterTypes.CROSSWALK_METADATA)) &&
                <Sbutton hidden={!isEditModeActive || props.isPublished} onClick={() => {
                  setSaveConfirmModalOpen(true);
                }}>Save</Sbutton>
            }

            {(isEditModeActive && props.footerType === FooterTypes.CROSSWALK_EDITOR) && !props.isPublished &&
                <Sbutton variant='secondary' onClick={() => {
                  performFooterAction('finishEditing');
                }}>Finish editing</Sbutton>
            }
            {((props.footerType === FooterTypes.CROSSWALK_EDITOR && !isEditModeActive && !props.isPublished) || (props.footerType === FooterTypes.CROSSWALK_METADATA && !isEditModeActive)) &&
                <Sbutton onClick={() => {
                  performFooterAction('setEditModeActive');
                }}>Edit</Sbutton>
            }
            {isEditModeActive && (props.footerType === FooterTypes.CROSSWALK_METADATA) &&
                <Sbutton variant='secondary' onClick={() => {
                  performFooterAction('cancel');
                }}>Cancel</Sbutton>
            }
          </div>

    </div>
  </div>
      <ConfirmModal isVisible={isSaveConfirmModalOpen} actionName={'save'} actionText={'Save'} cancelText={'Cancel'} performConfirmModalAction={performFooterAction} heading={'Confirmation'} text1={'Do you want to save changes.'}/>
      <ConfirmModal isVisible={isPublishConfirmModalOpen} actionName={'publish'} actionText={'Publish'} cancelText={'Cancel'} performConfirmModalAction={performFooterAction} heading={'Confirmation'} text1={'Do you want to publish the crosswalk.'} text2={'After publishing, you cannot make changes to mappings in crosswalk.'}/>
    </>
)};