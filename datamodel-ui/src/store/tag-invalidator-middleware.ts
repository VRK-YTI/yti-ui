import { codeApi } from '@app/common/components/code/code.slice';
import { countApi } from '@app/common/components/counts/counts.slice';
import { modelApi } from '@app/common/components/model/model.slice';
import { organizationsApi } from '@app/common/components/organizations/organizations.slice';
import { searchInternalResourcesApi } from '@app/common/components/search-internal-resources/search-internal-resources.slice';
import { searchModelsApi } from '@app/common/components/search-models/search-models.slice';
import { serviceCategoriesApi } from '@app/common/components/service-categories/service-categories.slice';
import { visualizationApi } from '@app/common/components/visualization/visualization.slice';
import { AnyAction, createListenerMiddleware } from '@reduxjs/toolkit';

export const tagInvalidatorMiddleware = createListenerMiddleware();

function mutationIsFulfilled(action: AnyAction) {
  return (
    action.meta?.requestStatus === 'fulfilled' &&
    action.meta?.arg?.type === 'mutation'
  );
}

// Invalidate data used in front page when new model is created
tagInvalidatorMiddleware.startListening({
  predicate: (action) => {
    return (
      mutationIsFulfilled(action) &&
      ['createModel'].some((name) =>
        action.meta?.arg?.endpointName.includes(name)
      )
    );
  },
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(
      organizationsApi.util.invalidateTags(['Organizations'])
    );
    listenerApi.dispatch(
      serviceCategoriesApi.util.invalidateTags(['ServiceCategories'])
    );
    listenerApi.dispatch(codeApi.util.invalidateTags(['Languages']));
    listenerApi.dispatch(countApi.util.invalidateTags(['Count']));
    listenerApi.dispatch(searchModelsApi.util.invalidateTags(['SearchModels']));
  },
});

// When model should be invalidated
tagInvalidatorMiddleware.startListening({
  predicate: (action) => {
    return (
      mutationIsFulfilled(action) &&
      ['createClass', 'updateClass'].some((name) =>
        action.meta?.arg?.endpointName.includes(name)
      )
    );
  },
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(modelApi.util.invalidateTags(['Model']));
  },
});

// When internal resources should be invalidated
tagInvalidatorMiddleware.startListening({
  predicate: (action) => {
    return (
      mutationIsFulfilled(action) &&
      [
        'createClass',
        'createResource',
        'renameClass',
        'renameResource',
        'updateClass',
        'updateResource',
      ].some((name) => action.meta?.arg?.endpointName.includes(name))
    );
  },
  effect: async (action, listenerApi) => {
    const id = action.meta?.arg?.originalArgs?.data.type ?? 'CLASS';
    listenerApi.dispatch(
      searchInternalResourcesApi.util.invalidateTags([
        { type: 'InternalResources', id },
      ])
    );
    listenerApi.dispatch(
      searchInternalResourcesApi.util.invalidateTags([
        { type: 'InternalResources', id: 'ALL' },
      ])
    );
  },
});

// When visualization data should be invalidated
tagInvalidatorMiddleware.startListening({
  predicate: (action) => {
    return (
      mutationIsFulfilled(action) &&
      [
        'addPropertyReference',
        'Class',
        'deletePropertyReference',
        'Resource',
      ].some((name) => action.meta?.arg?.endpointName.includes(name))
    );
  },
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(
      visualizationApi.util.invalidateTags(['Visualization'])
    );
  },
});
