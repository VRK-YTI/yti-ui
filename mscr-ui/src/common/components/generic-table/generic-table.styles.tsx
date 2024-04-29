import styled from 'styled-components';
import { TableCell, TableHead, TableRow } from '@mui/material';

export const StyledTableCell = styled(TableCell)(({ theme }) => ({}));

export const StyledTableHead = styled(TableHead)(({ theme }) => ({
  background: '#fff',
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: '#fff',
  td: { border: 0 },
  a: {
    color: '#3D6DB6',
    textDecoration: 'none',
  },
  '&:nth-of-type(odd)': {
    backgroundColor: '#EAF2FA',
  },
  '&:first-of-type th, &:first-of-type thead': {
    fontWeight: 700,
    borderBottom: '3px solid #3D6DB6',
    backgroundColor: '#fff',
  },
  '&.MuiTableRow-hover:hover': {
    opacity: '1',
  },
  '&&.Mui-selected': {
    backgroundColor: theme.suomifi.colors.successSecondary,
  }
}));
