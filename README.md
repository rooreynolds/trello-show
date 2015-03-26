# trello-show

Show the cards from a Trello board in order, with basic formatting.

For each card, displays

- title
- description
- column title
- any labels
- checklist
- URL

Renders sematic (but currently brutally simple) HTML like this

<a href="https://www.flickr.com/photos/rooreynolds/16936378375" title="trello-show example by Roo Reynolds, on Flickr"><img src="https://farm8.staticflickr.com/7637/16936378375_bc07fe2d53.jpg" width="391" height="500" alt="trello-show example"></a>

and this

<a href="https://www.flickr.com/photos/rooreynolds/16935404551" title="trello-show example by Roo Reynolds, on Flickr"><img src="https://farm9.staticflickr.com/8736/16935404551_0c47234962.jpg" width="423" height="500" alt="trello-show example"></a>

from Trello boards like this

<a href="https://www.flickr.com/photos/rooreynolds/16313976614" title="Trello example by Roo Reynolds, on Flickr"><img src="https://farm9.staticflickr.com/8733/16313976614_75db70aec9.jpg" width="500" height="246" alt="Trello example"></a>

###Use

Could be a useful starting point for styling Trello cards in a helpful way eg for displaying on a big screen, printing, etc.

###Setup 

1. Set [```trello key```](https://github.com/rooreynolds/trello-show/blob/master/index.html#L16) in [the example script](in https://github.com/rooreynolds/trello-show/blob/master/index.html) to be your own [Trello API key](https://trello.com/docs/gettingstarted/)
2. Change the [```jsonURL```](https://github.com/rooreynolds/trello-show/blob/master/index.html#L17) to match your own Trello board
3. If you want to exclude a column, change [```skip_list```](https://github.com/rooreynolds/trello-show/blob/master/index.html#L18) to match the title of the column you want to exlude.

###Limitations

So far: 

- only supports useful formatting of Green, Yellow, Orange and Red labels
- only shows the first checklist in the card


