import { selectLogin } from '@app/common/components/login/login.slice';
import { useGetOrganizationsQuery } from '@app/common/components/organizations/organizations.slice';
import {
  useGetRequestsQuery,
  usePostRequestMutation,
} from '@app/common/components/requests/requests.slice';
import {
  useGetSubscriptionsQuery,
  useToggleSubscriptionMutation,
  useToggleSubscriptionsMutation,
} from '@app/common/components/subscription/subscription.slice';
import { useTranslation } from 'next-i18next';
import { useSelector } from 'react-redux';
import { default as CommonOwnInformation } from 'yti-common-ui/modules/own-information';
import { getLanguageVersion } from '@app/common/utils/get-language-version';
import SubscriptionModal from 'yti-common-ui/modules/own-information/subscription-modal';
import { Organization } from 'yti-common-ui/interfaces/organization.interface';
import PermissionModal from 'yti-common-ui/modules/own-information/permission-modal';

export default function OwnInformation() {
  const user = useSelector(selectLogin());
  const { i18n } = useTranslation('common');
  const { data: organizations } = useGetOrganizationsQuery({
    sortLang: i18n.language,
    includeChildOrganizations: true,
  });
  const { data: subscriptions, refetch: refetchSubscriptions } =
    useGetSubscriptionsQuery();
  const { data: requests, refetch: refetchRequests } = useGetRequestsQuery();
  const [toggleSubscriptions, toggleResult] = useToggleSubscriptionsMutation();
  const [toggleSubscription, result] = useToggleSubscriptionMutation();
  const [postRequest, postRequestResult] = usePostRequestMutation();

  return (
    <CommonOwnInformation
      user={user}
      organizations={organizations}
      requests={requests}
      subscriptions={subscriptions}
      refetchSubscriptions={refetchSubscriptions}
      toggleSubscriptions={toggleSubscriptions}
      toggleSubscriptionsResult={toggleResult}
      getLanguageVersion={getLanguageVersion}
      renderPermissionModal={(props: { organizations?: Organization[] }) => (
        <PermissionModal
          requests={requests}
          organizations={props.organizations}
          getLanguageVersion={getLanguageVersion}
          postRequest={postRequest}
          postRequestResult={postRequestResult}
          refetchRequests={refetchRequests}
        />
      )}
      renderSubscriptionModal={(props: {
        resourceIds: string[];
        singular?: boolean;
      }) => (
        <SubscriptionModal
          toggleSubscription={toggleSubscription}
          toggleSubscriptionResult={result}
          refetchSubscriptions={refetchSubscriptions}
          resourceIds={props.resourceIds}
          singular={props.singular}
        />
      )}
    />
  );
}
