import HasPermission from '@app/common/utils/has-permission';
import MetadataForm from '@app/modules/form/metadata-form';
import { Type } from '@app/common/interfaces/search.interface';
import { CrosswalkWithVersionInfo } from '@app/common/interfaces/crosswalk.interface';


export default function MetadataAndFiles(props: {
  crosswalkData: CrosswalkWithVersionInfo;
  refetch: () => void;
}) {
  const hasEditRights = HasPermission({ actions: ['EDIT_CROSSWALK_METADATA'] });


  return (
    <>
      <MetadataForm type={Type.Crosswalk} metadata={props.crosswalkData} refetchMetadata={props.refetch} hasEditPermission={hasEditRights} />
    </>
  );
}
