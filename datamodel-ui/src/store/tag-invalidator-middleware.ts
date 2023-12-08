import { modelApi } from '@app/common/components/model/model.slice';
import { searchInternalResourcesApi } from '@app/common/components/search-internal-resources/search-internal-resources.slice';
import { visualizationApi } from '@app/common/components/visualization/visualization.slice';
import { AnyAction, createListenerMiddleware } from '@reduxjs/toolkit';

export const tagInvalidatorMiddleware = createListenerMiddleware();

function mutationIsFulfilled(action: AnyAction) {
  return (
    action.meta?.requestStatus === 'fulfilled' &&
    action.meta?.arg?.type === 'mutation'
  );
}

// When model and internal resources should be invalidated
tagInvalidatorMiddleware.startListening({
  predicate: (action) => {
    if (
      mutationIsFulfilled(action) &&
      action.meta?.arg?.endpointName === 'createClass'
    ) {
      return true;
    }

    return false;
  },
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(modelApi.util.invalidateTags(['Model']));
    listenerApi.dispatch(
      searchInternalResourcesApi.util.invalidateTags(['InternalResources'])
    );
  },
});

// When visualization data should be invalidated
tagInvalidatorMiddleware.startListening({
  predicate: (action) => {
    if (
      mutationIsFulfilled(action) &&
      [
        'addPropertyReference',
        'Class',
        'deletePropertyReference',
        'Resource',
      ].some((name) => action.meta?.arg?.endpointName.includes(name))
    ) {
      return true;
    }

    return false;
  },
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(
      visualizationApi.util.invalidateTags(['Visualization'])
    );
  },
});

// When search internal resources should be invalidated
tagInvalidatorMiddleware.startListening({
  predicate: (action) => {
    if (
      mutationIsFulfilled(action) &&
      ['deleteClass', 'createClass'].some((name) =>
        action.meta?.arg?.endpointName.includes(name)
      )
    ) {
      return true;
    }

    return false;
  },
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(
      searchInternalResourcesApi.util.invalidateTags(['InternalResources'])
    );
  },
});
