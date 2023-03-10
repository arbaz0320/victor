import { Contact } from "../components/Contacts";

import Hero from "../components/Hero";
import { HowItWorksSection } from "../components/HowItWorksSection";
import { LegalAdviceSection } from "../components/LegalAdviceSection";

import { OurServices } from "../components/OurServices";
import { Plans } from "../components/Plans";
import { ProjectsSection } from "../components/ProjectsSection";
import { Testimonial } from "../components/Testimonial";

import { GetServerSideProps } from "next";
import api from "../commons/api";
import ConsultComponent from "../components/ConsultComponent";
import { HowItWorksInfo } from "../types/HowItWorksInfo";
import { LegalAdviceInfo } from "../types/LegalAdviceInfo";
import { ServiceProps } from "../types/Service";
import { SiteInfoProps } from "../types/SiteInfo";

import { howItWorkPayload } from "../components/HowItWorksSection/mock";
import { legalAdvicePayload } from "../components/LegalAdviceSection/mock";
import { PlanInfoProps } from "../types/PlanInfo";
import { TestimonialProps } from "../types/Testimonial";

type HomeProps = {
    siteInfo: SiteInfoProps;
    planInfo: PlanInfoProps[];
    testimonialInfo: TestimonialProps[];
    howItWorksInfo: HowItWorksInfo[];
    legalAdviceInfo: LegalAdviceInfo[];
    servicesInfo: ServiceProps[];
};

export default function Home({
    siteInfo,
    planInfo,
    testimonialInfo,
    howItWorksInfo,
    legalAdviceInfo,
    servicesInfo,
}: HomeProps) {
    return (
        <div>
            <Hero
                banner_text={siteInfo.banner_title}
                banner_title={siteInfo.banner_text}
            />

            <HowItWorksSection info={howItWorksInfo} />

            <LegalAdviceSection info={legalAdviceInfo} />

            <ProjectsSection
                section_title={siteInfo.section1_title}
                section_text={siteInfo.section1_text}
                counter_1={siteInfo.counters_1}
                counter_2={siteInfo.counters_2}
                counter_3={siteInfo.counters_3}
                counter_4={siteInfo.counters_4}
            />
            <ConsultComponent list={servicesInfo} />
            <OurServices list={servicesInfo.slice(0, -1)} />
            <Testimonial list={testimonialInfo} />
            <Plans
                section_title={siteInfo.section2_title}
                section_text={siteInfo.section2_text}
                planInfo={planInfo}
            />
            <Contact
                section_title={siteInfo.section3_title}
                section_text={siteInfo.section3_text}
            />
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    // Informações do site
    const infoReponse = await api.get(`public-routes/site-info`);
    const siteInfo = await infoReponse.data.data;

    const planReponse = await api.get(`public-routes/plan`);
    const planInfo = await planReponse.data.data;

    // depoimentos
    const testimonialReponse = await api.get(`public-routes/deposition`);
    const testimonialInfo = await testimonialReponse.data.data;

    // TODO: get payload from backend endpoint
    const howItWorksInfo = howItWorkPayload;
    const legalAdviceInfo = legalAdvicePayload;

    // serviços
    const servicesReponse = await api.get(`public-routes/right-area?other=1`);
    const servicesInfo = await servicesReponse.data.data;

    return {
        props: {
            siteInfo,
            planInfo,
            testimonialInfo,
            howItWorksInfo,
            legalAdviceInfo,
            servicesInfo,
        },
    };
};
