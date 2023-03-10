
import { GetServerSideProps } from "next";
import api from "../../commons/api";
import { FaqInfoProps } from "../../types/FaqInfo";

type FaqProps = {
    faqInfo: FaqInfoProps[];
};

export default function Faq({
    faqInfo
}: FaqProps) {
    return (
        <section id="home" className="home">
            <div className="backdrop-blur-xl bg-black/30">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <h1 className="mt-10 text-white text-3xl py-2 pl-10">
                                FAQ
                            </h1>
                            <div className="min-h-96">
                                <div className="max-w-6xl p-4 mx-auto mb-5 space-y-8 bg-white rounded-3xl">
                                    <div className="my-10 md:px-16 space-y-10">
                                        <h2 className="mt-10 text-left text-2xl font-extrabold text-gray-900">
                                            Perguntas Frequentes
                                        </h2>
                                        <hr />
                                        {faqInfo && faqInfo.map((faq, idx) => (
                                            <div key={idx}>
                                                <h4 className="font-bold text-2xl">
                                                    {faq.question}
                                                </h4>
                                                <p className="text-justify">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    // Informações do site
    const faqResponse = await api.get(`public-routes/faq`);
    const faqInfo = await faqResponse.data.data;

    return {
        props: {
            faqInfo,
        },
    };
};
