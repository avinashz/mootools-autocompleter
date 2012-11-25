/*
Author: Avinash Zala (Expert Developer http://www.xpertdeveloper.com)
Help: http://www.xpertdeveloper.com

MooTools Auto Completer Class called aCompleter.

*/
var aCompleter = new Class({
	//implements
	Implements: [Options, Events],
	//options
	options: {
		// Declare you class variables here In below Pattern
		minimum_length:3,
		text_box_id: 'acompleter',
		url: 'ajax.php',
		result_holder_class : 'result_holder',
		result_class:'result',
		limit:'all',
		loading_div_class:'loading'
	},

	//initialization
	initialize: function(options) {
	    this.setOptions(options);
	    // this. setOption is a method which makes the class variable
	    //available to each function of the class using below pattern.
	    // Creating hoder and loading div.
	    this.create_blank_ele();
	    // Bind Events
	    this.bind_event();
	},
	create_blank_ele: function(){
		// Hack again. :)
		var $this= this;
		
		// Inserting the loading div. 
		var loading_div = new Element('div',{
			'class':$this.options.loading_div_class,
			'id':'completer_loading_div'
		});
		
		$$('body').adopt(loading_div);
		
		// Inserting the holder div.
		var result_holder_div = new Element('div',{
			'id':'completer_holder_div',
			'class':$this.options.result_holder_class
		});
		
		var result_container = new Element('ul',{
			'class':'result-div-ul',
			'id':'result-div-ul'
		});
		
		result_holder_div.adopt(result_container);
		
		$$('body').adopt(result_holder_div);	
		
	},
	bind_event: function(){
		if(document.id(this.options.text_box_id))
		{
			document.id(this.options.text_box_id).set('autocomplete','off');
			this.options.ele_exists = true;
			// Silly Hack for this ;) 
			var $this = this;
			// Silly Hack for this ;)
			
			document.id(this.options.text_box_id).addEvent('keyup', function(event){
				if(this.value.length >= $this.options.minimum_length)
				{
					$this.calling_now();
				}
				else
				{
					$this.hide_loading_image();
					$this.dispose_div();
				}
			});
		}
		else
		{
			this.options.ele_exists = false;
			alert('Element with ID: "'+ this.options.text_box_id + '" Not Found');
		}
		
	},
	calling_now: function(){
		// Hack again. :)
		var $this= this;
		var get_list = new Request({
				url : $this.options.url,
				link : 'cancel',
				method :'post',
				data:{'search_text':document.id($this.options.text_box_id).value, 'limit' : $this.options.limit},
				onRequest: function(){
					$this.show_loading_image();
				},
				onCancel: function(){
					$this.hide_loading_image();
					$this.dispose_div();
				},
				onFailure: function(){
					$this.hide_loading_image();
					$this.dispose_div();
				},
				onSuccess: function(responseText, responseXML){
					$this.hide_loading_image();
					$this.dispose_div();
					$this.load_result(responseText);
				}
		}).send();
		
		
	},
	show_loading_image: function()
	{
		// Show loading image on right side of the Text box.
		var points = document.id(this.options.text_box_id).getCoordinates();
		
		var left = parseInt(points.right)-parseInt(25);
		var top = parseInt(points.top)+parseInt(23);
		
		document.id('completer_loading_div').setStyles({
			'display':'block',
			'top':top,
			'left':left
		});
	},
	hide_loading_image: function(){
		document.id('completer_loading_div').setStyle('display','none');
	},
	dispose_div: function(){
		// Dispose the Result Div
		document.id('result-div-ul').innerHTML = '';
		document.id('completer_holder_div').setStyle('display','none');
	},
	load_result: function(response){
		// Load the returned results.
		
		// Hack again. :)
		var $this = this;
		
		var data = JSON.decode(response);
		document.id('result-div-ul').innerHTML = '';
		
		if(data.length>0)
		{
			data.each(function(el){
				var temp_li = new Element('li',{
					'class':$this.options.result_class
				});
				temp_li.innerHTML = '<a href="javascript:void(0);">'+el+'</a>';
				
				temp_li.addEvent('click', function(){
					document.id($this.options.text_box_id).value = el;
					$this.dispose_div();
				});
				
				document.id('result-div-ul').adopt(temp_li);
			});
		}
		else
		{
			var temp_li = new Element('li',{
				'class':$this.options.result_class
			});
			temp_li.innerHTML = '<a href="javascript:void(0);">No Results Found</a>';
			document.id('result-div-ul').adopt(temp_li);
		}
		
		
		var points = document.id(this.options.text_box_id).getCoordinates();
		
		document.id('completer_holder_div').setStyles({
			'display':'block',
			'top':points.bottom,
			'left':points.left
		});
		
	}
});

// Creating a Object of the Class
