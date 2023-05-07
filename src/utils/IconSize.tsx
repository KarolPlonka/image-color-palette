export default function getIconSize(scaller: number = 1) {
    const screenSize = window.innerWidth + window.innerHeight;
    let size;

    if (screenSize < 1000) {
        size = 16;
    } 
    else if (screenSize < 1500) {
        size = 24;
    }
    else if (screenSize < 2000) {
        size = 32;
    }
    else{
        size = 40;
    }

    return Math.floor(size * scaller);
}

