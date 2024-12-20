import '../src/utils/datePrototype.js';
import { createLayout } from './ui/layout.js';
import { handleInput } from './ui/inputHandler.js';
import { authorize, initializeCalendars, initializeEvents } from './services/calendarService.js';
import { editEvent } from './commands/edit.js';

export async function runApp() {
  console.log('Running app ...');
  const auth = await authorize();
  const calendars = await initializeCalendars(auth);
  var events = await initializeEvents(auth, calendars);
  events.sort((a, b) => a.start - b.start);
  const { screen, inputBox, keypressListener } = createLayout(calendars, events);
  const leftTable = screen.children.find(child => child.options.label === 'Upcoming Events');

  inputBox.on('submit', (value) => {
    handleInput(auth, value, screen, calendars, events, keypressListener);
    inputBox.clearValue();
    inputBox.hide();
    screen.render();
  });

  inputBox.key(['escape'], () => {
    inputBox.hide();
    screen.render();
  });

  leftTable.on('select', (item, index) => {
    editEvent(auth, screen, calendars, index, events);
  });


  screen.key(['q', 'C-c'], () => process.exit(0));
  screen.render();
}
