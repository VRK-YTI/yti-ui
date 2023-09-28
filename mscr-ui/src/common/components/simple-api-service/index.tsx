import * as React from 'react';
import {useEffect} from 'react';
import axios from "axios";
import {getDatamodelApiBaseQuery} from "@app/store/api-base-query";
import {Crosswalk} from "@app/common/interfaces/crosswalk.interface";
import { createApi } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';

export function fetchCrosswalkData(crosswalkId: string) {
    return new Promise((resolve) => {
        setTimeout(() => {
            fetch('http://localhost:9004/datamodel-api/v2/frontend/' + crosswalkId)
                .then((res) => res.json())
                .then((data) => {
                    resolve(data);
                })
                .catch((err) => {
                    //throw new Error('FAILZ!');
                });
        })
    });
}


export function PromisesTest() {
    const [resp, setResp] = React.useState<any>('');
    const [error, setError] = React.useState<boolean>(false);
    const [state, setState] = React.useState<string>('');

    useEffect(() => {
        fetch('http://localhost:9004/datamodel-api/v2/frontend/organizations')
            .then((res) => res.json())
            .then((data) => {
                setState(data)
                setResp(false)
                console.log('data', data);
            })
            .catch((err) => {
            console.error('Error:', err);
            setState('error');
            setError(err);
        });
    }, []);
}

export async function getData2() {
    const res = await fetch('http://localhost:9004/datamodel-api/v2/frontend/organizations')
    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }
    return res.json()
}
