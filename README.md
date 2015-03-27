# trello-show

Show the cards from a Trello board in order, with basic formatting.

For each card, displays

- title
- description
- column title
- any labels
- checklist
- URL


###Use

Could be a useful starting point for styling Trello cards in a helpful way eg for displaying on a big screen, printing, etc.

###Parameters

You can pass optional parameters

- ```board``` the ID of the trello board to use. eg https://trello.com/b/*{this bit}*
- ```key``` your [Trello API key](https://trello.com/docs/gettingstarted/)
- ```skip``` the name of a column you want to exclude from being displayed

eg 

```index.html?board=bvLhgd6L&key=YOUR_KEY&skip=New```

###Defaults 

1. Set the default [```key```](https://github.com/rooreynolds/trello-show/blob/master/index.html#L15) in [the example script](in https://github.com/rooreynolds/trello-show/blob/master/index.html) to be your own [Trello API key](https://trello.com/docs/gettingstarted/) rather than the placeholder '```YOUR_KEY```'
2. The [```board```](https://github.com/rooreynolds/trello-show/blob/master/index.html#L16) parameter defaults to one of my boards. You'll want to set to match your own Trello board
3. If you want to exclude a column, change the default [```skip```](https://github.com/rooreynolds/trello-show/blob/master/index.html#L17) parameter to match the title of the column you want to exlude.

###Limitations

So far: 

- only supports useful formatting of Green, Yellow, Orange and Red labels
- only shows the first checklist in the card


