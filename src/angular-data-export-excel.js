(function () {
    'use strict';

    const app = angular.module('angular.data.export.excel', []);

    function DataTransformExcel($filter) {

        this.mime          = 'application/vnd.ms-excel';
        this.fileExtension = '.xls';
        this.mapping       = null;

        //@TODO Move into a more generic service
        Object.byString = function (o, s) {
            if (typeof (o[s] === 'function')) {
                return o[s]();
            }
            s     = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
            s     = s.replace(/^\./, '');           // strip a leading dot
            let a = s.split('.');
            for (let i = 0, n = a.length; i < n; ++i) {
                let k = a[i];
                if (k in o) {
                    o = o[k];
                } else {
                    return;
                }
            }

            return o;
        };

        /**
         * @ngdoc function
         * @name DataTransformExcel.getMimeType
         * @module angular.data.transform.excel
         * @kind function
         * @description Indicates mime type for the transformed data
         * @return {string}
         */
        this.getMimeType = function () {
            return this.mime;
        };

        /**
         * @ngdoc function
         * @name DataTransformExcel.getFileExtension
         * @module angular.data.transform.excel
         * @kind function
         * @description Indicates file extension for the transformed data
         * @return {string}
         */
        this.getFileExtension = function () {
            return this.fileExtension;
        };

        /**
         * @ngdoc function
         * @name DataTransformExcel.setMapping
         * @module angular.data.transform.excel
         * @kind function
         * @description Indicates how to render and map columns
         * @return {string}
         */
        this.setMapping = function (map) {
            this.mapping = map;
        };

        /**
         * @ngdoc function
         * @name DataTransformExcel.processHeader
         * @module angular.data.transform.excel
         * @kind function
         * @description Processes Excel header from json data keys
         * @param data
         * @return {string}
         */
        this.processHeader = function (data) {
            let keys = [];
            // Header
            if (this.mapping == null) {
                if (typeof Object.keys !== 'function') {
                    alert('Cannot transform data, Object.keys function is not available.');
                }
                keys = Object.keys(data[0]);
            } else {
                for (let i = 0; i < this.mapping.length; i++) {
                    let display = this.mapping[i].headerCellFilter ? $filter(this.mapping[i].headerCellFilter)(this.mapping[i].displayName) : this.mapping[i].displayName;
                    keys.push(display);
                }
            }

            let header = '<tr>';
            for (let j = 0; j < keys.length; j++) {
                header += '<td>' + keys[j] + '</td>';
            }
            header += '</tr>';
            return header;
        };

        /**
         * @ngdoc function
         * @name DataTransformExcel.transform
         * @module angular.data.transform
         * @kind function
         * @description Transforms data into specific format
         * @param {json} data to transform
         * @returns {string}
         */
        this.transform = function (data) {
            let excel = '';
            // Cleanup
            excel += this.processHeader(data);

            //Body
            if (this.mapping == null) {
                for (let i = 0; i < data.length; i++) {
                    excel += '<tr>';
                    for (let cell in data[i]) {
                        excel += '<td>' + data[i][cell] + '</td>';
                    }
                    excel += '</tr>';
                }
            } else {
                for (let k = 0; k < data.length; k++) {
                    excel += '<tr>';
                    for (let j = 0; j < this.mapping.length; j++) {
                        (this.mapping[j].field) && (excel += '<td>' + Object.byString(data[k], this.mapping[j].field) + '</td>');
                    }
                    excel += '</tr>';
                }
            }

            let excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Angular Export Excel</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>";
            excelFile += excel;
            excelFile += "</table></body></html>";

            return excelFile;
        };

    }

    app.factory('dataExportExcelService', [
          '$filter',
          function ($filter) {
              return new DataTransformExcel($filter);
          }
      ]
    );

})();