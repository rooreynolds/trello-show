function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.href);
  if(results == null) {
    return false;
  } else {
    return decodeURIComponent(results[1].replace(/\+/g, " "));
  }
}

function convertToSlug(text) {
    return text.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
}


function make_lists_table(data) { // create a table of Trello columns 
   var lists_table = {};
   for (list_index in data.lists) {
      list = data.lists[list_index];
      if (! list.closed) {
         lists_table[list.id] = list;
      }
   }
   return lists_table;
}

function make_checklists_table(data) { // create a table of Checklists
   var checklists_table = {};
   for (checklist_index in data.checklists) {
      checklist = data.checklists[checklist_index];
      checklists_table[checklist.id] = checklist;
   }
   return checklists_table;
}

function moveSectionToNewDiv(sourceDivID, newDivClass) {
   $(".description").find(sourceDivID).each(function() { 
      var following_para = $(this).next();
      var nowdiv = $("<div>", {class: newDivClass});
      $(this).parent().prepend(nowdiv);
      $(this).appendTo(nowdiv);
      following_para.appendTo(nowdiv);
   });
}

function showCards(board, jsonURL, trelloKey, token, showList) {
	if (showList) {
	   var breadcrumb = $("<ul>", {class:'breadcrumb'});
	   breadcrumb.append("<li><a href='?board=" + board + (trelloKey ? "&trelloKey=" + trelloKey : "") + (token ? "&token=" + token : "") + "'>" + "Home" + "</a></li>");
	   breadcrumb.append($("<li>", {class:'active', text:showList})); // list name
	   $('#board').append(breadcrumb);
	}
	var params = {};
	params['key'] = trelloKey;
	if (token) {
		params['token'] = token;
	}
	$.getJSON(jsonURL, params, function(data) {
	   var lists_table = make_lists_table(data); // lookup table of lists (ie Trello columns)
	   var checklists_table = make_checklists_table(data); // lookup table of checklists

	   for (card_index in data.cards) {
	      card = data.cards[card_index];
	      if(card.closed) {
	         //this card is closed. Don't show it.
	      } else if (showList && lists_table[card.idList].name != showList) {
		    //this card is not on the showList list. Don't show it.
	      } else {
	      	 var cardname = card.name;
	      	 var cardid = convertToSlug(card.name);
	         var carddiv = $("<div>", {class: 'card panel panel-default panel-collapsible'});
	         var panelhead = $("<div>", {class: 'panel-heading collapsed', 'data-toggle': 'collapse', 'data-target': "#" + cardid});
	         panelhead.append($("<h4>", {class: "panel-title", text: cardname}));
	         carddiv.append(panelhead);
	         var panel = $("<div>", {id: cardid, class: 'panel-collapse collapse'});
			 var panelbody = $("<div>", {class: 'panel-body'});

	         panelbody.append($("<p>", {class: 'board-name', html: marked(card.desc)}));
	         
	         var checklistsdiv = $("<div>", {class: 'checklists'});
	         var arrayOfChecklists = [];
	         for (checklistindex in card.idChecklists) {
		         var checklist = checklists_table[card.idChecklists[checklistindex]]; //show the first checklist, if there is one
		         var checklistdiv = $("<div>", {class: 'checklist'});
		         if (checklist) { 
		            checklistdiv.append($("<h3>", {class: 'checklist-name', text: checklist.name}));
		            var checklistul = $("<ul>", { class: 'checklist'});
		            var items_list = [];
		            for (item_index in checklist.checkItems) {
		               item = checklist.checkItems[item_index];
		               items_list.push([item.pos, item]); //key on item 'pos' value
		            }
		            items_list.sort(function (a, b) { return a[0] - b[0] }); //sort checklist items in list based on item position
		            for (item_index in items_list) { // get each list item in order
		               item = items_list[item_index][1];
		               checklistul.append($("<li>", {class: item.state, html: marked(item.name)}));
		            }
		            checklistdiv.append(checklistul);
		            arrayOfChecklists.push([checklist.pos, checklistdiv]); // key on checklist 'pos' value
		         }
	     	 }
	     	 arrayOfChecklists.sort(function (a, b) { return a[0] - b[0] }); //sort checklists based on checklist postition
	     	 for (orderedDivIndex in arrayOfChecklists) { // get each list in order
	     	 	orderedDiv = arrayOfChecklists[orderedDivIndex][1];
	     	 	checklistsdiv.append(orderedDiv);
	     	 }
	     	 panelbody.append(checklistsdiv);
	     	 
	     	 carddiv.append(panelbody);
	         var metadiv = $("<div>", {class: 'meta'});
	         var labelsdiv = $("<ul>", {class: 'labellist'});
	         for (label in  card.labels) {
	            labelsdiv.append($("<span>", {class: 'badge ' + card.labels[label].color, text: card.labels[label].name}));
	         }
	         metadiv.append(labelsdiv);
	         metadiv.append($("<a>", {class: 'card-url', href: card.url, text: card.url})); 
	         panelbody.append(metadiv);
	         
	         panel.append(panelbody);
	         carddiv.append(panel);
	         $('#board').append(carddiv);
	      }
	  }
	  var hash = window.location.hash; 
	  if (hash) { // did we have a # in the URL?
	  	location.href = hash; //ensure we jump to it once it's there
	  }
	  moveSectionToNewDiv("#future-vision", 'future'); // create a new div for 'future'
	  moveSectionToNewDiv("#now-challenge", 'now'); // create a new div for 'now'
	})
}

function listColumns(board, jsonURL, trelloKey, token) {
	var breadcrumb = $("<ul>", {class:'breadcrumb'});
    breadcrumb.append("<li class='active'>" + "Home" + "</li>");
    $('#board').append(breadcrumb);
	var params = {};
	var column_list = [];
	params['key'] = trelloKey;
	if (token) {
		params['token'] = token;
	}

    var listgroup = $("<ul>", {class:'list-group'});

	$.getJSON(jsonURL, params, function(data) {
	   var lists_table = make_lists_table(data); // lookup table of lists (ie Trello columns)	   
	   for (column in lists_table) {
	   		var listgroupitem = $("<li>", {class: 'list-group-item'});
	   		var link = $("<a>", {href: "?showList=" + encodeURIComponent(lists_table[column].name) + "&board=" + board + (trelloKey ? "&trelloKey=" + trelloKey : "") + (token ? "&token=" + token : "")});
	   		var heading = $("<h4>", {text: lists_table[column].name, id: lists_table[column].name.replace(/\s/g,'-').toLowerCase()});
	    	link.append(heading);
	    	//listgroupitem.append($("<span>", {class: 'badge', text: 14})); //TODO: badge with size of list?
	    	listgroupitem.append(link);
	    	listgroup.append(listgroupitem);
	   }
	   $('#board').append(listgroup);
	})
}
