import { GetServerSideProps } from "next";
import api from "../../commons/api";
import ConsultComponent from "../../components/ConsultComponent";
import { ServiceProps } from "../../types/Service";

import { useRouter } from "next/router";

type ConsultProps = {
    servicesInfo: ServiceProps[];
};

export default function MakeConsult({
    servicesInfo,
}: ConsultProps) {
    const router = useRouter();

    return (
        <div className="py-36 container">
            <ConsultComponent list={servicesInfo} selected={parseInt(router.query?.id?.toString() || '0')} />
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    // serviços
    const servicesReponse = await api.get(`public-routes/right-area?other=1`);
    const servicesInfo = await servicesReponse.data.data;

    return {
        props: {
            servicesInfo,
        },
    };
};
