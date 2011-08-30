/*
---
description: MooTools Plugin for filtering table rows.

authors:
  - Adrian Statescu (http://thinkphp.ro)

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
       filterClass: 'filterable'
    },

    /* 
     * Constructor of class.
     * @public    
     */
    initialize: function(options){
          this.setOptions(options); 
          //get all the tables from document 
          var tables = document.getElements('table');
          //loop through each table
          tables.each(function(table,index){
               //if current table has attribute 'class' and if 
               //the value of class is options.filterClass 
               if (table.attributes['class'] && table.hasClass(this.options.filterClass)) {
                   //creates a new form with following attributes
                   var form = new Element('form',{'class': 'filter',id: 'form_'+ index});
                   //creates a new input with these attributes
	          	 var input = new Element('input',{'class': 'filter',id: 'filter_'+ index});
                       //added handler event keyup for this input; 
                       //when the input is keyup then the method 
                       //filterTable is triggered
                       input.addEvent('keyup', function(){
                             this.filterTable(input, table);
                   }.bind(this));
                   //append element input in form
                   form.appendChild(input);
                   //insert the form before table
	  	       table.parentNode.insertBefore(form, table);
	         }
          },this);
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
