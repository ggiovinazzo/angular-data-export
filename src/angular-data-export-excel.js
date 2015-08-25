(function() {
    'use strict';

    var app = angular.module('angular.data.export.excel',[]);
    
    function DataTransformExcel(){

        this.mime = 'application/vnd.ms-excel';
        this.fileExtension = '.xls';
        this.excel = '';
        this.mapping = null;

        //@TODO Move into a more generic service
        Object.byString = function(o, s) {
            s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
            s = s.replace(/^\./, '');           // strip a leading dot
            var a = s.split('.');
            for (var i = 0, n = a.length; i < n; ++i) {
                var k = a[i];
                if (k in o) {
                    o = o[k];
                } else {
                    return;
                }
            }
            return o;
        }
        
        
        /**
         * @ngdoc function
         * @name DataTransformExcel.getMimeType
         * @module angular.data.transform.excel
         * @kind function
         * @description Indicates mime type for the transformed data
         * @return {string}
         */
        this.getMimeType = function(){
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
        this.getFileExtension = function(){
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
        this.setMapping = function(map){
            this.mapping = map;
        };
        
        this.processHeader = function(data){
            var keys = [];
            // Header      
            if(this.mapping == null){
                if (typeof Object.keys !== 'function') {
                    alert('Cannot transform data, Object.keys function is not available.');
                }
                keys = Object.keys(data[0]);
            }
            else{
                for(var i=0; i<this.mapping.length; i++){
                    keys.push(this.mapping[i].displayName);
                }
            }
            
            this.excel += '<tr>';
            for(var i=0; i<keys.length; i++) {
                this.excel += '<td>' + keys[i] + '</td>';
            }
            this.excel += '</tr>';
        }
        
        /**
         * @ngdoc function
         * @name DataTransformExcel.transform
         * @module angular.data.transform
         * @kind function
         * @description Transforms data into specific format
         * @param {json} data to transform
         * @returns {string}
         */
        this.transform = function(data){
             
            this.processHeader(data);
            
            //Body
            if(this.mapping == null){
                for (var i=0; i<data.length; i++) {
                    this.excel += '<tr>';
                    for(var cell in data[i]){
                        this.excel += '<td>' + data[i][cell] + '</td>';
                    }
                    this.excel += '</tr>';
                }
            }
            else{
                for (var i=0; i<data.length; i++) {
                    this.excel += '<tr>';
                    for(var j=0; j<this.mapping.length; j++){
                        this.excel += '<td>' + Object.byString(data[i], this.mapping[j].field) + '</td>';
                    }
                    this.excel += '</tr>';
                }
            }
					
            var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Angular Export Excel</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>";
            excelFile += this.excel;
            excelFile += "</table></body></html>";
            
            return excelFile;
        };
        
    }
    
    app.factory('dataExportExcelService', 
        function(){
            return new DataTransformExcel();
        }
    );
    
})();