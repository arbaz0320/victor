import Link from "next/link";
import Router from "next/router";
import { useCustomModal } from "../../hooks/useCustomModal";
import { LoginModal } from "../LoginModal";
import { MyContractsModal } from "../MyContractsModal";
import { MyProfileModal } from "../MyProfileModal";
import { MyQuestionsModal } from "../MyQuestionsModal";

import { Popover, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { Fragment, useContext, useEffect, useState } from "react";
import api from "../../commons/api";
import { AuthContext } from "../../context/AuthContext";
import { ContractProps } from "../../types/Contract";
import { ServiceProps } from "../../types/Service";
import UserMenu from "../UserMenu";

function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
}

export default function Header() {
    const loginModal = useCustomModal();
    const profileModal = useCustomModal();
    const contractsModal = useCustomModal();
    const questionsModal = useCustomModal();

    const { user } = useContext(AuthContext);
    const [contractList, setContractLIst] = useState<ContractProps[]>();
    const [servicesList, setServicesLIst] = useState<ServiceProps[]>();

    const userMenu = <UserMenu
        profileModal={profileModal}
        contractsModal={contractsModal}
        questionsModal={questionsModal}
    />

    useEffect(() => {
        async function getContract() {
            try {
                const contractInfo = await api.get("public-routes/contract");
                setContractLIst(contractInfo.data.data);

                const servicesInfo = await api.get("public-routes/right-area");
                setServicesLIst(servicesInfo.data.data);
            } catch {
                console.log("deu ruim");
            }
        }

        getContract();
    }, []);

    return (
        <>
            <Popover className="fixed w-full bg-[#001a4e] z-40 h-auto sm:h-32 py-2 px-4 lg:px-0">
                <div className="flex justify-between items-center py-6 md:justify-start lg:max-w-[1024px] xl:max-w-[1140px] mx-auto">
                    <div className="flex justify-start lg:flex-1">
                        <Link href="/">
                            <a>
                                <span className="sr-only">SC Advogados</span>
                                <img
                                    className="h-10 md:h-12 lg:h-16 w-auto"
                                    src="/images/logo.svg"
                                    alt="logo Sc Advogados"
                                />
                                <p className="text-white text-xs mt-1 -mb-2 lg:whitespace-nowrap">
                                    Soluções jurídicas descomplicadas
                                </p>
                            </a>
                        </Link>
                    </div>
                    <div className="-mr-2 -my-2 md:hidden">
                        <Popover.Button className="bg-[#001a4e] rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-white hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                            <span className="sr-only">Open menu</span>
                            <MenuIcon className="h-6 w-6" aria-hidden="true" />
                        </Popover.Button>
                    </div>
                    <Popover.Group
                        as="nav"
                        className="hidden md:flex space-x-8 xl:space-x-10"
                    >
                        <Popover className="relative">
                            {({ open }) => (
                                <>
                                    <Popover.Button
                                        className={classNames(
                                            open
                                                ? "text-secondary"
                                                : "text-white",
                                            "group bg-[#001a4e] rounded-md inline-flex items-center text-base font-medium hover:text-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        )}
                                    >
                                        <span>Faça sua consulta</span>
                                        <ChevronDownIcon
                                            className={classNames(
                                                open
                                                    ? "text-secondary"
                                                    : "text-white",
                                                "ml-2 h-5 w-5 group-hover:text-gray-500"
                                            )}
                                            aria-hidden="true"
                                        />
                                    </Popover.Button>

                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-200"
                                        enterFrom="opacity-0 translate-y-1"
                                        enterTo="opacity-100 translate-y-0"
                                        leave="transition ease-in duration-150"
                                        leaveFrom="opacity-100 translate-y-0"
                                        leaveTo="opacity-0 translate-y-1"
                                    >
                                        <Popover.Panel className="absolute left-60 lg:left-1/2 md:-top-14 lg:top-6 z-10 mt-3 w-screen max-w-md -translate-x-1/2 transform px-2 sm:px-0 md:max-w-3xl">
                                            {({ close }) => (
                                                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                                    <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8 md:grid-cols-2">
                                                        {servicesList?.slice(0, 6).map(
                                                            (solution) => (
                                                                <Link href={`/consulta/${solution.id}`} key={solution.id}>
                                                                    <a
                                                                        className="-m-3 flex items-start rounded-lg transition duration-150 ease-in-out hover:bg-gray-50"
                                                                        onClick={() => close()}
                                                                    >
                                                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md text-white sm:h-12 sm:w-12">
                                                                            <img
                                                                                src={solution.image}
                                                                                alt={solution.title}
                                                                                className="object-cover object-center w-full rounded-md h-10 dark:bg-gray-500"
                                                                            />
                                                                        </div>
                                                                        <div className="ml-4">
                                                                            <p className="text-base font-medium text-gray-900">
                                                                                {
                                                                                    solution.title
                                                                                }
                                                                            </p>
                                                                            <p className="mt-1 text-sm text-gray-500">
                                                                                {
                                                                                    solution.description
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </a>
                                                                </Link>
                                                            )
                                                        )}
                                                    </div>
                                                    <div className="p-5 bg-gray-50 sm:p-8">
                                                        <Link href="/consulta/0" onClick={() => close()}>
                                                            <a className="-m-3 p-3 flow-root rounded-md">
                                                                <div className="flex items-center">
                                                                    <div className="text-base font-medium text-gray-900">
                                                                        Faça sua
                                                                        consulta
                                                                        clicando
                                                                        aqui.
                                                                    </div>
                                                                </div>
                                                                <p className="mt-1 text-sm text-gray-500">
                                                                    Você será
                                                                    enviado para
                                                                    area de
                                                                    consultas onde
                                                                    poderá enviar
                                                                    uma pergunta
                                                                    para um advogado
                                                                    especializado.
                                                                </p>
                                                            </a>
                                                        </Link>
                                                    </div>
                                                </div>
                                            )}
                                        </Popover.Panel>
                                    </Transition>
                                </>
                            )}
                        </Popover>
                        <Popover className="relative">
                            {({ open }) => (
                                <>
                                    <Popover.Button
                                        className={classNames(
                                            open
                                                ? "text-secondary"
                                                : "text-white",
                                            "group bg-[#001a4e] rounded-md inline-flex items-center text-base font-medium hover:text-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        )}
                                    >
                                        <span>Contratos</span>
                                        <ChevronDownIcon
                                            className={classNames(
                                                open
                                                    ? "text-secondary"
                                                    : "text-white",
                                                "ml-2 h-5 w-5 group-hover:text-gray-500"
                                            )}
                                            aria-hidden="true"
                                        />
                                    </Popover.Button>

                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-200"
                                        enterFrom="opacity-0 translate-y-1"
                                        enterTo="opacity-100 translate-y-0"
                                        leave="transition ease-in duration-150"
                                        leaveFrom="opacity-100 translate-y-0"
                                        leaveTo="opacity-0 translate-y-1"
                                    >
                                        <Popover.Panel className="absolute z-10 left-1/2 transform -translate-x-1/2 mt-3 px-2 w-screen max-w-xs sm:px-0">
                                            {({ close }) => (
                                                <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                                                    <div className="relative grid gap-6 bg-white px-3 py-4 sm:gap-8 sm:p-8">
                                                        {contractList?.slice(0, 5).map(
                                                            (resource) => (
                                                                <Link
                                                                    key={
                                                                        resource.id
                                                                    }
                                                                    href={`/criar-contrato/${resource.id}`}
                                                                >
                                                                    <a className="-m-3 p-2 block rounded-md hover:bg-gray-50" onClick={() => close()}>
                                                                        <p className="text-base font-medium text-gray-900 text-center">
                                                                            {
                                                                                resource.title
                                                                            }
                                                                        </p>
                                                                    </a>
                                                                </Link>
                                                            )
                                                        )}
                                                    </div>
                                                    <div className="p-3 bg-gray-50 sm:p-5">
                                                        <Link href="/criar-contrato">
                                                            <a className="-m-3 p-3 flow-root rounded-md" onClick={() => close()}>
                                                                <div className="flex items-center">
                                                                    <div className="text-base font-medium text-gray-900">
                                                                        Ver mais modelos de contratos
                                                                    </div>
                                                                </div>
                                                                <p className="mt-1 text-sm text-gray-500">
                                                                    Consultar outros modelos de contratos existentes, um deles irá te atender
                                                                </p>
                                                            </a>
                                                        </Link>
                                                    </div>
                                                </div>
                                            )}
                                        </Popover.Panel>
                                    </Transition>
                                </>
                            )}
                        </Popover>
                        <span
                            onClick={() => Router.push("/sobre")}
                            className="text-base font-medium text-white hover:text-secondary cursor-pointer"
                        >
                            Sobre nós
                        </span>
                        <span
                            onClick={() => Router.push("/#plans")}
                            className="text-base font-medium text-white hover:text-secondary cursor-pointer"
                        >
                            Planos
                        </span>
                        <span
                            onClick={() => Router.push("/#contact")}
                            className="text-base font-medium text-white hover:text-secondary cursor-pointer"
                        >
                            Contato
                        </span>
                    </Popover.Group>
                    {user ? (
                        <div className="md:block hidden">{userMenu}</div>
                    ) : (
                        <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
                            <a
                                onClick={() =>
                                    loginModal.setCustomModal({
                                        status: true,
                                        icon: "success",
                                        title: "",
                                        text: "",
                                    })
                                }
                                className="ml-8 cursor-pointer whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-[#001a4e] hover:bg-secondary"
                            >
                                Login
                            </a>
                        </div>
                    )}
                </div>

                <Transition
                    as={Fragment}
                    enter="duration-200 ease-out"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="duration-100 ease-in"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <Popover.Panel
                        static
                        className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
                    >
                        {({ close }) => (
                            <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-[#001a4e]">
                                <div className="pt-5 px-5">
                                    <div className="flex items-center justify-between ">
                                        <div>
                                            <img
                                                className="h-10 sm:h-16 w-auto"
                                                src="/images/logo.svg"
                                                alt="logo Sc Advogados"
                                            />
                                            <p className="text-white text-xs">
                                                Soluções jurídicas descomplicadas
                                            </p>
                                        </div>
                                        <div className="-mr-2">
                                            <Popover.Button className="bg-indigo-500 rounded-md p-2 inline-flex items-center justify-center text-white hover:text-secondary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                                                <span className="sr-only">
                                                    Close menu
                                                </span>
                                                <XIcon
                                                    className="h-6 w-6"
                                                    aria-hidden="true"
                                                />
                                            </Popover.Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="py-6 px-5 text-center">
                                    <div
                                        onClick={() => { close(); return Router.push("/consulta/0") }}
                                        className="mt-6 text-base font-medium text-white hover:text-secondary cursor-pointer"
                                    >
                                        Faça sua consulta
                                    </div>
                                    <div
                                        onClick={() => { close(); return Router.push("/criar-contrato") }}
                                        className="mt-6 text-base font-medium text-white hover:text-secondary cursor-pointer"
                                    >
                                        Contratos
                                    </div>
                                    <div
                                        onClick={() => { close(); return Router.push("/sobre") }}
                                        className="mt-6 text-base font-medium text-white hover:text-secondary cursor-pointer"
                                    >
                                        Sobre nós
                                    </div>
                                    <div
                                        onClick={() => { close(); return Router.push("/#plans") }}
                                        className="mt-6 text-base font-medium text-white hover:text-secondary cursor-pointer"
                                    >
                                        Planos
                                    </div>
                                    <div
                                        onClick={() => { close(); return Router.push("/#contact") }}
                                        className="mt-6 text-base font-medium text-white hover:text-secondary cursor-pointer"
                                    >
                                        Contato
                                    </div>
                                    <div className="mt-6">
                                        {user ? userMenu : (
                                            <a
                                                onClick={() =>
                                                    loginModal.setCustomModal({
                                                        status: true,
                                                        icon: "success",
                                                        title: "",
                                                        text: "",
                                                    })
                                                }
                                                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                            >
                                                Login
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </Popover.Panel>
                </Transition>
            </Popover>

            {user
                ? <>
                    <MyProfileModal
                        isQuickViewOpen={profileModal.customModal.status}
                        setIsQuickViewOpen={profileModal.handleCustomModalClose}
                    />
                    <MyContractsModal
                        isQuickViewOpen={contractsModal.customModal.status}
                        setIsQuickViewOpen={contractsModal.handleCustomModalClose}
                    />
                    <MyQuestionsModal
                        isQuickViewOpen={questionsModal.customModal.status}
                        setIsQuickViewOpen={questionsModal.handleCustomModalClose}
                    />
                </>
                : <LoginModal
                    isQuickViewOpen={loginModal.customModal.status}
                    setIsQuickViewOpen={loginModal.handleCustomModalClose}
                />
            }
        </>
    );
}
