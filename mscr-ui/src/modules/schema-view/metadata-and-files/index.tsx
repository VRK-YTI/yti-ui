import { SchemaWithVersionInfo } from '@app/common/interfaces/schema.interface';
import MetadataForm from '@app/modules/form/metadata-form';
import { Type } from '@app/common/interfaces/search.interface';
import HasPermission from '@app/common/utils/has-permission';
import MetadataFilesTable from '@app/common/components/metadata-files-table';

export default function MetadataAndFiles({
                                           schemaDetails,
                                           refetch,
                                         }: {
  schemaDetails: SchemaWithVersionInfo;
  refetch: () => void;
}) {
  const hasEditPermission = HasPermission({
    action: 'EDIT_CONTENT',
    owner: schemaDetails?.owner
  });
  const hasCopyPermission = HasPermission({action: 'MAKE_MSCR_COPY'});
  const schemaFiles = schemaDetails?.fileMetadata;

  return (
    <>
      <MetadataForm
        type={Type.Schema}
        metadata={schemaDetails}
        refetchMetadata={refetch}
        hasEditPermission={hasEditPermission}
        hasCopyPermission={hasCopyPermission}
      />
      <MetadataFilesTable
        filesRowInput={schemaFiles}
        pid={schemaDetails?.pid}
        canEdit={false}
      />
    </>
  );
}
