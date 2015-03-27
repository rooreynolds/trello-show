# trello-show

Show the cards from a Trello board in order, with basic formatting.

For each card, displays

- title
- description
- column title
- any labels
- checklist
- URL

Renders sematic (but brutally simple) HTML like this

<a href="https://www.flickr.com/photos/rooreynolds/16327528343" title="trello-show example 1 by Roo Reynolds, on Flickr"><img src="https://farm8.staticflickr.com/7282/16327528343_b0abf80f97.jpg" width="500" height="432" alt="trello-show example 1"></a>

and this

<a href="https://www.flickr.com/photos/rooreynolds/16761378669" title="trello-show example 2 by Roo Reynolds, on Flickr"><img src="https://farm8.staticflickr.com/7605/16761378669_30f620266f.jpg" width="499" height="500" alt="trello-show example 2"></a>

from Trello boards like this

<a href="https://www.flickr.com/photos/rooreynolds/16313976614" title="Trello example by Roo Reynolds, on Flickr"><img src="https://farm9.staticflickr.com/8733/16313976614_75db70aec9.jpg" width="500" height="246" alt="Trello example"></a>

###Try it

http://rooreynolds.github.io/trello-show


###Parameters

You can pass optional parameters

- ```board``` the ID of the trello board to use. eg ```trello.com/b/*{this bit}*```
- ```key``` your [Trello API key](https://trello.com/docs/gettingstarted/)
- ```skip``` the name of a column you want to exclude from being displayed

eg `http://rooreynolds.github.io/trello-show?board=YOUR_BOARD&key=YOUR_KEY&skip=New`

###Defaults 

1. Set the default [```key```](https://github.com/rooreynolds/trello-show/blob/master/index.html#L15) in [the example script](in https://github.com/rooreynolds/trello-show/blob/master/index.html) to be your own [Trello API key](https://trello.com/docs/gettingstarted/) rather than the placeholder '```YOUR_KEY```'
2. The [```board```](https://github.com/rooreynolds/trello-show/blob/master/index.html#L16) parameter defaults to one of my boards. You'll want to set to match your own Trello board
3. If you want to exclude a column, change the default [```skip```](https://github.com/rooreynolds/trello-show/blob/master/index.html#L17) parameter to match the title of the column you want to exlude.

###Limitations

So far: 

- only supports useful formatting of Green, Yellow, Orange and Red labels
- only shows the first checklist in the card


