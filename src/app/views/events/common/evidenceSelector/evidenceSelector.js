(function() {
  'use strict';

  /**
   * Renders an data grid of evidence items, the last column containing a button labeled either 'Add' or 'Remove',
   * depending on if the grid's mode is specified as 'search' or 'list'. Clicking 'Add' will add the evidence item object
   * to the array provided to the 'items' attribute. Clicking 'Remove' will remove the item's object from the 'items' array.
   * Obviously two grids need to operate in tandem to be of much use, so this grid will likely be utlilized by a more abstract
   * component that renders both grids.
   *
   * @param {string} role - Either 'search' or 'list'.
   * @param {array} items - Array containing the list of evidence item objects manipulated by the grids.
   */

  angular.module('civic.events')
    .directive('evidenceSelector', evidenceSelector)
    .controller('EvidenceSelectorController', EvidenceSelectorController);

  // @ngInject
  function evidenceSelector() {
    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        mode: '=',
        items: '='
      },
      templateUrl: 'app/views/events/common/evidenceSelector/evidenceSelector.tpl.html',
      controller: 'EvidenceSelectorController'
    };
    return directive;
  }

  // @ngInject
  function EvidenceSelectorController($scope,
                                $state,
                                $window,
                                $location,
                                uiGridConstants,
                                Datatables,
                                _) {
    var ctrl = $scope.ctrl = {};

    var pageCount = 5;
    var maxRows = ctrl.maxRows = pageCount;

    // declare ui paging/sorting/filtering vars
    ctrl.mode = $scope.mode;
    ctrl.totalItems = Number();
    ctrl.page = $scope.page;
    ctrl.count= Number();

    ctrl.filters = [];

    if(ctrl.mode !== 'evidence_items') {
      ctrl.sorting = [{
        field: 'evidence_item_count',
        direction: 'desc'
      }];
    } else {
      ctrl.sorting = [{
        field: 'id',
        direction: 'asc'
      }];
    }

    $scope.$watch('ctrl.totalItems', function() {
      ctrl.totalPages = Math.ceil(ctrl.totalItems / pageCount);
    });

    ctrl.gridOptions = {
      enablePaginationControls: false,

      useExternalFiltering: true,
      useExternalSorting: true,
      useExternalPaging: true,

      paginationPageSizes: [maxRows],
      paginationPageSize: maxRows,
      minRowsToShow: maxRows,

      enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
      enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,

      enableFiltering: true,
      enableColumnMenus: false,
      enableSorting: true,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      multiSelect: false,
      modifierKeysToMultiSelect: false,
      noUnselect: true
    };

    // set up column defs and data transforms for each mode
    var modeColumnDefs = {
      'evidence_items': [
        {
          name: 'gene_name',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'variant_name',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'disease',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'source_citation',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'source_title',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
      ],
      'variants': [
        {
          name: 'variant',
          width: '25%',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'entrez_gene',
          width: '15%',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'diseases',
          displayName: 'Diseases',
          width: '25%',
          enableFiltering: true,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/browse/directives/evidenceSelectorTooltipCell.tpl.html'
        },
        {
          name: 'drugs',
          displayName: 'Drugs',
          width: '25%',
          enableFiltering: true,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/browse/directives/evidenceSelectorTooltipCell.tpl.html'
        },
        {
          name: 'evidence_item_count',
          width: '10%',
          displayName: 'Evidence',
          sort: {
            direction: uiGridConstants.DESC
          },
          enableFiltering: false,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        }
      ],
      'genes': [
        {
          name: 'name',
          width: '15%',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'gene_aliases',
          width: '30%',
          displayName: 'Gene Aliases',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/browse/directives/evidenceSelectorTooltipCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'diseases',
          //width: '30%',
          displayName: 'Diseases',
          enableFiltering: true,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/browse/directives/evidenceSelectorTooltipCell.tpl.html'
        },
        {
          name: 'drugs',
          //width: '30%',
          displayName: 'Drugs',
          enableFiltering: true,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/browse/directives/evidenceSelectorTooltipCell.tpl.html'
        },
        {
          name: 'variant_count',
          displayName: 'Variants',
          width: '10%',
          enableFiltering: false,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'evidence_item_count',
          width: '10%',
          displayName: 'Evidence',
          sort: {
            direction: uiGridConstants.DESC
          },
          enableFiltering: false,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        }
      ],
      'variant_groups': [
        {
          name: 'name',
          displayName: 'Name',
          width: '20%',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'variants',
          displayName: 'Variants',
          width: '35%',
          enableFiltering: true,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/browse/directives/evidenceSelectorTooltipCell.tpl.html'
        },
        {
          name: 'variant_count',
          displayName: 'Count',
          width: '7%',
          enableFiltering: false,
          allowCellFocus: false
        },
        {
          name: 'entrez_genes',
          displayName: 'Genes',
          width: '23%',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'evidence_item_count',
          type: 'number',
          displayName: 'Evidence Items',
          width: '15%',
          enableFiltering: false,
          allowCellFocus: false,
          sort: { direction: uiGridConstants.DESC },
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        }
      ],
      'sources': [
        {
          name: 'pubmed_id',
          displayName: 'Pubmed ID',
          enableFiltering: true,
          allowCellFocus: false,
          cellTemplate: 'app/views/events/common/genericHighlightCell.tpl.html',
          type: 'string',
          width: '8%',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'author_list',
          displayName: 'Authors',
          enableFiltering: true,
          allowCellFocus: false,
          type: 'string',
          width: '20%',
          cellTemplate: 'app/views/browse/directives/evidenceSelectorTooltipCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'publication_year',
          displayName: 'Year',
          type: 'string',
          enableFiltering: true,
          allowCellFocus: false,
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          },
          cellTemplate: 'app/views/browse/directives/evidenceSelectorTooltipCell.tpl.html',
          width: '8%'
        },
        {
          name: 'journal',
          displayName: 'Journal',
          type: 'string',
          enableFiltering: true,
          allowCellFocus: false,
          width: '15%',
          cellTemplate: 'app/views/browse/directives/evidenceSelectorTooltipCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'name',
          displayName: 'Name',
          type: 'string',
          allowCellFocus: false,
          enableFiltering: true,
          cellTemplate: 'app/views/browse/directives/evidenceSelectorTooltipCell.tpl.html',
          filter: {
            condition: uiGridConstants.filter.CONTAINS
          }
        },
        {
          name: 'evidence_item_count',
          type: 'number',
          displayName: 'Evidence Items',
          width: '10%',
          enableFiltering: false,
          allowCellFocus: false,
          sort: { direction: uiGridConstants.DESC }
        }
      ]
    };

    ctrl.gridOptions.onRegisterApi = function(gridApi) {
      ctrl.gridApi = gridApi;
      // called from pagination directive when page changes
      ctrl.pageChanged = function() {
        $location.search('page', ctrl.page);
        updateData();
      };

      // reset paging and do some other stuff on filter changes
      gridApi.core.on.filterChanged($scope, function() {
        // updateData with new filters
        var filteredCols = _.filter(this.grid.columns, function(col) {
          return _.has(col.filter, 'term') && !_.isEmpty(col.filter.term) && _.isString(col.filter.term);
        });
        if (filteredCols.length > 0) {
          ctrl.filters = _.map(filteredCols, function(col) {
            return {
              'field': col.field,
              'term': col.filter.term
            };
          });
        } else {
          ctrl.filters = [];
        }
        ctrl.page = 1;
        updateData();
      });

      gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
        if (sortColumns.length > 0) {
          ctrl.sorting = _.map(sortColumns, function(col) {
            return {
              'field': col.field,
              'direction': col.sort.direction
            };
          });
        } else {
          ctrl.sorting = [];
        }
        updateData();
      });

      // called when user clicks on a row
      gridApi.selection.on.rowSelectionChanged($scope, function(row, event){
        var state = '';
        var params = {};
        if(ctrl.mode === 'variants') {
          state = 'events.genes.summary.variants.summary';
          params = {
            geneId: row.entity.gene_id,
            variantId: row.entity.variant_id,
            '#': 'variant'
          };
        } else if (ctrl.mode === 'genes'){
          state = 'events.genes.summary';
          params = {
            geneId: row.entity.id,
            '#': 'gene'
          };
        } else if (ctrl.mode === 'variant_groups') {
          state = 'events.genes.summary.variantGroups.summary';
          params = {
            geneId: row.entity.gene_ids[0],
            variantGroupId: row.entity.id,
            '#': 'variant-group'
          };
        } else if (ctrl.mode === 'sources') {
          state = 'sources.summary';
          params = {
            sourceId: row.entity.id
          };
        } else if (ctrl.mode === 'evidence_items') {
          state = 'events.genes.summary.variants.summary.evidence.summary';
          params = {
            geneId: row.entity.gene_id,
            variantId: row.entity.variant_id,
            evidenceId: row.entity.id,
            '#': 'variant'
          };
        }

        if(event.metaKey) {
          // if meta key (alt or command) pressed, generate a state URL and open it in a new tab/window
          // shift would be preferable to meta but ui-grid's selection module appears to be capturing shift-clicks for multi-select feature
          // keep an eye on: https://github.com/angular-ui/ui-grid/issues/4926
          var url = $state.href(state, params, {absolute: true});
          $window.open(url, '_blank');
        } else {
          $state.go(state, params);
        }

      });
    };

    function updateData() {
      fetchData(ctrl.mode, ctrl.count, ctrl.page, ctrl.sorting, ctrl.filters)
        .then(function(data){
          if(ctrl.mode === 'variant_groups') {
            // add variant_count attribute
            _.forEach(data.result, function(variant_group) {
              variant_group.variant_count = variant_group.variants.split(', ').length;
              return variant_group;
            });
            ctrl.gridOptions.data = data.result;
          } else {
            ctrl.gridOptions.data = data.result;
          }
          ctrl.gridOptions.columnDefs = modeColumnDefs[ctrl.mode];
          ctrl.totalItems = data.total;
        });
    }

    function fetchData(mode, count, page, sorting, filters) {
      var request;

      request= {
        mode: mode,
        count: count,
        page: page
      };

      if (filters.length > 0) {
        _.each(filters, function(filter) {
          request['filter[' + filter.field + ']'] = filter.term;
        });
      }

      if (sorting.length > 0) {
        _.each(sorting, function(sort) {
          request['sorting[' + sort.field + ']'] = sort.direction;
        });
      }
      return Datatables.query(request);
    }

    updateData();
  }
})();
