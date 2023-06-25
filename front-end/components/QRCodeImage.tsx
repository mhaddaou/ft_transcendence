import QRCode from 'qrcode.react';
import parse from 'html-react-parser';
interface Props{
    base64 : string
}
const QRCodeImage = ({ base64 }:Props) => {
    console.log(base64)
  const imageData = base64

  return <div>{parse(`<img className="w-full rounded max-w-[450px]" src="${imageData}" alt="QR Code" />`)}</div>;
};

export default QRCodeImage;