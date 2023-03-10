import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { TestimonialProps } from "../../types/Testimonial";

type CarouselProps = {
    list: TestimonialProps[];
};

export const CarouselTestimonial = ({ list }: CarouselProps) => {
    function SampleNextArrow(props: any) {
        const { className, onClick } = props;
        return (
            <div className={className} onClick={onClick}>
                <FaChevronRight className="w-11 h-11 p-2 bg-secondary text-white rounded-md mx-3 hover:bg-primary" />
            </div>
        );
    }

    function SamplePrevArrow(props: any) {
        const { className, onClick } = props;
        return (
            <div className={className} onClick={onClick}>
                <FaChevronLeft className="w-11 h-11 p-2 bg-secondary text-white rounded-md -mx-9 hover:bg-primary" />
            </div>
        );
    }

    const settings = {
        arrows: true,
        dots: false,
        infinite: true,
        autoplay: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    slidesToShow: 1,
                },
            },
        ],
    };

    return (
        <div className="max-w-8xl mx-auto rounded-lg px-4 sm:px-6 sm:mx-10 lg:px-8 lg:mx-24">
            <Slider {...settings}>
                {list &&
                    list.map((item) => (
                        <div
                            className="md:w-1/2 md:px-4 md:p-10"
                            key={item.author}
                        >
                            <div className="p-6 border-2 border-solid rounded-2xl hover:border-cyan-600 hover:bg-[#5897b4] h-72  transition-colors duration-300 md:shadow-xl text-gray-600 hover:text-white">
                                <div>
                                    <p className="h-44 w-full overflow-hidden">
                                        {item.description}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between px-10 gap-1">
                                    <div>
                                        <div className="text-gray-900 font-bold uppercase">
                                            - {item.author}
                                        </div>
                                        <small className="whitespace-nowrap">{item.role}</small>
                                    </div>
                                    <div>
                                        <div className="flex flex-wrap gap-x-2 gap-y-2">
                                            <div className="relative flex-shrink-0">
                                                <img
                                                    src={item.avatar}
                                                    alt=""
                                                    className="w-12 h-12 border rounded-full dark:bg-gray-500 dark:border-gray-700"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </Slider>
        </div>
    );
};
