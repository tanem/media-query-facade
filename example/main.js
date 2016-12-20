import MQFacade from '../src/media-query-facade'

const mq = new MQFacade({
  small: 'only screen and (max-width: 480px)',
  medium: 'only screen and (min-width: 480px) and (max-width: 720px)'
})

const changeColour = colour => () => {
  document.body.style.backgroundColor = colour
}

mq.on('small', changeColour('blue'))
mq.on('medium', changeColour('green'))
mq.on('only screen and (min-width: 720px)', changeColour('red'))
