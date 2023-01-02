import { AnyAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

export default function isHydrate(action: AnyAction) {
  return action.type === HYDRATE;
}
