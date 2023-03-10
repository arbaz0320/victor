import { GetServerSideProps } from "next";
import api from "../../commons/api";
import { SiteInfoProps } from "../../types/SiteInfo";

type TermsProps = {
    siteInfo: SiteInfoProps;
}

export default function Terms({
    siteInfo
}: TermsProps) {
    return (
        <section id="home" className="home">
            <div className="backdrop-blur-xl bg-black/30">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="min-h-96">
                            <div className="max-w-6xl p-4 mx-auto mb-5 space-y-8 bg-white rounded-3xl">
                                <div className="my-10 space-y-10" dangerouslySetInnerHTML={{ __html: siteInfo.term_text }}></div>
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
    const infoReponse = await api.get(`public-routes/site-info`);
    const siteInfo = await infoReponse.data.data;

    return {
        props: {
            siteInfo,
        },
    };
};
