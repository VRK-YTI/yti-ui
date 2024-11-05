import { AxiosBaseQueryError } from 'yti-common-ui/interfaces/axios-base-query.interface';
import { SerializedError } from '@reduxjs/toolkit';
import { useTranslation } from 'next-i18next';

export interface ExcelError {
  code: string;
  data: ExcelErrorDetails;
}

export interface ExcelErrorDetails {
  message: string;
  key: string;
  sheet: string;
  rowNumber: number;
  column: string;
}

type ExcelErrorDetailBlockProps = {
  errorInfo: ExcelError;
};

export const ExcelErrorDetailBlock = ({
  errorInfo,
}: ExcelErrorDetailBlockProps) => {
  const { t } = useTranslation('admin');

  if (!errorInfo.data) {
    return <></>;
  }

  return (
    <>
      <ul>
        {errorInfo.data?.sheet && (
          <li>{`${t('excel-sheet')}: ${errorInfo.data?.sheet}`}</li>
        )}
        {errorInfo.data?.rowNumber != undefined && (
          <li>{`${t('excel-row')}: ${errorInfo.data?.rowNumber}`}</li>
        )}
        {errorInfo.data?.column && (
          <li>{`${t('excel-column')}: ${errorInfo.data?.column}`}</li>
        )}
      </ul>
    </>
  );
};

export const createErrorMessage = (
  error: AxiosBaseQueryError | SerializedError | undefined
) => {
  if (!error) {
    return {
      code: 'UNKNOWN_ERROR',
      data: { message: 'Unknown error' },
    } as ExcelError;
  }

  // AxiosBaseQueryError
  if ('status' in error) {
    return {
      code: error.status,
      data: error.data as ExcelErrorDetails,
    } as ExcelError;
  }
  // SerializedError
  if ('code' in error) {
    return {
      code: error.code ?? 'UNKNOWN_ERROR',
      data: {
        message:
          error.message ?? error.code
            ? `Error code ${error.code}`
            : 'Unknown error',
      },
    } as ExcelError;
  }
};
