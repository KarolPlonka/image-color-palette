import { useState } from 'react';
import './styles/App.css';
import 'react-tooltip/dist/react-tooltip.css'

// components
import Banner from './components/Banner';
import Canvas from './components/Canvas'; 
import ControlRow from './components/Controls';
import PaletteDsiplay from './components/PaletteDisplay';

// utils
import PaletteColor from './utils/PaletteColor';

// logo
import logo from './logo.png';

const minColorCount: number = 1;
const maxColorCount: number = 16;

const minAcceleration: number = 1;
const maxAcceleration: number = 8;

const accelerationTip: string | undefined = `
  Acceleration variable will reduce the duration of the algorithm,
  but it will also reduce the accuracy of the results.
  
  When set to 1, the algorithm will check every pixel of the image. 
  When set to 2, it will check every second pixel, and so on.
`

function App() {
  const [colorCount, setColorCount] = useState<number>(3);
  const [acceleration, setAcceleration] = useState<number>(1);
  const [palette, setPalette] = useState<PaletteColor[]>([]);

  return (
    <div className="App">
      <Banner
        title = "Exctract Colors From Image"
        logo = { logo }
        homeLink = "https://karolplonka.github.io/image-color-palette/"
        githubLink = "github.com/KarolPlonka/image-color-palette"
      />

      <div className='column-wrapper'>
        <div className='column'>

          <Canvas
            colorCount = { colorCount }
            acceleration = { acceleration }
            setPalette = { setPalette }
          />

          <table className="controls-container" >
            <tbody>
              <ControlRow 
                title = {" Colors" }
                value = { colorCount }
                setValue = { setColorCount }
                min = { minColorCount }
                max = { maxColorCount }
              />
              <ControlRow
                title = { "Acceleration" }
                value = { acceleration }
                setValue = { setAcceleration }
                min = { minAcceleration }
                max = { maxAcceleration }
                tooltip = { accelerationTip?.toString() }
              />
            </tbody>
          </table>

        </div>

        <div className='column' id="palete-display-column">
          <PaletteDsiplay palette={palette} acc={acceleration} />
        </div>
        
      </div>
    </div>
  );
}

export default App;
