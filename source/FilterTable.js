/*
---
description: MooTools Plugin for filtering table rows.

authors:
 - Adrian Statescu (http://thinkphp.ro)
 - Matti Schneider-Ghibaudo (http://mattischneider.fr)

license:
 - MIT-style license

requires:
 core/1.3: '*'

provides:
 - [FilterTable]
...
*/

var FilterTable = new Class({

    /* Implements options */
    Implements: Options,

    /* Set options */
    options: {
    	/**CSS class name of tables on which a filter should be added.
    	*Set to false if all tables, whatever their classes, should be matched.
    	*/
         filterClass: 'filterable'
    },

    /* 
     * Constructor of class.
     * @public    
     */
    initialize: function(options){
        this.setOptions(options);
        
        //get all the filterable tables from document 
        var tables = document.getElements('table' + (this.options.filterClass ? '.' + this.options.filterClass : ''));
        
        //loop through each table
        tables.each(function(table,index){
        	// create the filter input
            var form = new Element('form', {
            	'class': 'filter',
            	id: 'form_'+ index
            });

            var input = new Element('input', {
                'class': 'filter',
                id: 'filter_'+ index
            });
            
            // DOM
            form.appendChild(input);
            table.parentNode.insertBefore(form, table);

            // attach
            var boundFilter = this.filterTable.bind(this, [input, table]);
            input.addEvent('keyup', boundFilter);
            input.addEvent('click', boundFilter);
        }, this);
    },

    /* 
     * @param term (Element)
     * @param table (Element)
     * @public
     */
    filterTable: function(term, table) {
         //split by space the search terms
         var terms = term.value.toLowerCase().split(' ');
         //for each row of table execute
         for (var r = 0, m = table.rows.length; r < m; r++) {
             var display = '';
             //for each term do
             for (var i = 0, j = terms.length; i < j; i++) {
                 //strips all tags from row, then test if the 
                 //row contains or not the appropriate filter term.
                 if (table.rows[r].innerHTML.replace(/<[^>]+>/g, "").toLowerCase().indexOf(terms[i]) < 0) {
                    display = 'none';
                }
                 //display the row
                table.rows[r].style.display = display;
             }
        }
    }
});
