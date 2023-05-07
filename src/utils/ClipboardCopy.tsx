export default function handleCopyToClipboard (value: string)  {
    const tempInput = document.createElement('input');
    tempInput.value = value;
    document.body.appendChild(tempInput);
  
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // For mobile devices
  
    document.execCommand('copy');
    document.body.removeChild(tempInput);
};