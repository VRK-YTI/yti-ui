import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {styled} from '@mui/material';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import AddLinkIcon from '@mui/icons-material/AddLink';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import {Button as Sbutton, Textarea, TextInput} from 'suomifi-ui-components';
import Button from '@mui/material/Button';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CheckIcon from '@mui/icons-material/Check';
import EditRoundedIcon from '@mui/icons-material/EditRounded';


import {
    CrosswalkConnection,
    CrosswalkConnectionNew,
    RenderTreeOld
} from '@app/common/interfaces/crosswalk-connection.interface';
import {InfoIcon} from '@app/common/components/shared-icons';

const crosswalkConnectionInit = {
    source: '',
    target: '',
    sourceTitle: '',
    targetTitle: '',
    type: '',
    notes: '',
    title: '',
};

const StyledTableCell = styled(TableCell)(({theme}) => ({}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
    '&:nth-of-type(odd)': {
        //backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

function Row(props: { row: CrosswalkConnectionNew; viewOnlyMode: boolean; isEditModeActive: boolean; cbf: any }) {
    const {row} = props;
    const [open, setOpen] = React.useState(row.isSelected);
    const [changedNotes, setChangedNotes] = React.useState<string>('');
    const addNotes = 'addNotes';

    return (
        <React.Fragment>
            <StyledTableRow className='accordion-row'>
                <StyledTableCell className='col-5 ps-4'>
                    <Button className='ms-2 py-0' style={{textTransform: 'none'}}
                            title='Select linked node from source tree'
                            onClick={(e) => {
                                props.cbf.performAccordionAction(row, 'selectFromSourceTree');
                                e.stopPropagation();
                            }}>{row.source.name}</Button>
                </StyledTableCell>

                {/*                <StyledTableCell className='fw-bold' style={{width: '10%'}}>
                    <IconButton onClick={(e) => {props.cbf.performAccordionAction(row, 'remove'); e.stopPropagation();}} aria-label="unlink" color="primary" title='Unlink nodes'
                                size="large">
                    <LinkOffIcon/>
                    </IconButton>
                </StyledTableCell>*/}

                <StyledTableCell className='col-4 ps-4'>
                    <Button className='me-2 py-0' style={{textTransform: 'none'}}
                            title='Select linked node from target tree'
                            onClick={(e) => {
                                props.cbf.performAccordionAction(row, 'selectFromTargetTree');
                                e.stopPropagation();
                            }}>{row.target.name}</Button>
                </StyledTableCell>

                <StyledTableCell className='col-1'>
                    {/*<IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={(e) => {
                            props.cbf.performAccordionAction(row, 'openJointDetails')
                        }}
                    >
                        {row.isSelected ? <EditRoundedIcon className='selection-active'/> : <EditRoundedIcon/>}
                    </IconButton>*/}
                </StyledTableCell>

                <StyledTableCell className='col-2 fw-bold d-flex justify-content-end'>
                    <IconButton
                        hidden={props.viewOnlyMode}
                        aria-label="expand row"
                        size="small"
                        onClick={(e) => {
                            setOpen(!open);
                            e.stopPropagation();
                        }}
                    >
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </StyledTableCell>
            </StyledTableRow>

            <StyledTableRow>
                <TableCell className='accordion-fold-content'>
                    <Collapse in={open && !props.viewOnlyMode} timeout="auto" unmountOnExit>
                        <div className='row'>
                            <div className='col-10'>
                                {/*                                <Box sx={{margin: 1}}>
                                    <div className='fw-bold mt-3 mb-2' style={{fontSize: '0.9em'}}>Mapping type: <span
                                        className='fw-normal'>exact match</span></div>
                                    <br/>
                                </Box>*/}
                            </div>
                            <div className='col-2 mt-4 d-flex flex-column action-buttons'>
                                <Sbutton
                                    hidden={!props.isEditModeActive}
                                    onClick={(e) => {
                                        props.cbf.performAccordionAction(row, 'openJointDetails');
                                    }}>Edit</Sbutton>
                                <Sbutton className='mt-2'
                                         hidden={!props.isEditModeActive}
                                         onClick={(e) => {
                                             props.cbf.performAccordionAction(row, 'removeJoint');
                                         }}>Delete</Sbutton>
                            </div>
                        </div>
                    </Collapse>
                </TableCell>
            </StyledTableRow>
        </React.Fragment>
    );
}

let rows = [{...crosswalkConnectionInit}];

function createCrosswalkAccorionData(crosswalkInput: any) {
    rows = [{...crosswalkInput}];
}

export default function JointListingAccordion(props: any) {
    if (props.crosswalkJoints.length > 0) {
        createCrosswalkAccorionData(props.crosswalkJoints);
        // return LinkedNodesTable(props.crosswalkJoints);
    }

    const crosswalkJointsInput = props.crosswalkJoints;

    return (<>
            <TableContainer component={Paper} className='gx-0'>
                <Table aria-label="collapsible table w-100">
                    <TableHead>
                        <TableRow className='accordion-row row'>
                            <StyledTableCell className='col-5'><span
                                className='fw-bold ps-4'>Source</span></StyledTableCell>
                            <StyledTableCell className='col-4'><span
                                className='fw-bold ps-4'>Target</span></StyledTableCell>
                            <StyledTableCell className='col-1'></StyledTableCell>
                            <StyledTableCell className='col-2'></StyledTableCell>
                        </TableRow>
                    </TableHead>

                    {crosswalkJointsInput?.length > 0 &&
                        <TableBody>
                            {crosswalkJointsInput.map((row: CrosswalkConnectionNew) => {
                                return (<Row key={row.id} row={row} viewOnlyMode={props.viewOnlyMode}
                                             isEditModeActive={props.isEditModeActive} cbf={props}/>);
                            })}
                        </TableBody>
                    }
                    {crosswalkJointsInput?.length < 1 &&
                        <TableBody>
                            <TableRow className=''>
                                <div className='empty-mappings-table'><span className='info-icon'><InfoIcon></InfoIcon></span>No
                                    elements have been mapped yet. Mappings will appear in this table.
                                </div>
                            </TableRow>
                        </TableBody>
                    }
                </Table>
            </TableContainer>
        </>
    );
}
