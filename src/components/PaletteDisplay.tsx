import React, { ReactNode, FC, useState, useEffect, useRef, useMemo} from "react";
import { useSignal } from "../utils/CustomHooks";
import { Copy, CheckCircle } from 'react-feather';

import '../styles/PaletteDisplay.css'

import handleCopyToClipboard from '../utils/ClipboardCopy';
import getIconSize from '../utils/IconSize';
import getGradientString from "../utils/GradientString";
import PaletteColor,{
  PaletteColorToHex,
  PaletteColorToRGB, 
} from "../utils/PaletteColor";
import { get } from "http";

const CopyIcon: FC<{ size: number, animationTrigger: number }> = ({ size, animationTrigger }) => {
  const toCopyIcon = useMemo(() => <Copy size={getIconSize(size)} className='copy-icon' />, [size]);
  const copiedIcon = useMemo(() => <CheckCircle size={getIconSize(size)} className='copied-icon'/>, [size]);

  const [icon, setIcon]= useState<ReactNode>(toCopyIcon);

  useEffect(() => {
    if(!animationTrigger) return;

    setIcon(copiedIcon);
    setTimeout(() => {
      setIcon(toCopyIcon);
    }, 1000);

  }, [animationTrigger, toCopyIcon, copiedIcon])

  return(<>{ icon }</>)
}

const CopyAllButton: FC<{
  label: string,
  palette: PaletteColor[],
  paletteColorParser: (palette: PaletteColor) => string
}> = ({ label, palette, paletteColorParser }) => {
  const [animationSignal, sendAnimationSignal] = useSignal();
  
  const handleButtonClick = () => {
    const text = palette.map((color) => paletteColorParser(color)).join('\n');
    handleCopyToClipboard(text);
    sendAnimationSignal();
  }

  return(
      <div
        className="copy-all-button"
        onClick={handleButtonClick}
        style = {{background: getGradientString(palette)}}
      >
        {label}
        <CopyIcon size={1} animationTrigger={animationSignal}/>
      </div>
  )
}


const ColorValue: FC<{ label: string, value: string }> = ({ label, value }) => {
  const [animationSignal, sendAnimationSignal] = useSignal();

  const copyValue = () => {
    handleCopyToClipboard(value);
    sendAnimationSignal();
  }

  return (
    <div className="color-value-wrapper">
      <span className="color-value-label">{label}</span>
      <span className="color-value" onClick={copyValue}>
        {value} <CopyIcon size={0.7} animationTrigger={animationSignal}/>
      </span>
    </div>
  );
};

const ColorDiv: React.FC<{ color: PaletteColor; percentage: number, acc: number }> = ({ color, percentage, acc }) => {
  const [isInside, setIsInside] = useState<boolean>(false);

  const divStyle = {
    width: `${percentage * 100}%`,
    backgroundColor: PaletteColorToRGB(color),
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
            label="RGB:"
            value={PaletteColorToRGB(color)}
          />
          <ColorValue
            label="HEX:"
            value={PaletteColorToHex(color).toUpperCase()}
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
      {palette.map((color, index) => (
        <ColorDiv
          key={index}
          color={color}
          percentage={color.count / pixelSum}
          acc={acc}
        />
      ))}

      <div className="copy-all-buttons-wrapper" >
        <CopyAllButton
          palette={palette}
          paletteColorParser={PaletteColorToRGB}
          label="RGB"
        />
        <CopyAllButton
          palette={palette}
          paletteColorParser={PaletteColorToHex}
          label="HEX"
        />
      </div>
      
    </div>
  );
};

export default PaletteDisplay;

