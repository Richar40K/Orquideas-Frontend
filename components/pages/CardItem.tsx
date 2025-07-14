import { CardPresentation } from "./CardPresentacion";


const cardItems = [

   {
    id: 1,
    title: "Nuestras Rutas",
    image: "/images/ruta.jpg",
    description:
      "Contamos con rutas que mejoraran tu experiencia",
  }, 
  {
    id: 2,
    title: "Arequipa",
    image: "/images/imageCardArequipa.jpg",
    description:
      "En tu ruta por Arequipa, maravíllate con la arquitectura de sillar bajo la sombra del Misti",
  },
  {
    id: 3,
    title: "Omate",
    image: "/images/omate.jpg",
    description:
      "En tu ruta por Omate, descubre paisajes volcánicos únicos y sumérgete en la riqueza de sus tradiciones ancestrales",
  },
  {
    id: 4,
    title: "Quinistaquillas",
    image: "/images/Quinistaquillas.jpg",
    description:
      "En tu ruta por Quinistaquillas, adéntrate en un paisaje donde la naturaleza ha esculpido formaciones rocosas sorprendentes y cañones misteriosos",
  },
];

export const CardItem = () => {
  return (
    <div className="w-full">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 md:mb-10 text-center">
        Explora las rutas
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-6">
        {cardItems.map((item) => (
          <CardPresentation 
            key={item.id}
            title={item.title}
            image={item.image}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
};