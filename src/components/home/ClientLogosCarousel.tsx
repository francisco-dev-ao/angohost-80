
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const ClientLogosCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start",
    loop: true,
    skipSnaps: false 
  }, [Autoplay({ delay: 3000, stopOnInteraction: false })]);

  // Lista de clientes fictícios com nomes que sugerem empresas reais angolanas
  const clients = [
    { name: "TechAngola", logo: "https://placehold.co/200x100/f8f8f8/555555?text=TechAngola" },
    { name: "AO Digital", logo: "https://placehold.co/200x100/f8f8f8/555555?text=AO+Digital" },
    { name: "Luanda Shop", logo: "https://placehold.co/200x100/f8f8f8/555555?text=Luanda+Shop" },
    { name: "Angola Express", logo: "https://placehold.co/200x100/f8f8f8/555555?text=Angola+Express" },
    { name: "Benguela Tech", logo: "https://placehold.co/200x100/f8f8f8/555555?text=Benguela+Tech" },
    { name: "Huambo Store", logo: "https://placehold.co/200x100/f8f8f8/555555?text=Huambo+Store" },
    { name: "Lobito Market", logo: "https://placehold.co/200x100/f8f8f8/555555?text=Lobito+Market" },
    { name: "Namibe Digital", logo: "https://placehold.co/200x100/f8f8f8/555555?text=Namibe+Digital" },
  ];

  return (
    <section className="py-16 bg-gray-50 border-t border-gray-100">
      <div className="container">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-[#345990]">Clientes que confiam em nós</h3>
          <p className="text-gray-600 mt-2">Empresas em Angola que escolheram a AngoHost como parceira de hospedagem</p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({ delay: 3000, stopOnInteraction: false })
              ]}
              className="w-full"
            >
              <CarouselContent className="-ml-1">
                {clients.map((client, index) => (
                  <CarouselItem key={index} className="pl-1 md:basis-1/3 lg:basis-1/4">
                    <div className="p-1">
                      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-24 flex items-center justify-center transition-all hover:shadow-md hover:-translate-y-1">
                        <img 
                          src={client.logo} 
                          alt={`${client.name} - Cliente AngoHost`} 
                          className="max-h-full max-w-full object-contain grayscale hover:grayscale-0 transition-all"
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-6">
                <CarouselPrevious className="static translate-y-0 mr-2 bg-white border-gray-200 hover:bg-gray-50" />
                <CarouselNext className="static translate-y-0 ml-2 bg-white border-gray-200 hover:bg-gray-50" />
              </div>
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientLogosCarousel;
