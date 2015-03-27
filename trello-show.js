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

function showCards(jsonURL) {
	$.getJSON(jsonURL, {key:trello_key}, function(data) {
	   $('#board').append($("<h1>", {text: data.name})); //board name

	   var lists_table = make_lists_table(data); // lookup table of lists (ie Trello columns)
	   var checklists_table = make_checklists_table(data); // lookup table of checklists

	   for (card_index in data.cards) {
	      card = data.cards[card_index];
	      if(card.closed || lists_table[card.idList].name == skip_list) {
	         //this card is closed or is a skippable list. Don't show it.
	      } else {
	         var carddiv = $("<div>", {class: 'card'});
	         carddiv.append($("<h2>", {text: card.name}));
	         carddiv.append($("<div>", {class: 'description', html: marked(card.desc)}));
	         var checklist = checklists_table[card.idChecklists[0]]; //show the first checklist, if there is one
	         if (checklist) { 
	            var checklistdiv = $("<div>", {class: 'checklist'});
	            checklistdiv.append($("<h3>", {class: 'checklist-name', text: checklist.name}));
	            var checklistul = $("<ul>", { class: 'checklist'});
	            var items_list = [];
	            for (item_index in checklist.checkItems) {
	               item = checklist.checkItems[item_index];
	               items_list.push([item.pos, item]); //key on item 'pos' value
	            }
	            items_list.sort(function (a, b) { return a[0] - b[0] }); //sort based on item position
	            for (item_index in items_list) {
	               item = items_list[item_index][1];
	               checklistul.append($("<li>", {class: item.state, text: item.name}));
	            }
	            checklistdiv.append(checklistul);
	            carddiv.append(checklistdiv);
	         }
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
	  $(".description").find("#now-challenge").each(function() { 
	    var following_para = $(this).next();
	    var nowdiv = $("<div>", {class: 'now'});
	    $(this).parent().prepend(nowdiv);
	    $(this).appendTo(nowdiv);
	    following_para.appendTo(nowdiv);
	  });
	  $(".description").find("#future-vision").each(function() { 
	    var following_para = $(this).next();
	    var futurediv = $("<div>", {class: 'future'});
	    $(this).parent().prepend(futurediv);
	    $(this).appendTo(futurediv);
	    following_para.appendTo(futurediv);
	  });
	})
}