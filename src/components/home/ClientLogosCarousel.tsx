
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

const ClientLogosCarousel = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-[#345990]">Clientes que confiam em nós</h3>
          <p className="text-gray-600 mt-2">Empresas em Angola que escolheram a AngoHost como parceira de hospedagem</p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-1">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <CarouselItem key={item} className="pl-1 md:basis-1/3 lg:basis-1/4">
                  <div className="p-1">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 h-24 flex items-center justify-center">
                      <span className="text-gray-400">Cliente {item}</span>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-4">
              <CarouselPrevious className="static translate-y-0 mr-2" />
              <CarouselNext className="static translate-y-0 ml-2" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default ClientLogosCarousel;
