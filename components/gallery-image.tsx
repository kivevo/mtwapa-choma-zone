import Image from "next/image";
import { cn } from "@/components/ui/cn";
import { getGalleryImageUrl } from "@/lib/fallback-data";

interface GalleryImageProps {
  src: string;
  alt: string;
  supabaseUrl?: string;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export function GalleryImage({
  src,
  alt,
  supabaseUrl,
  fill = true,
  className,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 33vw",
}: GalleryImageProps) {
  const imageUrl = getGalleryImageUrl(src, supabaseUrl);

  return (
    <Image
      src={imageUrl}
      alt={alt}
      fill={fill}
      className={cn("object-cover", className)}
      priority={priority}
      sizes={sizes}
    />
  );
}
