import React, {useState, useEffect} from "react";
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
    navigator.clipboard.writeText(value)
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

  // navigator.clipboard.writeText("stringToCopy");

  const divStyle = {
    width: `${percentage * 100}%`,
    backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
    transition: `all ${2/acc}s ease-out`
  };

  let conStyle: any = {left: `100%`};
  if(percentage > 0.5) conStyle = {right: `0%`};
  

  return (<>
    <div className="color-div" style={divStyle}>
      <div className="color-values-container" style={conStyle}>
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
  </>);

  // if(percentage > 0.5){
  //   return (<>
  //     <div className="color-div" style={divStyle}>
  //       {colorValues}
  //     </div>
  //   </>);
  // }
  // else {
  //   return (
  //     <div className="color-div-container">
  //       <div className="color-div" style={divStyle}></div>
  //       <div className="color-div-complement">
  //         {colorValues}
  //       </div>
  //     </div>
  //   );
  // }
};

const PaletteDisplay: React.FC<{ palette: PaletteColor[]; acc: number }> = ({ palette, acc }) => {
  const pixelSum = palette.reduce((sum, color) => sum + color.count, 0);

  // if(palette.length === 0){
  //   palette = [{r: 0, g: 0, b: 0, count: 1}];
  // }

  return (<>{ 
    palette.map((color, index) => (
      <ColorDiv
        key={index}
        color={color}
        percentage = {color.count / pixelSum}
        acc = {acc}
      />
    ))
  }</>);
};

export default PaletteDisplay;