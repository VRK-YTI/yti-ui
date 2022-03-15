import axios from 'axios';

export function addSubscription(url: string) {
  subscriptionAction(url, 'ADD');
}

export function deleteSubscription(url: string) {
  subscriptionAction(url, 'DELETE');
}

async function subscriptionAction(url: string, action: string) {
  console.log(getURL());
  await axios.post(getURL(), {
    action: action,
    type: 'terminology',
    uri: url
  }).catch(err => {
    console.error(err);
  });
}

function getURL() {
  return process.env.MESSAGING_API_URL
    ?
    `${process.env.MESSAGING_API_URL}/api/v1/subscriptions/`
    :
    '/messaging-api/api/v1/subscriptions/';
}
