import { useEffect, useState } from 'react';
import ClassRestrictionModal from '../class-restriction-modal';
import ResourcePicker from '../resource-picker-modal';
import {
  InternalClass,
  InternalClassInfo,
} from '@app/common/interfaces/internal-class.interface';
import { getPrefixFromURI } from '@app/common/utils/get-value';
import { SimpleResource } from '@app/common/interfaces/simple-resource.interface';

export default function ApplicationProfileFlow({
  visible,
  selectedNodeShape,
  handleFollowUp,
}: {
  visible: boolean;
  selectedNodeShape: {
    nodeShape: InternalClassInfo;
    isAppProfile?: boolean;
  };
  handleFollowUp: (data?: {
    value?: InternalClass;
    targetClass?: InternalClass;
    targetIsAppProfile?: boolean;
    associations?: SimpleResource[];
    attributes?: SimpleResource[];
  }) => void;
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

  const handleClassRestrictionFollowUp = (
    createNew?: boolean,
    classRestriction?: InternalClass
  ) => {
    setRestrictionVisible(false);

    if (createNew) {
      setResourcePickerVisible(true);
      return;
    }

    setRestrictionVisible(false);
    setResourcePickerVisible(false);
    handleFollowUp({
      value: selectedNodeShape.nodeShape,
      targetIsAppProfile: true,
      targetClass: classRestriction,
    });
  };

  const handleResourcePickerFollowUp = (value?: {
    associations: SimpleResource[];
    attributes: SimpleResource[];
  }) => {
    setResourcePickerVisible(false);
    setRestrictionVisible(false);

    if (!value) {
      handleFollowUp();
      return;
    }

    handleFollowUp({
      value: selectedNodeShape.nodeShape,
      associations: value.associations,
      attributes: value.attributes,
    });
  };

  return (
    <>
      {restrictionVisible && (
        <ClassRestrictionModal
          hide={() => handleClassRestrictionClose()}
          visible={restrictionVisible}
          selectedNodeShape={selectedNodeShape.nodeShape}
          handleFollowUp={(createNew, classRestriction) =>
            handleClassRestrictionFollowUp(createNew, classRestriction)
          }
        />
      )}

      {resourcePickerVisible && (
        <ResourcePicker
          visible={resourcePickerVisible}
          selectedNodeShape={{
            modelId:
              getPrefixFromURI(selectedNodeShape.nodeShape.namespace) ?? '',
            classId: selectedNodeShape.nodeShape.identifier ?? '',
            isAppProfile: selectedNodeShape.isAppProfile ?? false,
          }}
          handleFollowUp={(value?: {
            associations: SimpleResource[];
            attributes: SimpleResource[];
          }) => handleResourcePickerFollowUp(value)}
        />
      )}
    </>
  );
}
