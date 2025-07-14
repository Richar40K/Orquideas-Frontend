import Image, { StaticImageData } from "next/image";

interface Props {
  title: string;
  image: string | StaticImageData;
  description: string;
}

export const CardPresentation = ({ title, image, description }: Props) => {
  return (
    <div className="group relative h-64 sm:h-80 md:h-96 w-full [perspective:1000px]">
      <div className="relative h-full w-full rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        
        {/* Frente de la tarjeta (imagen) */}
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-xl overflow-hidden">
          <Image
            src={image}
            alt={`Imagen de ${title}`}
            fill
            className="object-cover rounded-xl"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            priority={false}
          />
        </div>

        {/* Reverso de la tarjeta (contenido) */}
        <div className="absolute inset-0 h-full w-full rounded-xl bg-black/90 px-4 sm:px-6 text-center text-slate-200 [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <div className="flex min-h-full flex-col items-center justify-center p-2 sm:p-4">
            <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">{title}</h1>
            <p className="text-xs sm:text-sm md:text-base">{description}</p>
            <button 
              className="mt-2 sm:mt-4 rounded-md bg-neutral-800 px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold hover:bg-neutral-900 transition-colors cursor-pointer"
              aria-label={`Explorar ${title}`}
            >
              Explorar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};