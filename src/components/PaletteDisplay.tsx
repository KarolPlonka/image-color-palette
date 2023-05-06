import React, {useState, useEffect, useRef} from "react";
import './PaletteDisplay.css'
import { Copy, CheckCircle } from 'react-feather';


export interface PaletteColor {
  r: number;
  g: number;
  b: number;
  count: number;
}

const ColorValue: React.FC<{  title: string, value: string }> = ({ title, value }) => {
  const [icon, setIcon] = useState(<Copy size={18} className='copy-icon' />);

  const copyValue = () => {
    handleCopyToClipboard(value);
    setIcon(<CheckCircle size={18} className='copied-icon'/>);
    setTimeout(() => {
      setIcon(<Copy size={18} className='copy-icon' />);
    }, 1000);
  }

  return (
    <div className="color-value-wrapper">
      <span className="color-title">{title}</span>
      <span className="color-value" onClick={copyValue}>
        {value} {icon}
      </span>
    </div>
  );
};

const ColorDiv: React.FC<{ color: PaletteColor; percentage: number, acc: number }> = ({ color, percentage, acc }) => {
  const [isInside, setIsInside] = useState(false);

  const divStyle = {
    width: `${percentage * 100}%`,
    backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
    transition: `width ${2 / acc}s ease-out, background-color 1s ease-in`,
  };

  useEffect(() => {
    if (percentage > 0.45) setIsInside(true);
    else                   setIsInside(false);
  }, [percentage]);

  const positionStyle = isInside ? { left: `30%` } : { left: `100%` };

  return (
    <>
      <div className="color-div" style={divStyle}>
        <div className={`color-values-container`} style={positionStyle}>
          <ColorValue
            title="RGB:"
            value={`rgb(${color.r}, ${color.g}, ${color.b})`}
          />
          <ColorValue
            title="HEX:"
            value={`#${color.r.toString(16)}${color.g.toString(16)}${color.b.toString(16)}`.toUpperCase()}
          />
        </div>
      </div>
    </>
  );
};

const PaletteDisplay: React.FC<{ palette: PaletteColor[]; acc: number }> = ({ palette, acc }) => {
  const paletteContainerRef = useRef<HTMLDivElement>(null);

  const pixelSum = palette.reduce((sum, color) => sum + color.count, 0);

  return (
    <div className="palette-container" ref={paletteContainerRef}>
      {
      palette.map((color, index) => (
        <ColorDiv
          key={index}
          color={color}
          percentage={color.count / pixelSum}
          acc={acc}
        />
      ))
      }
    </div>
  );
};

export default PaletteDisplay;

const handleCopyToClipboard = (value: string) => {
  const tempInput = document.createElement('input');
  tempInput.value = value;
  document.body.appendChild(tempInput);

  tempInput.select();
  tempInput.setSelectionRange(0, 99999); // For mobile devices

  document.execCommand('copy');
  document.body.removeChild(tempInput);
};