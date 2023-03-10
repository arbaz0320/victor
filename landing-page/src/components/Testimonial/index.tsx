import { TestimonialProps } from "../../types/Testimonial";
import { CarouselTestimonial } from "../CarouselTestimonial";

type TestimonialListProps = {
    list: TestimonialProps[];
};

export function Testimonial({ list }: TestimonialListProps) {
    return (
        <section id="testimonial">
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="d-sm-flex justify-content-between align-items-center">
                            <h3 className="font-weight-medium text-dark mt-10">
                                Depoimentos
                            </h3>
                        </div>
                    </div>
                </div>
                <CarouselTestimonial list={list} />
            </div>
        </section>
    );
}
