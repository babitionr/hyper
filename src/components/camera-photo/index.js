import React from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import './index.less';

export default function CameraPhoto({ onUploadImage }) {
  const handleTakePhoto = async (dataUri) => {
    try {
      // Do stuff with the photo...
      const newImg = await compressImage(dataUri, 1280, 736);
      const file = dataURLtoFile(newImg, 'image.png');
      onUploadImage && onUploadImage(file);
    } catch (error) {
      console.log(error);
    }
  };
  function dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    // eslint-disable-next-line no-undef
    return new File([u8arr], filename, { type: mime });
  }
  function compressImage(src, newX, newY) {
    // eslint-disable-next-line promise/param-names
    return new Promise((res, rej) => {
      // eslint-disable-next-line no-undef
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const elem = document.createElement('canvas');
        elem.width = newX;
        elem.height = newY;
        const ctx = elem.getContext('2d');
        ctx.drawImage(img, 0, 0, newX, newY);
        const data = ctx.canvas.toDataURL();
        res(data);
      };
      img.onerror = (error) => rej(error);
    });
  }
  return (
    <div id="camera-photo">
      <Camera
        isImageMirror={true}
        idealResolution={{ width: 1280, height: 736 }}
        isMaxResolution={true}
        onTakePhoto={async (dataUri) => {
          await handleTakePhoto(dataUri);
        }}
      />
    </div>
  );
}
