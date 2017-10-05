(function() {
  'use strict';
  angular.module('civic.config')
    .config(basicFieldTypesConfig);

  // @ngInject
  function basicFieldTypesConfig(formlyConfigProvider) {
    /*
     * BASIC FIELD TYPES
     * Two versions of each basic field type, one with a help column and one without
     */
    // input
    formlyConfigProvider.setType({
      name: 'basicInput',
      template: '<input class="form-control" ng-model="model[options.key]">'
    });

    formlyConfigProvider.setType({
      name: 'horizontalInput',
      extends: 'input',
      wrapper: ['horizontalBootstrapLabel', 'bootstrapHasError']
    });

    formlyConfigProvider.setType({
      name: 'horizontalInputHelp',
      extends: 'input',
      wrapper: ['horizontalBootstrapHelp', 'bootstrapHasError']
    });

    formlyConfigProvider.setType({
      name: 'multiselect',
      extends: 'select',
      defaultOptions: {
        ngModelAttrs: {
          'true': {
            value: 'multiple'
          }
        }
      }
    });

    // select
    formlyConfigProvider.setType({
      name: 'horizontalSelect',
      extends: 'select',
      wrapper: ['horizontalBootstrapLabel', 'bootstrapHasError']
    });

    formlyConfigProvider.setType({
      name: 'horizontalSelectHelp',
      extends: 'select',
      wrapper: ['horizontalBootstrapHelp', 'bootstrapHasError']
    });

    formlyConfigProvider.setType({
      name: 'horizontalMultiselectHelp',
      extends: 'multiselect',
      wrapper: ['horizontalBootstrapHelp', 'bootstrapHasError']
    });
    // textarea
    formlyConfigProvider.setType({
      name: 'horizontalTextarea',
      extends: 'textarea',
      wrapper: ['validationMessages', 'horizontalBootstrapLabel', 'bootstrapHasError']
    });

    formlyConfigProvider.setType({
      name: 'horizontalTextareaHelp',
      extends: 'textarea',
      wrapper: ['validationMessages', 'horizontalBootstrapHelp', 'bootstrapHasError']
    });


    // checkbox
    formlyConfigProvider.setType({
      name: 'horizontalCheckbox',
      extends: 'checkbox',
      wrapper: ['horizontalBootstrapCheckbox', 'bootstrapHasError']
    });

    formlyConfigProvider.setType({
      name: 'horizontalCheckboxHelp',
      extends: 'checkbox',
      wrapper: ['horizontalBootstrapHelpNoLabel', 'bootstrapHasError']
    });

    // formlyConfigProvider.setType({
    //   name: 'horizontalCommentHelp',
    //   extends: 'comment',
    //   wrapper: ['horizontalBootstrapHelp', 'bootstrapHasError']
    // });

    /*
    * EXTENDED FIELD TYPES
    * (more complex behavior than the basics, but no controller, template, or additional logic)
    */

    formlyConfigProvider.setType({
      name: 'input-loader',
      extends: 'input',
      wrapper: ['loader']
    });
  }
})();
