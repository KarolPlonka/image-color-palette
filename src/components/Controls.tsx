import React, { FC } from 'react';
import { Info, Plus, Minus } from 'react-feather';
import { Tooltip } from 'react-tooltip';
import ControlProps from '../utils/ControlProps';
import getIconSize from '../utils/IconSize';


import '../styles/Controls.css';

const ControlRow: FC<ControlProps> = ({ title, setValue, min, max, value, tooltip }) => {

    const handleChange = (newValue: number | null) => {
        if (
            !newValue ||
            newValue === value ||
            newValue < min ||
            newValue > max
        ) {
            return;
        }

        setValue(newValue);
    };

    return (
        <tr>
            <td>
                <span className='control-title'>
                    {title}: {tooltip && <Info size={getIconSize(0.6)} className='info-icon' id={title + "-tooltip"} />}

                    {tooltip && <Tooltip anchorSelect={"#" + title + "-tooltip"}>
                        <div className='tooltip-msg'>{tooltip}</div>
                    </Tooltip>}
                </span>

            </td>
            <td>
                <button
                    className="nr-control-button"
                    onClick={() => handleChange(value - 1)}
                >
                    <Minus size={getIconSize(0.7)} />
                </button>
            </td>
            <td className='slider-cell'>
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(event) => handleChange(event?.target && parseInt(event.target.value) || null)}
                />
            </td>
            <td>
                <button
                    className="nr-control-button"
                    onClick={() => handleChange(value + 1)}
                >
                    <Plus size={getIconSize(0.7)} />
                </button>
            </td>
            <td>
                <input
                    type="number"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(event) => handleChange(event?.target && parseInt(event.target.value) || null)}
                    onFocus={(e) => e.target.select()}
                />
            </td>
        </tr>
    );
};



export default ControlRow;