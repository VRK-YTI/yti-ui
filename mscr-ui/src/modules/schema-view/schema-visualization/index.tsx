import SchemaInfo from '@app/common/components/schema-info';
import {useTranslation} from 'next-i18next';
import {Format, formatsAvailableForCrosswalkCreation,} from '@app/common/interfaces/format.interface';
import {SchemaVisualizationContainer} from '@app/modules/schema-view/schema-visualization/schema-visualization.styles';
import SchemaAndCrosswalkActionMenu from "@app/common/components/schema-and-crosswalk-actionmenu";
import {SchemaWithVersionInfo} from "@app/common/interfaces/schema.interface";
import {CrosswalkWithVersionInfo} from "@app/common/interfaces/crosswalk.interface";
import {ActionMenuTypes} from "@app/common/interfaces/search.interface";
import {ActionMenuWrapper} from "@app/modules/crosswalk-editor/crosswalk-editor.styles";

export default function SchemaVisualization({
                                              pid,
                                              format,
                                              hasEditRights,
                                              metadata,
                                              refetchMetadata,
                                            }: {
  pid: string;
  format: Format;
  hasEditRights? : boolean;
  metadata: SchemaWithVersionInfo | CrosswalkWithVersionInfo;
  refetchMetadata: () => void;
}) {
  const {t} = useTranslation('common');
  const filterLabel = t('schema-tree.search-schema');
  const visualizationAvailable =
    formatsAvailableForCrosswalkCreation.includes(format);
  if (visualizationAvailable) {
    return (
      <>
        <div className='row'>
        <div className='col-10'>

          <SchemaInfo caption={filterLabel} schemaUrn={pid}/>
        </div>
        <div className='col-2 d-flex justify-content-end flex-row pe-3 pb-2'>
          {!hasEditRights && (
            <>
              <SchemaAndCrosswalkActionMenu buttonCallbackFunction={null} isMappingsEditModeActive
                                            metadata={metadata}
                                            refetchMetadata={refetchMetadata}
                                            type={ActionMenuTypes.Schema}></SchemaAndCrosswalkActionMenu>
            </>
          )}
        </div>
        </div>
</>

    );
  } else {
    return (
      <>
        <h2>{t('schema-tree.error-heading')}</h2>
        <p>{t('schema-tree.error-info')}</p>
      </>
    );
  }
}
