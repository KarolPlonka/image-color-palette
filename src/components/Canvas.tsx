import React, { FC, useEffect, useRef, useState } from 'react';
import PaletteColor from '../utils/PaletteColor';
import { getImagePalette } from '../utils/imagePaletteExctractor'
import  getGradientString  from '../utils/GradientString';
import { Upload } from 'react-feather';

import '../styles/Canvas.css';

// example images for carousel
import react from '../assets/images/react.svg'
import github from '../assets/images/github.webp'
import bird from '../assets/images/bird.bmp'
import getIconSize from '../utils/IconSize';
const exampleImages = [react, github, bird];

interface CanvasProps {
    colorCount: number;
    acceleration: number;
    setPalette: (palette: PaletteColor[]) => void;
}

export const Canvas: FC<CanvasProps> = ({ colorCount, acceleration, setPalette }) => {
    const [image, setImage] = useState<string>(exampleImages[0]);
    const [isImageUploaded, setIsImageUploaded] = useState<boolean>(false);
    const [isHoveringAtCanvas, setIsHoveringAtCanvas] = useState<boolean>(false);
    const [exampleImageIndex, setExampleImageIndex] = useState<number>(1);
    const [gradient, setGradient] = useState<string>('');

    const canvasRef = useRef<HTMLCanvasElement>(null);
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
            if (img.width - canvas.width > img.height - canvas.height) {
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

            const gradientString = getGradientString(newPalette);
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

    // example image carousel
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isImageUploaded) {
                setImage(exampleImages[exampleImageIndex]);
                setExampleImageIndex((exampleImageIndex + 1) % exampleImages.length);
            }
        }, 4000);
        return () => clearInterval(interval);
    }, [exampleImageIndex, isImageUploaded]);

    return (
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
                    <Upload size={getIconSize(0.8)} className='upload-icon' />
                    <span>Choose an Image</span>
                </label>
            }

        </div>
    );
};

export default Canvas;