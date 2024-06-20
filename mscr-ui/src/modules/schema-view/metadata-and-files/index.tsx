import { SchemaWithVersionInfo } from '@app/common/interfaces/schema.interface';
import MetadataForm from '@app/modules/form/metadata-form';
import { Type } from '@app/common/interfaces/search.interface';
import MetadataFilesTable from '@app/common/components/metadata-files-table';

export default function MetadataAndFiles({
  schemaDetails,
  refetch,
  isMscrCopyAvailable,
  hasEditPermission
}: {
  schemaDetails: SchemaWithVersionInfo;
  refetch: () => void;
  hasEditPermission: boolean;
  isMscrCopyAvailable?: boolean;
}) {

  const schemaFiles = schemaDetails?.fileMetadata;

  return (
    <>
      <MetadataForm
        type={Type.Schema}
        metadata={schemaDetails}
        refetchMetadata={refetch}
        hasEditPermission={hasEditPermission}
        isMscrCopyAvailable={isMscrCopyAvailable}
      />
      <MetadataFilesTable
        filesRowInput={schemaFiles}
        pid={schemaDetails?.pid}
        canEdit={false}
      />
    </>
  );
}
