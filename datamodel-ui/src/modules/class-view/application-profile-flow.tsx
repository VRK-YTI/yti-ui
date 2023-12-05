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
  selectedTargetClass,
  handleFollowUp,
}: {
  visible: boolean;
  selectedTargetClass: {
    targetClass: InternalClassInfo;
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
    if (!selectedTargetClass.isAppProfile) {
      setRestrictionVisible(visible);
    }
  }, [visible, selectedTargetClass]);

  const handleClassRestrictionFollowUp = (
    createNew?: boolean,
    existingNodeShape?: InternalClass
  ) => {
    setRestrictionVisible(false);

    if (createNew) {
      setResourcePickerVisible(true);
      return;
    }

    setRestrictionVisible(false);
    setResourcePickerVisible(false);
    handleFollowUp({
      value: existingNodeShape,
      targetIsAppProfile: true,
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
      value: selectedTargetClass.targetClass,
      associations: value.associations,
      attributes: value.attributes,
    });
  };

  return (
    <>
      {restrictionVisible && (
        <ClassRestrictionModal
          hide={() => setRestrictionVisible(false)}
          visible={restrictionVisible}
          selectedTargetClass={selectedTargetClass.targetClass}
          handleFollowUp={(createNew, classRestriction) =>
            handleClassRestrictionFollowUp(createNew, classRestriction)
          }
        />
      )}

      {resourcePickerVisible && (
        <ResourcePicker
          visible={resourcePickerVisible}
          selectedNodeShape={{
            modelId: getPrefixFromURI(
              selectedTargetClass.targetClass.namespace
            ),
            version: selectedTargetClass.targetClass.dataModelInfo.version,
            classId: selectedTargetClass.targetClass.identifier,
            isAppProfile: selectedTargetClass.isAppProfile ?? false,
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
