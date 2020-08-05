(function () {
    'use strict';

    const app = angular.module('angular.data.export',
      [
          'base64',
          'angular.download.service'
      ]
    );

    function DataTransform($base64, $injector, fileDownloadService) {

        this.mapping = null;
        this.module  = null;

        /**
         * @ngdoc function
         * @name DataTransform.setDataMapping
         * @module angular.data.transform
         * @kind function
         * @description Indicates the field that need to be transformed
         * @param {string} module used to perform data transform
         */
        this.setDataMapping = function (mapping) {
            this.mapping = mapping;
        };

        /**
         * @ngdoc function
         * @name DataTransform.transform
         * @module angular.data.transform
         * @kind function
         * @description Transforms data into specific format
         * @param {json} data to transform
         * @param {string} module used to perform data transform
         * @returns {string}
         */
        this.transform = function (data, module) {
            this.module = $injector.get(module);
            if (this.mapping != null)
                this.module.setMapping(this.mapping);
            return this.module.transform(data);
        };

        /**
         * @ngdoc function
         * @name DataTransform.transformAndDownload
         * @module angular.data.transform
         * @kind function
         * @description Transforms data into specific format and launch a download a file action
         * @param {json} data to transform
         * @param {string} module used to perform data transform
         * @param {string} filename for the download
         */
        this.transformAndDownload = function (data, module, filename) {
            let tData = this.transform(data, module);
            if (filename == undefined)
                filename = 'exportData' + this.module.getFileExtension();
            fileDownloadService.setMimeType(this.module.getMimeType());
            fileDownloadService.downloadFile(filename, tData);
        }

    }

    app.factory('dataExportService', [
        '$base64',
        '$injector',
        'fileDownloadService',
        function ($base64, $injector, fileDownloadService) {
            return new DataTransform($base64, $injector, fileDownloadService);
        }
    ]);

})();