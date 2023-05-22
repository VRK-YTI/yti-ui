import { useEffect, useState } from 'react';
import ClassRestrictionModal from '../class-restriction-modal';
import ResourcePicker from '../resource-picker-modal';
import { InternalClass } from '@app/common/interfaces/internal-class.interface';

export default function ApplicationProfileFlow({
  visible,
  selectedNodeShape,
  handleFollowUp,
}: {
  visible: boolean;
  selectedNodeShape: InternalClass;
  handleFollowUp: (
    value?: InternalClass,
    associations?: {
      identifier: string;
      label: { [key: string]: string };
      modelId: string;
      uri: string;
    }[],
    attributes?: {
      identifier: string;
      label: { [key: string]: string };
      modelId: string;
      uri: string;
    }[]
  ) => void;
}) {
  const [restrictionVisible, setRestrictionVisible] = useState(false);
  const [resourcePickerVisible, setResourcePickerVisible] = useState(false);

  useEffect(() => {
    if (!resourcePickerVisible) {
      setRestrictionVisible(visible);
    }
  }, [visible, resourcePickerVisible]);

  const handleClassRestrictionFollowUp = (createNew?: boolean) => {
    setRestrictionVisible(false);

    if (createNew) {
      setResourcePickerVisible(true);
      return;
    }

    setRestrictionVisible(false);
    setResourcePickerVisible(false);
    handleFollowUp(selectedNodeShape);
  };

  const handleResourcePickerFollowUp = (value?: {
    associations: {
      identifier: string;
      label: { [key: string]: string };
      modelId: string;
      uri: string;
    }[];
    attributes: {
      identifier: string;
      label: { [key: string]: string };
      modelId: string;
      uri: string;
    }[];
  }) => {
    setResourcePickerVisible(false);
    setRestrictionVisible(false);

    if (!value) {
      handleFollowUp();
      return;
    }

    handleFollowUp(selectedNodeShape, value.associations, value.attributes);
  };

  return (
    <>
      <ClassRestrictionModal
        hide={() => handleClassRestrictionFollowUp()}
        visible={restrictionVisible}
        handleFollowUp={(value) => handleClassRestrictionFollowUp(value)}
      />

      <ResourcePicker
        visible={resourcePickerVisible}
        selectedNodeShape={{
          modelId: selectedNodeShape?.isDefinedBy.split('/').pop() ?? '',
          classId: selectedNodeShape?.identifier ?? '',
        }}
        handleFollowUp={(value?: {
          associations: {
            identifier: string;
            label: { [key: string]: string };
            modelId: string;
            uri: string;
          }[];
          attributes: {
            identifier: string;
            label: { [key: string]: string };
            modelId: string;
            uri: string;
          }[];
        }) => handleResourcePickerFollowUp(value)}
      />
    </>
  );
}
