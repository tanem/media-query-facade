var MQFacade = require('../lib/media-query-facade');

var mq = new MQFacade({
  small: 'only screen and (max-width: 480px)',
  medium: 'only screen and (min-width: 480px) and (max-width: 720px)'
});

mq.on('small', changeColour('blue'));
mq.on('medium', changeColour('green'));
mq.on('only screen and (min-width: 720px)', changeColour('red'));

function changeColour(colour){
  return function(){
    document.body.style.backgroundColor = colour;
  };
}