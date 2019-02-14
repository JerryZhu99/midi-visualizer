
const MIN_NOTE = 21;
const MAX_NOTE = 108;

const sharpNames = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
const flatNames = ['A', 'B♭', 'B', 'C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭'];
const noteToString = (note, preferFlats) => {
  let number = Math.floor((note - 24) / 12) + 1 // C1 is 24;
  let nameIndex = (note - 21) % 12;
  let name = sharpNames[nameIndex];
  return `${name}${number}`;
}

const blackKeys = [1, 4, 6, 9, 11];
const isBlackKey = (note) => {
  let index = (note - 21) % 12;
  return (blackKeys.includes(index));
}

let keyElements = [];


const getMIDIMessage = (message) => {
  const command = message.data[0];
  const note = message.data[1];
  const velocity = (message.data.length > 2) ? message.data[2] : 0; // a velocity value might not be included with a noteOff command

  switch (command) {
    case 144: // noteOn
      if (velocity > 0) {
        console.log(noteToString(note), velocity)
        keyElements[note].classList.add("active")
      } else {
        console.log(note, 'on?');
      }
      break;
    case 128: // noteOff
      keyElements[note].classList.remove("active");
      console.log(noteToString(note), "off");
      break;
  }
}



(async () => {
  let midiAccess;
  try {
    midiAccess = await navigator.requestMIDIAccess();
  } catch (e) {
    console.error('Could not access MIDI Devices')
  }

  let keyboardElement = document.querySelector('.keyboard');
  for (let i = MIN_NOTE; i <= MAX_NOTE; i++) {
    let keyElement = document.createElement('div');
    keyElement.classList.add(isBlackKey(i) ? "black" : "white");
    keyboardElement.appendChild(keyElement);
    keyElements[i] = keyElement;
  }

  midiAccess.inputs.forEach(input => {
    input.addEventListener('midimessage', getMIDIMessage);
  });
})();
