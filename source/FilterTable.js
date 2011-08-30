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
		filterClass: 'filterable',
		
		/**Input placeholder.
		*/
		placeholder: 'Filter…',
		
		/**Regexp options.
		*/
		match: {
			/**Allow regexp input or not?
			*/
			regexp: true,
			/**RegExp match flags.
			*Defaults to 'i' (case-insensitive)
			*/
			flags: 'i',
			/**A character upon which terms are considered to be "OR" joined.
			*Set to false to consider search terms to be expressions (no splitting).
			*Defaults to false.
			*Example:
			*	| search expression | separator | "to be" | "not to" | "be not" |
			*	|     "be not"      |    ' '    | matched |  matched |  matched |
			*	|     "be not"      |   false   |no match | no match |  matched |
			*/
			separator: false
		}
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
			var input = new Element('input', {
				type: 'search',
				'class': 'filter',
				id: 'filter_'+ index,
				placeholder: this.options.placeholder
			});
			
			var form = new Element('form', {
				'class': 'filter',
				id: 'form_'+ index
			}).grab(input).inject(table, 'before');
			
			form.addEvent('submit', function() { return false }); // prevent submitting (page reload) on pressing "enter"

			// attach
			var boundFilter = this.filterTable.pass([input, table], this);
			input.addEvent('keyup', boundFilter);
			input.addEvent('click', boundFilter);
		}, this);
	},

	/* 
	* @param term (Element)
	* @param table (Element)
	* @public
	*/
	filterTable: function(input, table) {
		var regexp = input.get('value')
						  .trim(); // avoid that a space at the end matches all
						
		if (! this.options.match.regexp)
			regexp = regexp.escapeRegExp();
			
		if (this.options.match.separator)
			regexp = regexp.split(this.options.match.separator)
							.join('|'); // each word is a different match
		
		//create a compiled regexp from search terms for performance
		regexp = new RegExp(regexp, this.options.match.flags);
		
		//for each row of table execute
		table.getElements('tbody tr').each(function(tr) {
			tr.setStyle('display',
				(tr.get('text').match(regexp)
					? ''
					: 'none'
				)
			);
		});
	}
});
