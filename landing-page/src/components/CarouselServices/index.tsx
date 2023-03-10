import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { ServiceProps } from "../../types/Service";

type CarouselProps = {
    list?: ServiceProps[];
};

export const CarouselServices = ({ list }: CarouselProps) => {
    function SampleNextArrow(props: any) {
        const { className, onClick } = props;
        return (
            <div className={className} onClick={onClick}>
                <FaChevronRight className="w-11 h-11 p-2 bg-secondary text-white rounded-md hover:bg-primary" />
            </div>
        );
    }

    function SamplePrevArrow(props: any) {
        const { className, onClick } = props;
        return (
            <div className={className} onClick={onClick}>
                <FaChevronLeft className="w-11 h-11 p-2 bg-secondary text-white rounded-md -mx-9 lg:-mx-12 hover:bg-primary" />
            </div>
        );
    }

    const settings = {
        arrows: true,
        dots: true,
        infinite: true,
        autoplay: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 2,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <div className="max-w-8xl mx-auto rounded-lg st:px-4 sm:px-6 sm:mx-10 lg:px-8 lg:mx-24">
            <Slider {...settings}>
                {list &&
                    list.map((item) => (
                        <div
                            className="md:max-w-xs p-6 rounded-md shadow-md dark:bg-primary dark:text-gray-50 h-[450px] st:mx-auto my-2"
                            key={item.id}
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="rounded-md h-48 dark:bg-gray-500 mx-auto"
                            />
                            <div className="mt-6 mb-2">
                                <h2 className="text-xl font-semibold tracking-wide">
                                    {item.title}
                                </h2>
                            </div>
                            <p className="dark:text-gray-100">
                                {item.description}
                            </p>
                        </div>
                    ))}
            </Slider>
        </div>
    );
};
