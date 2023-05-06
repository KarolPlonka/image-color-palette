import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { getImagePalette } from './imagePaletteExctractor'
import { Upload } from 'react-feather';
import PaletteDsiplay, { PaletteColor } from './components/PaletteDisplay';
import { GitHub, Info } from 'react-feather';
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'

// logo
import logo from './logo.png';

// example display images
import react from './images/react.svg'
import github from './images/github.webp'
import bird from './images/bird.bmp'
const exampleImages = [react, github, bird];

function getGradeintString(palette: PaletteColor[]) {
  if (palette.length === 0) return '#000';

  if (palette.length === 1) return `rgb(${palette[0].r}, ${palette[0].g}, ${palette[0].b})`;

  let gradientString = 'linear-gradient(to bottom right';
  for (let i = 0; i < palette.length; i++) {
    gradientString += `,rgb(
      ${palette[i].r},
      ${palette[i].g},
      ${palette[i].b}
    )`;
  }
  gradientString += ')';
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
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result as string);
      setIsImageUploaded(true);
    };

    if (file) reader.readAsDataURL(file);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasWrapper = canvasWrapperRef.current;
    if (!canvas || !image || !canvasWrapper) return;

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;

    const img = new Image();
    img.src = image;

    img.onload = () => {
      // adjust canvas size to image size
      if(img.width - canvas.width > img.height - canvas.height) {
        canvas.height = img.height * (canvas.width / img.width);
      }
      else {
        canvas.width = img.width * (canvas.height / img.height);
      }

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
      const paletteArray = getImagePalette(imageData, acceleration, colorCount);

      const newPalette: PaletteColor[] = paletteArray.map((color) => ({
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
    else canvas.style.opacity = "1";

  }, [canvasRef, isHoveringAtCanvas]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isImageUploaded) {
        setImage(exampleImages[exampleImageIndex]);
        setExampleImageIndex((exampleImageIndex + 1) % exampleImages.length);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [exampleImageIndex, isImageUploaded]);

  const handleColorCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) return;
    setColorCount(parseInt(event.target.value));
  };

  const handleAccelerationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) return;
    setAcceleration(parseInt(event.target.value));
  };

  return (
    <div className="App">
      <div className='menu'>
          <div className='menu-left'>
            <a href='https://karolplonka.github.io/image-color-palette/'>
              <div className='title-wrapper'>
              <img src={logo} alt='logo' className='logo' />
              <h1>Image Color Palette Exctractor</h1>
              </div>
            </a>
          </div>
          <div className='menu-right'>
            <a href="https://github.com/KarolPlonka/image-color-palette" target="_blank" rel="noopener noreferrer">
              <GitHub size={30} className='github-icon' />
              github.com/KarolPlonka/image-color-palette
            </a>
          </div>
      </div>
      <div className='column'>
        <div
          className="canvas-wrapper"
          ref={canvasWrapperRef}
          style={{ background: gradient }}
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

          {(!isImageUploaded) && <div className="canvas-overlay" />}

          {
            (isHoveringAtCanvas || !isImageUploaded) &&
            <label htmlFor="image-selector" className="file-input-label">
              <Upload size={18} className='upload-icon' />
              <span>Choose an Image</span>
            </label>
          }

        </div>

        <table className="controls-container">
          <tbody>
            <tr>
              <td>
                <label htmlFor="color-count">Colors:</label>
              </td>
              <td>
                <input
                  type="range"
                  min="1"
                  max="16"
                  value={colorCount}
                  onChange={handleColorCountChange}
                />
              </td>
              <td className='input-display'>
                <input
                  type="number"
                  min="1"
                  max="16"
                  value={colorCount}
                  onChange={handleColorCountChange}
                  onFocus={(e) => e.target.select()}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="acceleration-control">
                  Acceleration:
                  <Info size={16} className='info-icon' id='acceleration-info'/>
                </label>
                <Tooltip anchorSelect="#acceleration-info">
                  <div className='tooltip-msg'>
                    Acceleration variable will reduce the duration of the algorithm, <br/>
                    but it will also reduce the accuracy of the results.
                    <br/><br/>
                    When set to 1, the algorithm will check every pixel of the image. <br/>
                    When set to 2, it will check every second pixel, and so on.
                  </div>
                </Tooltip>

              </td>
              <td>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={acceleration}
                  onChange={handleAccelerationChange}
                />
              </td>
              <td>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={acceleration}
                  onChange={handleAccelerationChange}
                  onFocus={(e) => e.target.select()}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className='column' id="palete-display-column">
        <PaletteDsiplay palette={palette} acc={acceleration} />
      </div>
    </div>
  );
}

export default App;
