import { ServiceProps } from "../../types/Service";
import { CarouselServices } from "../CarouselServices";

type ServicesListProps = {
    list: ServiceProps[];
};

export function OurServices({ list }: ServicesListProps) {
    return (
        <section className="our-services" id="services">
            <div className="container">
                <div className="col-sm-12">
                    <h5 className="text-dark mb-5"></h5>
                    <h3 className="font-weight-medium text-dark mb-5">
                        Áreas do direito
                    </h3>
                </div>

                <CarouselServices list={list} />
            </div>
        </section>
    );
}
