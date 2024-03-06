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
  // TODO: Editing -> Only edit with permission, we have util has-permission
  const hasEditPermission = HasPermission({
    actions: ['EDIT_SCHEMA_METADATA'],
  });
  const schemaFiles = schemaDetails?.fileMetadata;

  return (
    <>
      <MetadataForm
        type={Type.Schema}
        metadata={schemaDetails}
        refetchMetadata={refetch}
        hasEditPermission={hasEditPermission}
      />
      <MetadataFilesTable
        filesRowInput={schemaFiles}
        pid={schemaDetails?.pid}
        canEdit={false}
      />
    </>
  );
}
