import Link from "next/link";
import { useEffect, useState } from "react";
import api from "../../commons/api";

export interface SiteInfoProps {
    //social network
    link_facebook: string;
    link_instagram: string;
    link_linkedin: string;

    // contact
    address: string;
    phone1: string;
    phone2: string;
    email: string;
}

export default function Footer() {
    const [siteInfo, setSiteInfo] = useState<SiteInfoProps>({
        link_facebook: '#',
        link_instagram: '#',
        link_linkedin: '#',
        address: '',
        phone1: '',
        phone2: '',
        email: '',
    });

    useEffect(() => {
        async function getContract() {
            try {
                const { data } = await api.get("public-routes/site-info");
                const siteInfo = await data.data;
                setSiteInfo(siteInfo);
            } catch {
                console.log("deu ruim");
            }
        }

        getContract();
    }, []);

    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-6">
                            <address>
                                <p className="mb-4">{siteInfo.address}</p>
                                <div className="d-flex align-items-center">
                                    <p className="mr-4 mb-0" hidden={!siteInfo.phone1}>{siteInfo.phone1}</p>
                                </div>
                                <div className="d-flex align-items-center">
                                    <p className="mr-4 mb-0" hidden={!siteInfo.phone2}>{siteInfo.phone2}</p>
                                    <Link href={`mailto:${siteInfo.email}`}>
                                        <a className="footer-link">{siteInfo.email}</a>
                                    </Link>
                                </div>
                            </address>
                            <div className="social-icons">
                                <h6 className="footer-title font-weight-bold">
                                    Nossas redes sociais
                                </h6>
                                <div className="d-flex">
                                    <Link href={siteInfo.link_facebook}>
                                        <a target="_blank" rel="noreferrer">
                                            <i className="mdi mdi-facebook-box"></i>
                                        </a>
                                    </Link>
                                    <Link href={siteInfo.link_instagram}>
                                        <a target="_blank" rel="noreferrer">
                                            <i className="mdi mdi-instagram"></i>
                                        </a>
                                    </Link>
                                    <Link href={siteInfo.link_linkedin}>
                                        <a target="_blank" rel="noreferrer">
                                            <i className="mdi mdi-linkedin"></i>
                                        </a>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="row flex justify-end">
                                <div className="col-sm-4">
                                    <h6 className="footer-title">
                                        Links úteis
                                    </h6>
                                    <ul className="list-footer">
                                        <li>
                                            <Link href="/#">
                                                <a className="footer-link">
                                                    Inicio
                                                </a>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/#services">
                                                <a className="footer-link">
                                                    Áreas do Direito
                                                </a>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/sobre">
                                                <a className="footer-link">
                                                    Sobre nós
                                                </a>
                                            </Link>
                                        </li>

                                        <li>
                                            <Link href="/#plans">
                                                <a className="footer-link">
                                                    Planos
                                                </a>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/faq">
                                                <a className="footer-link">
                                                    FAQ
                                                </a>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center flex justify-between w-full flex-wrap gap-3">
                            <img
                                src="/images/logo.svg"
                                alt="logo"
                                className="mr-3"
                            />
                            <p className="mb-0  pt-1">
                                © 2022 SC Advogados.
                                Todos os direitos reservados.
                            </p>
                            <Link href="/terms">
                                <a className=" text-white mx-2 footer-link">
                                    Políticas de uso
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
