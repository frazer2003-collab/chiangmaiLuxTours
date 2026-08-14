import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
  priority?: boolean;
  objectPosition?: string;
};

export function RoutePhoto({
  src,
  alt,
  className = "",
  sizes,
  priority = false,
  objectPosition,
}: Props) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        style={objectPosition ? { objectPosition } : undefined}
      />
    </div>
  );
}
