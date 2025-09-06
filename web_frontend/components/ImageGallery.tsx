'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
  mainImage: string;
}

export default function ImageGallery({ images, mainImage }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(mainImage);

  return (
    <div>
      <div className="mb-3 overflow-hidden rounded-lg">
        <Image
          src={selectedImage}
          alt="Selected apartment view"
          width={800}
          height={360}
          className="object-cover w-full h-full transform transition-transform duration-500 hover:scale-110"
        />
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {images.map((image, index) => (
          <div
            key={index}
            className={`cursor-pointer overflow-hidden rounded-md border ${selectedImage === image ? 'border-[#c99362]' : 'border-transparent'}`}
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={image}
              alt={`Apartment view ${index + 1}`}
              width={160}
              height={80}
              className="object-cover w-full h-full transition-opacity duration-300 hover:opacity-80"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
