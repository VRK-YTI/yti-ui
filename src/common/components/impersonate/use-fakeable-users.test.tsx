import { renderHook } from '@testing-library/react-hooks';
import axios from 'axios';
import { clearSWRCache } from '../../../tests/test-utils';
import useFakeableUsers from './use-fakeable-users';

jest.mock('axios');
const mockedAxiosGet = axios.get as jest.MockedFunction<typeof axios.get>;

describe('useFakeableUsers', () => {
  it('should return a list of users', async () => {
    const users = [
      {'id':'822a431d-195b-03de-d1d6-83e33eee13a2','email':'testiadmin@localhost','displayName':'Test Admin'},
      {'id':'4b0d96da-6eff-a421-a132-46d310651155','email':'testcodelist@localhost','displayName':'Test Codelist'},
      {'id':'5174ce9e-6cea-9aef-5074-cfc00f9b5c38','email':'testdatamodel@localhost','displayName':'Test Datamodel'},
      {'id':'f2388b8b-38a9-d976-dd46-e73afbef3344','email':'testmember@localhost','displayName':'Test Member'},
      {'id':'e0bf029a-b2ee-8f75-8eb9-36b80d65f475','email':'dummy@localhost','displayName':'Test Nogroup'},
      {'id':'ebe948a6-42da-7c4b-421e-de9ff0ddc0ba','email':'testisuperuser@localhost','displayName':'Test Superuser'},
      {'id':'db2351f9-5b56-89e5-d9ef-e59efbb475ce','email':'testterminology@localhost','displayName':'Test Terminology'},
      {'id':'7f31b7b1-c01d-4c42-d0b6-a2a0795c5a53','email':'testtestgroup@localhost','displayName':'Test TestGroup'},
      {'id':'4ce70937-6fa4-49af-a229-b5f10328adb8','email':'admin@localhost','displayName':'Admin User'},
    ];
    mockedAxiosGet.mockResolvedValue({ data: users });

    const { result, waitForNextUpdate } = renderHook(() => useFakeableUsers(), { wrapper: clearSWRCache });
    await waitForNextUpdate();

    expect(result.current).toMatchObject(users);
  });

  it('should return an empty list when users were not found', async () => {
    mockedAxiosGet.mockResolvedValue({ data: [] });

    const { result, waitForNextUpdate } = renderHook(() => useFakeableUsers(), { wrapper: clearSWRCache });
    await waitForNextUpdate();

    expect(result.current).toEqual([]);
  });
});
