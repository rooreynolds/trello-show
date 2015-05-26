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

function showCards(jsonURL, trelloKey, token, skipList, singleCardToShow) {
	var params = {};
	params['key'] = trelloKey;
	if (token) {
		params['token'] = token;
	}
	$.getJSON(jsonURL, params, function(data) {
	   if (! singleCardToShow) { // don't show the board name if we're only showing one card
	      $('#board').append($("<h1>", {text: data.name})); //board name
	   }

	   var lists_table = make_lists_table(data); // lookup table of lists (ie Trello columns)
	   var checklists_table = make_checklists_table(data); // lookup table of checklists

	   for (card_index in data.cards) {
	      card = data.cards[card_index];
	      if(card.closed || lists_table[card.idList].name == skipList) {
	         //this card is closed or is a skippable list. Don't show it.
	      } else if (singleCardToShow && card.name != singleCardToShow) {
	         // only showing one card, and this isn't it. Don't show it.
	      } else {
	         var carddiv = $("<div>", {class: 'card'});
	         carddiv.append($("<h2>", {text: card.name, id: card.name.replace(/\s/g,'-').toLowerCase()}));
	         carddiv.append($("<div>", {class: 'description', html: marked(card.desc)}));
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
	     	 carddiv.append(checklistsdiv);
	         var metadiv = $("<div>", {class: 'meta'});
	         var labelsdiv = $("<ul>", {class: 'labellist'});
	         for (label in  card.labels) {
	            labelsdiv.append($("<li>", {class: 'label ' + card.labels[label].color, text: card.labels[label].name}));
	         }
	         metadiv.append(labelsdiv);
	         metadiv.append($("<p>", {class: 'list-name', text: (lists_table[card.idList].name)})); 
	         metadiv.append($("<a>", {class: 'card-url', href: card.url, text: card.url})); 
	         carddiv.append(metadiv);
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
	var params = {};
	var column_list = [];
	params['key'] = trelloKey;
	if (token) {
		params['token'] = token;
	}
	$('#board').append($("<h1>", {text: "Boards"})); //board name
	$.getJSON(jsonURL, params, function(data) {
	   var lists_table = make_lists_table(data); // lookup table of lists (ie Trello columns)	   
	   for (column in lists_table) {
	   		var carddiv = $("<div>", {class: 'card'});
	   		var link = $("<a>", {href: "?showList=" + encodeURIComponent(lists_table[column].name) + "&board=" + board + (trelloKey ? "&trelloKey=" + trelloKey : "") + (token ? "&token=" + token : "")});
	   		var h2 = $("<h2>", {text: lists_table[column].name, id: lists_table[column].name.replace(/\s/g,'-').toLowerCase()});
	    	link.append(h2);
	    	carddiv.append(link);
	    	$('#board').append(carddiv);     
	   }
	})
}

function showTitles(jsonURL, trelloKey, token, showList) {
	if (showList) {
		$('#board').append($("<h1>", {text: showList})); //board name
	}
	var params = {};
	params['key'] = trelloKey;
	if (token) {
		params['token'] = token;
	}
	$.getJSON(jsonURL, params, function(data) {
	   var lists_table = make_lists_table(data); // lookup table of lists (ie Trello columns)
	   for (card_index in data.cards) {
	      card = data.cards[card_index];
	      if(card.closed) {
	         //this card is closed. Don't show it.
	      } else if (showList && lists_table[card.idList].name != showList) {
		    //this card is not on the showList list. Don't show it.
	      } else {
	         var carddiv = $("<div>", {class: 'card'});
	         carddiv.append($("<h2>", {text: card.name, id: card.name.replace(/\s/g,'-').toLowerCase()}));
	         //carddiv.append($("<div>", {class: 'description', html: marked(card.desc)}));
	         var metadiv = $("<div>", {class: 'meta'});
	         metadiv.append($("<a>", {class: 'card-url', href: card.url, text: card.url})); 
	         carddiv.append(metadiv);
	         $('#board').append(carddiv);
	      }
	  }
	})
}
