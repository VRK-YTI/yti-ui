import Button from '@mui/material/Button';
import {CrosswalkConnection} from "@app/common/interfaces/crosswalk-connection.interface";
import EastIcon from '@mui/icons-material/East';

export default function NodeInfo(props: { isAnySelectedLinked: boolean, isBothSelectedLinked: boolean, sourceData: CrosswalkConnection, targetData: CrosswalkConnection, performNodeInfoAction: any }) {
    //console.log('source', props.sourceData);
    //console.log('target', props.targetData);
    return (<>

        <div className='row d-flex justify-content-between node-info-box'>

            {/*  SOURCE NODE */}
            <div className='col-5 flex-column d-flex justify-content-between content-box'>
                <div className='mb-2'>
                    <h5 className='my-0'>Source node information</h5>
                    <div className='source-to-destination-wrap'>{props.sourceData.sourceTitle}
                        {props.sourceData.targetTitle &&
                            <span><EastIcon className='arrow-icon'/> <Button className='px-0'
                                                                             title='Select linked node from target tree'
                                                                             style={{textTransform: 'none'}}
                                                                             onClick={() => {
                                                                                 props.performNodeInfoAction(props.sourceData.target, true);
                                                                             }}>{props.sourceData.targetTitle}</Button>
                                </span>
                        }
                    </div>
                </div>
                <div className='row'>
                    <div className='col-6'>
                        <div className='fw-bold'>Node type:</div>
                        <div>{props.sourceData.type}</div>
                        <br/>
                    </div>
                    <div className='col-6'>
                        <div className='fw-bold'>Cardinality:</div>
                        <div>Not defined</div>
                        <br/>
                    </div>
                </div>
            </div>

            <div className='col-2'>
            </div>

            {/* TARGET NODE */}
            <div className='col-5 flex-column d-flex justify-content-between content-box'>
                <div className='mb-2'>
                    <h5 className='my-0'>Target node information</h5>
                    <div className='source-to-destination-wrap'>{props.targetData.sourceTitle}
                        {props.targetData.target &&
                            <span><EastIcon className='arrow-icon'/> <Button className='px-0'
                                                                             title='Select linked node from source tree'
                                                                             style={{textTransform: 'none'}}
                                                                             onClick={() => {
                                                                                 props.performNodeInfoAction(props.targetData.target, false);
                                                                             }}>{props.targetData.targetTitle}</Button>
                                </span>
                        }
                    </div>
                </div>
                <div className='row'>
                    <div className='col-6'>
                        <div className='fw-bold'>Node type:</div>
                        <div>{props.targetData.type}</div>
                        <br/>
                    </div>
                    <div className='col-6'>
                        <div className='fw-bold'>Cardinality:</div>
                        <div>Not defined</div>
                        <br/>
                    </div>
                </div>
            </div>
        </div>
    </>)
}