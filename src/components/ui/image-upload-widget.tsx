
'use client';

import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { ImageCropperModal } from '@/components/ui/image-cropper-modal';
import getCroppedImg from '@/lib/crop-image';
import type { Area } from 'react-easy-crop';
import { Button } from './button';

interface ImageUploadWidgetProps {
  onImageCropped: (file: File) => void;
  aspect?: number;
  children?: React.ReactElement;
}

export function ImageUploadWidget({ onImageCropped, aspect = 1, children }: ImageUploadWidgetProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('cropped-image.jpeg');
  const inputRef = useRef<HTMLInputElement>(null);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      const imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl as string);
      e.target.value = '';
    }
  };

  const handleClose = () => {
    setImageSrc(null);
  };

  const handleCropConfirm = async (croppedAreaPixels: Area) => {
    if (!imageSrc) return;

    try {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedImageBlob) {
        const croppedFile = new File([croppedImageBlob], fileName, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });
        onImageCropped(croppedFile);
      }
    } catch (e) {
      console.error(e);
      alert('An error occurred while cropping the image.');
    } finally {
        handleClose();
    }
  };

  function readFile(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  }

  const handleTriggerClick = () => {
    inputRef.current?.click();
  };
  
  const triggerElement = children ? (
    React.cloneElement(children, { onClick: handleTriggerClick })
  ) : (
     <Button type="button" variant="outline" onClick={handleTriggerClick}>
        Choose File
    </Button>
  );

  return (
    <>
      <Input
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="hidden"
        ref={inputRef}
      />
      {triggerElement}
      <ImageCropperModal
        imageSrc={imageSrc}
        aspect={aspect}
        onClose={handleClose}
        onCropConfirm={handleCropConfirm}
      />
    </>
  );
}
