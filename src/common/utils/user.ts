import { User, anonymousUser } from '@app/common/interfaces/user.interface';

export async function authFakeUser() {
  const fetchUrl = '/api/auth/fake-login';
  const user: User = await fetch(fetchUrl, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  })
    .then(async (response) => {
      if (response.ok == true) {
        const resolvedUser: User = await response.json();
        return resolvedUser;
      }
      console.error('Server response not ok in authFakeUser function.');
      return anonymousUser;
    })
    .catch((error) => {
      console.error('Error in authFakeUser function');
      console.error(error);
      return anonymousUser;
    });
  return user;
}
