import { renderHook } from '@testing-library/react-hooks';
import axios from 'axios';
import { clearSWRCache } from '../../../tests/test-utils';
import useFakeableUsers from './use-fakeable-users';

jest.mock('axios');
const mockedAxiosGet = axios.get as jest.MockedFunction<typeof axios.get>;

describe('useFakeableUsers', () => {
  it('should return a list of users', async () => {
    const users = [
      {id: '4ce70937-6fa4-49af-a229-b5f10328adb8', email: 'admin@localhost', displayName: 'Admin User'},
      {id: '7f31b7b1-c01d-4c42-d0b6-a2a0795c5a53', email: 'testtestgroup@localhost', displayName: 'Test TestGroup'},
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
