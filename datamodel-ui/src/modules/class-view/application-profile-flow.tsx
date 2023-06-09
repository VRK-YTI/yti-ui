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
  selectedNodeShape: {
    nodeShape: InternalClass;
    isAppProfile?: boolean;
  };
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
    if (!selectedNodeShape.isAppProfile) {
      setRestrictionVisible(visible);
    }
  }, [visible, selectedNodeShape]);

  const handleClassRestrictionClose = () => {
    setRestrictionVisible(false);
  };

  const handleClassRestrictionFollowUp = (createNew?: boolean) => {
    setRestrictionVisible(false);

    if (createNew) {
      setResourcePickerVisible(true);
      return;
    }

    setRestrictionVisible(false);
    setResourcePickerVisible(false);
    handleFollowUp(selectedNodeShape.nodeShape);
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

    handleFollowUp(
      selectedNodeShape.nodeShape,
      value.associations,
      value.attributes
    );
  };

  return (
    <>
      {restrictionVisible && (
        <ClassRestrictionModal
          hide={() => handleClassRestrictionClose()}
          visible={restrictionVisible}
          selectedNodeShape={selectedNodeShape.nodeShape}
          handleFollowUp={(value) => handleClassRestrictionFollowUp(value)}
        />
      )}

      {resourcePickerVisible && (
        <ResourcePicker
          visible={resourcePickerVisible}
          selectedNodeShape={{
            modelId:
              selectedNodeShape.nodeShape.isDefinedBy.split('/').pop() ?? '',
            classId: selectedNodeShape.nodeShape.identifier ?? '',
            isAppProfile: selectedNodeShape.isAppProfile ?? false,
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
      )}
    </>
  );
}
