import axios from 'axios';

export function addSubscription(url: string) {
  subscriptionAction(url, 'ADD');
}

export function deleteSubscription(url: string) {
  subscriptionAction(url, 'DELETE');
}

async function subscriptionAction(url: string, action: string) {
  const uri = process.env.NODE_ENV !== 'development'
    ?
    url
    :
    // This terminology can be found in dev, so change if dev data is changed
    'http://uri.suomi.fi/terminology/demo/terminological-vocabulary-0';

  await axios.post(getURL(), {
    action: action,
    type: 'terminology',
    uri: uri
  }).catch(err => {
    console.error(err);
  });
}

function getURL() {
  if (process.env.NODE_ENV === 'development') {
    return '/messaging-api/api/v1/subscriptions?fake.login.mail=admin@localhost';
  }

  return '/messaging-api/api/v1/subscriptions';
}
