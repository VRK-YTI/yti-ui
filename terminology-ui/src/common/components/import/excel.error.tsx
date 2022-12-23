import { AxiosBaseQueryError } from 'yti-common-ui/interfaces/axios-base-query.interface';
import { SerializedError } from '@reduxjs/toolkit';
import { useTranslation } from 'next-i18next';

export interface ExcelError {
  code: string;
  data: ExcelErrorDetails;
}

export interface ExcelErrorDetails {
  message: string;
  errorDetails?: {
    sheet: string;
    row: number;
    column: string;
  };
}

type ExcelErrorDetailBlockProps = {
  errorInfo: ExcelError;
};

export const ExcelErrorDetailBlock = ({
  errorInfo,
}: ExcelErrorDetailBlockProps) => {
  const { t } = useTranslation('admin');

  if (!errorInfo.data.errorDetails) {
    return <></>;
  }

  return (
    <>
      <ul>
        {errorInfo.data.errorDetails?.sheet && (
          <li>{`${t('excel-sheet')}: ${
            errorInfo.data.errorDetails?.sheet
          }`}</li>
        )}
        {errorInfo.data.errorDetails?.row != undefined && (
          <li>{`${t('excel-row')}: ${errorInfo.data.errorDetails?.row}`}</li>
        )}
        {errorInfo.data.errorDetails?.column && (
          <li>{`${t('excel-column')}: ${
            errorInfo.data.errorDetails?.column
          }`}</li>
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
