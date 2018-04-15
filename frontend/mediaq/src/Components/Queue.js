import React, { Component } from 'react';
import { Table, Button } from 'reactstrap';
import PlusIcon from 'open-iconic/svg/plus.svg';

import QueueRowEntry from './QueueRowEntry';

const Queue = ({ selectedMedia, queue, changeMediaState, initiateSearch }) => (
    <Table hover>
        <thead>
            <tr>
                <th></th>
                <th></th>
                <th>Title</th>
                <th>Author/Artist</th>
                <th>Album</th>
                <th>Source</th>
                <th>
                    <Button onClick={initiateSearch} color="primary">
                        <img alt="Add to Queue" src={PlusIcon} />
                    </Button>
                </th>
            </tr>
        </thead>
        <tbody>
            {queue.map((obj, index) => {
                return (
                <QueueRowEntry
                    key={obj.mediaId}
                    rowID={index + 1} 
                    rowData={obj.rowData}
                    playState={obj.playState}
                    rowEntryPlayButtonClicked={changeMediaState} />
                )
            })}
        </tbody>
    </Table>
)

export default Queue
