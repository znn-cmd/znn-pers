import Image from 'next/image';
import { motion } from 'framer-motion';

interface PostImageProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export default function PostImage({ 
  src, 
  alt, 
  caption, 
  width = 800, 
  height = 600,
  priority = false 
}: PostImageProps) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="my-8"
    >
      <div className="relative rounded-lg overflow-hidden shadow-sm border border-neutral-200 bg-neutral-50">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className="w-full h-auto"
          style={{
            objectFit: 'cover',
          }}
        />
      </div>
      
      {caption && (
        <figcaption className="text-sm text-neutral-500 text-center mt-3 italic">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  );
}

// Также создадим компонент для встроенных изображений без анимации
export function InlineImage({ src, alt, width = 400, height = 300 }: PostImageProps) {
  return (
    <div className="my-6 rounded-lg overflow-hidden shadow-sm border border-neutral-200 bg-neutral-50">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-auto"
        style={{
          objectFit: 'cover',
        }}
      />
    </div>
  );
}

