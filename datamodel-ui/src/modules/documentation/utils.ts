import { translateLinkPlaceholder } from '@app/common/utils/translation-helpers';
import { TFunction } from 'i18next';

export function getRows(data: string): string[] {
  return data.split('\n');
}

export function getCurrentRowNumber(data: string, position: number): number {
  return data.substring(0, position).split('\n').length;
}

export function getAddNewLine(data: string, position: number): boolean {
  const rows = getRows(data);
  const currRowNmb = getCurrentRowNumber(data, position);
  return rows[currRowNmb] && rows[currRowNmb].length > 0 ? true : false;
}

export function getSpecialCharacters(
  key: string,
  addNewLine: boolean,
  t: TFunction,
  selectionData?: string
): [string, string] {
  switch (key) {
    case 'bold':
      return ['**', '**'];
    case 'italic':
      return ['*', '*'];
    case 'quote':
      return ['> ', ''];
    case 'listBulleted':
      return [addNewLine ? '\n- ' : '- ', ''];
    case 'listNumbered':
      return [addNewLine ? '\n1. ' : '1. ', ''];
    case 'link':
      return [
        `[${selectionData ?? translateLinkPlaceholder('link', t)}](https://)`,
        '',
      ];
    case 'image':
      return [
        `![${
          selectionData ?? translateLinkPlaceholder('image', t)
        } width:200px height:200px](https://)`,
        '',
      ];
    default:
      return ['', ''];
  }
}

export function injectSpecialCharacters(
  data: string,
  selection: {
    start: number;
    end: number;
  },
  elem: [string, string],
  removeInitial?: boolean
): string {
  if (removeInitial) {
    return `${data.slice(0, selection.start)}${elem[0]}${data.slice(
      selection.end
    )}${elem[1]}`;
  }

  return `${data.slice(0, selection.start)}${elem[0]}${data.slice(
    selection.start,
    selection.end
  )}${elem[1]}${data.slice(selection.end)}`;
}

export function previousCharIsNewLine(data: string, position: number): boolean {
  return data[position - 1] === '\n';
}

export function injectNewLine(data: string[], position: number): string {
  return `${data.slice(0, position - 1).join('\n')}\n\n${data
    .slice(position - 1)
    .join('\n')}`;
}

export function getLastValue(data: string): number {
  return Math.max(parseInt(data.match(/\d+/)?.[0] ?? '0')) + 1;
}

export function injectNewListRow(
  rows: string[],
  currRowNmb: number,
  listStart: string
): string {
  return `${rows.slice(0, currRowNmb).join('\n')}\n${listStart} ${
    currRowNmb !== rows.length ? '\n' : ''
  }${rows.slice(currRowNmb).join('\n')}`;
}
