import Router from 'next/router';
import { useTranslation } from 'next-i18next';

export type ConfirmationState = 'enabled' | 'disabled';

let confirmationState: ConfirmationState;
let message = '';

const beforeUnloadHandler = (event: BeforeUnloadEvent) => {
  event.preventDefault();
  event.returnValue = message;
  return message;
};

const routeChangeHandler = (url: string) => {
  if (Router.pathname === url) return;
  if (confirm(message)) return;

  Router.events.emit('routeChangeError');
  throw `Route change to "${url}" was aborted (this error can be savely ignored). See https://github.com/vercel/next.js/issues/2476.`;
};

const enableConfirmation = () => {
  if (confirmationState !== 'enabled') {
    window.addEventListener('beforeunload', beforeUnloadHandler);
    Router.events.on('routeChangeStart', routeChangeHandler);
    confirmationState = 'enabled';
  }
};

const disableConfirmation = () => {
  if (confirmationState !== 'disabled') {
    window.removeEventListener('beforeunload', beforeUnloadHandler);
    Router.events.off('routeChangeStart', routeChangeHandler);
    confirmationState = 'disabled';
  }
};

export default function useConfirmBeforeLeavingPage(
  initialState: ConfirmationState
) {
  const { t } = useTranslation();
  message = t('confirm-page-leave', { ns: 'common' });

  if (confirmationState === undefined) {
    if (initialState === 'enabled') {
      enableConfirmation();
    } else {
      disableConfirmation();
    }
  }

  return {
    enableConfirmation,
    disableConfirmation,
  };
}
