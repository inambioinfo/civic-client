(function() {
  'use strict';
  angular.module('civic.services')
    .factory('VariantsResource', VariantsResource)
    .factory('Variants', VariantsService);

  // @ngInject
  function VariantsResource($resource, $cacheFactory) {
    var cache = $cacheFactory.get('$http');

    var cacheInterceptor = function(response) {
      // console.log(['VariantsResource: removing', response.config.url, 'from $http cache.'].join(" "));
      cache.remove(response.config.url);
      return response.$promise;
    };

    return $resource('/api/variants/:variantId',
      {
        variantId: '@variantId'
      },
      {
        // Base Variant Resources
        query: {
          method: 'GET',
          isArray: true,
          cache: cache
        },
        get: {
          method: 'GET',
          isArray: false,
          cache: cache
        },
        update: {
          method: 'PATCH',
          interceptor: {
            response: cacheInterceptor
          }
        },
        delete: {
          method: 'DELETE',
          interceptor: {
            response: cacheInterceptor
          }
        },
        apply: {
          method: 'PATCH',
          cache: false
        },

        // Variant Collections
        queryEvidence: {
          method: 'GET',
          url: '/api/variants/:variantId/evidence_items',
          isArray: true,
          cache: cache
        },

        // Variant Comments Resources
        queryComments: {
          method: 'GET',
          url: '/api/variants/:variantId/comments',
          isArray: true,
          cache: cache
        },
        getComment: {
          method: 'GET',
          url: '/api/variants/:variantId/comments/:commentId',
          params: {
            variantId: '@variantId',
            commentId: '@commentId'
          },
          isArray: false,
          cache: cache
        },
        submitComment: {
          method: 'POST',
          url: '/api/variants/:variantId/comments',
          params: {
            variantId: '@variantId'
          },
          cache: false
        },
        updateComment: {
          method: 'PATCH',
          url: '/api/variants/:variantId/comments/:commentId',
          params: {
            variantId: '@variantId',
            commentId: '@commentId'
          },
          cache: false
        },
        deleteComment: {
          method: 'DELETE',
          url: '/api/variants/:variantId/comments/:commentId',
          params: {
            variantId: '@variantId',
            commentId: '@commentId'
          },
          cache: false
        },
        queryVariantTypes: {
          method: 'GET',
          url: '/api/variant_types',
          params: {
            name: '@name',
            count: '@count',
            page: '@page'
          },
          cache: false
        }
      }
    );
  }

  // @ngInject
  function VariantsService(VariantsResource, $q, $cacheFactory) {
    var cache = $cacheFactory.get('$http');

    // Base Variant and Variant Collection
    var item = {};
    var collection = [];

    // Variant Collections
    var evidence = [];
    var comments = [];

    return {
      initBase: initBase,
      initComments: initComments,
      data: {
        item: item,
        collection: collection,
        evidence: evidence,
        comments: comments
      },

      // Variant Base
      query: query,
      get: get,
      update: update,
      delete: deleteItem,
      apply: apply,

      // Variant Collections
      queryEvidence: queryEvidence,

      // Variant Comments
      queryComments: queryComments,
      getComment: getComment,
      submitComment: submitComment,
      updateComment: updateComment,
      deleteComment: deleteComment,

      queryVariantTypes: queryVariantTypes
    };

    function initBase(variantId) {
      return $q.all([
        get(variantId),
        queryEvidence(variantId)
      ]);
    }

    function initComments(variantId) {
      return $q.all([
        queryComments(variantId)
      ]);
    }
    // Variant Base
    function query() {
      return VariantsResource.query().$promise
        .then(function(response) {
          angular.copy(response, collection);
          return response.$promise;
        });
    }
    function get(variantId) {
      return VariantsResource.get({variantId: variantId}).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }
    function update(reqObj) {
      return VariantsResource.update(reqObj).$promise
        .then(function(response) {
          angular.copy(response, item);
          return response.$promise;
        });
    }
    function deleteItem(variantId) {
      return VariantsResource.delete({variantId: variantId}).$promise
        .then(function(response) {
          item = null;
          return response.$promise;
        });
    }
    function apply(reqObj) {
      return VariantsResource.apply(reqObj).$promise.then(
        function(response) { // success
          cache.remove('/api/variants/' + response.id);
          get(reqObj.variantId);
          return $q.when(response);
        },
        function(error) { // fail
          return $q.reject(error);
        });
    }

    // Variant Collections
    function queryEvidence(variantId) {
      return VariantsResource.queryEvidence({variantId: variantId}).$promise
        .then(function(response) {
          angular.copy(response, evidence);
          return response.$promise;
        });
    }

    // Variant Comments
    function queryComments(variantId) {
      return VariantsResource.queryComments({variantId: variantId}).$promise
        .then(function(response) {
          angular.copy(response, comments);
          return response.$promise;
        });
    }
    function getComment(variantId, commentId) {
      return VariantsResource.getComment({variantId: variantId, commentId: commentId}).$promise
        .then(function(response) {
          return response.$promise;
        });
    }
    function submitComment(reqObj) {
      return VariantsResource.submitComment(reqObj).$promise
        .then(function(response) {
          cache.remove('/api/variants/' + reqObj.variantId + '/comments');
          queryComments(reqObj.variantId);
          return response.$promise;
        });
    }
    function updateComment(reqObj) {
      return VariantsResource.updateComment(reqObj).$promise
        .then(function(response) {
          cache.remove('/api/variants/' + reqObj.variantId + '/comments/' + reqObj.id);
          cache.remove('/api/variants/' + reqObj.variantId + '/comments');
          queryComments(reqObj.variantId);
          return response.$promise;
        });
    }
    function deleteComment(commentId) {
      return VariantsResource.deleteComment({variantId: item.id, commentId: commentId}).$promise
        .then(function(response) {
          cache.remove('/api/variants/' + item.id + '/comments');
          queryComments(item.id);
          return response.$promise;
        });
    }
    function queryVariantTypes(reqObj) {
      return VariantsResource.queryVariantTypes(reqObj).$promise
        .then(function(response) {
          return response.$promise;
        });
    }
  }
})();
