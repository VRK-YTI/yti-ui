import HasPermission from '@app/common/utils/has-permission';
import MetadataForm from '@app/modules/form/metadata-form';
import { Type } from '@app/common/interfaces/search.interface';
import { CrosswalkWithVersionInfo } from '@app/common/interfaces/crosswalk.interface';
import MetadataFilesTable from '@app/common/components/metadata-files-table';


export default function MetadataAndFiles(props: {
  crosswalkData: CrosswalkWithVersionInfo;
  refetch: () => void;
}) {
  const hasEditRights = HasPermission({ actions: ['EDIT_CROSSWALK_METADATA'],owner:props.crosswalkData.owner});
  const hasFileRights = HasPermission({ actions: ['EDIT_CROSSWALK_FILES'],owner:props.crosswalkData.owner });

  return (
    <>
      <MetadataForm
        type={Type.Crosswalk}
        metadata={props.crosswalkData}
        refetchMetadata={props.refetch}
        hasEditPermission={hasEditRights}
      />
      <MetadataFilesTable
        filesRowInput={props.crosswalkData.fileMetadata}
        crosswalkData={props.crosswalkData}
        pid={props.crosswalkData.pid}
        canEdit={hasFileRights}
      />
    </>
  );
}
