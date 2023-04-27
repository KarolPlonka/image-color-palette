import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { getImagePalette } from './imagePaletteExctractor'
import { Upload } from 'react-feather';
import PaletteDsiplay, {PaletteColor} from './components/PaletteDisplay';

function App() {
  const [image, setImage] = useState<string>("");
  const [colorCount, setColorCount] = useState<number>(3);
  const [acceleration, setAcceleration] = useState<number>(1);
  const [palette, setPalette] = useState<PaletteColor[]>([]);
  const [isHoveringAtCanvas, setIsHoveringAtCanvas] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result as string);
    };

    if(file) reader.readAsDataURL(file);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context ) return;

    const img = new Image();
    img.src = image;

    img.onload = () => {
      canvas.height = 350;
      canvas.width = img.width * (canvas.height / img.height);
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
      const paletteArray = getImagePalette(imageData, acceleration, colorCount);

      // const newPalette:PaletteColor[] = [];
      // paletteArray.forEach((color) => {
      //   const newPaletteColor:PaletteColor = {
      //     r: color.r,
      //     g: color.g,
      //     b: color.b,
      //     count: color.count
      //   };
      //   newPalette.push(newPaletteColor);
      // });
      const newPalette:PaletteColor[] = paletteArray.map((color) => ({
        r: color.r,
        g: color.g,
        b: color.b,
        count: color.count
      }));

      setPalette(newPalette);
      console.log(newPalette);
    };
  }, [canvasRef, image, colorCount, acceleration]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isHoveringAtCanvas) {
      canvas.style.opacity = "0.2";
      canvas.style.transition = "opacity 0.5s";
    } else {
      canvas.style.opacity = "1";
      canvas.style.transition = "opacity 0.5s";
    }

  }, [canvasRef, isHoveringAtCanvas]);


  return (
    <div className="App">
      <header className="App-header">
        <div className='column'>
          <div
            className="canvas-wrapper"
            onMouseEnter={() => setIsHoveringAtCanvas(true)}
            onMouseLeave={() => setIsHoveringAtCanvas(false)}
          >
            <canvas id="imageDisplay" ref={canvasRef} />

            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              id="image-selector"
            />

            {(isHoveringAtCanvas || !image) &&
              <label htmlFor="image-selector" className="file-input-label">
                <Upload size={18} className='upload-icon' />
                <span>Choose an Image</span>
              </label>}

          </div>

          <div className='controls-container'>
            <div className='control colors-amount-control'>
              <label htmlFor="color-count">Number of Colors: </label>
              <input
                type="number"
                min="1" max="16"
                defaultValue={colorCount}
                onChange={(event) => {setColorCount(parseInt(event.target.value))}}
              />
            </div>
            <div className='control acceleration-control'>
              <label htmlFor="color-count">Acceleration: </label>
              <input
                type="number"
                min="1" max="8"
                defaultValue={acceleration}
                onChange={(event) => {setAcceleration(parseInt(event.target.value)) }}
              />
            </div>
          </div>
        </div>

        <div className='column' id="palete-display-column">
          <PaletteDsiplay palette={palette} acc = {acceleration}/>
        </div>
      </header>
    </div>
  );
}

export default App;
