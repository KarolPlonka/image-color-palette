import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { getImagePalette } from './imagePaletteExctractor'
import { Upload } from 'react-feather';
import PaletteDsiplay, {PaletteColor} from './components/PaletteDisplay';

// example display images
import react from './images/react.svg'
import github from './images/github.webp'
import bird from './images/bird.bmp'
const exampleImages = [react, github, bird];

function getGradeintString(palette: PaletteColor[]) {
  if(palette.length === 0) return '#000';

  if(palette.length === 1) return `rgb(${palette[0].r}, ${palette[0].g}, ${palette[0].b})`;

  let gradientString = 'linear-gradient(to bottom right';
  for (let i = 0; i < palette.length; i++) {
    gradientString += `,rgb(
      ${palette[i].r},
      ${palette[i].g},
      ${palette[i].b}
    )`;
  }
  gradientString+=')';
  return gradientString;
}


function App() {
  const [image, setImage] = useState<string>(exampleImages[0]);
  const [isImageUploaded, setIsImageUploaded] = useState<boolean>(false);
  const [colorCount, setColorCount] = useState<number>(3);
  const [acceleration, setAcceleration] = useState<number>(1);
  const [palette, setPalette] = useState<PaletteColor[]>([]);
  const [isHoveringAtCanvas, setIsHoveringAtCanvas] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [exampleImageIndex, setExampleImageIndex] = useState<number>(1);
  const [gradient, setGradient] = useState<string>('');

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result as string);
      setIsImageUploaded(true);
    };

    if(file) reader.readAsDataURL(file);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;

    const img = new Image();
    img.src = image;

    img.onload = () => {
      canvas.height = 250;
      canvas.width = img.width * (canvas.height / img.height);
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
      const paletteArray = getImagePalette(imageData, acceleration, colorCount);

      const newPalette:PaletteColor[] = paletteArray.map((color) => ({
        r: color.r,
        g: color.g,
        b: color.b,
        count: color.count
      }));

      const gradientString = getGradeintString(newPalette);
      setGradient(gradientString);
      setPalette(newPalette);
    };
  }, [canvasRef, image, colorCount, acceleration]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isHoveringAtCanvas) canvas.style.opacity = "0.2";
    else                    canvas.style.opacity = "1";

  }, [canvasRef, isHoveringAtCanvas]);

  useEffect(() => {
    const interval = setInterval(() => {
      if(!isImageUploaded){
        setImage(exampleImages[exampleImageIndex]);
        setExampleImageIndex((exampleImageIndex + 1) % exampleImages.length);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [exampleImageIndex, isImageUploaded]);


  return (
    <div className="App">
      <header className="App-header">
        <div className='column'>
          <div
            className="canvas-wrapper"
            style = {{background: gradient}}
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

            {(!isImageUploaded) && <div className="canvas-overlay"/>}

            {
              (isHoveringAtCanvas || !isImageUploaded) &&
                <label htmlFor="image-selector" className="file-input-label">
                  <Upload size={18} className='upload-icon' />
                  <span>Choose an Image</span>
                </label>
            }

          </div>

          <div className='controls-container'>
            <div className='control colors-amount-control'>
              <label htmlFor="color-count">Colors: </label>
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
