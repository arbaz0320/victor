import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import Link from "next/link";
import Router from "next/router";
import { Fragment, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

type MyProfileProps = {
    isQuickViewOpen: boolean;
    setIsQuickViewOpen: (state: boolean) => void;
    redirectModal?: boolean;
};

export const MyProfileModal = ({
    isQuickViewOpen,
    setIsQuickViewOpen,
    redirectModal,
}: MyProfileProps) => {
    const { user } = useContext(AuthContext);

    return (
        <>
            <Transition.Root show={isQuickViewOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed z-50 inset-0 overflow-y-auto"
                    onClose={() => setIsQuickViewOpen(false)}
                >
                    <div
                        className="flex min-h-screen text-center md:block md:px-2 lg:px-4 z-50"
                        style={{ fontSize: 0 }}
                    >
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span
                            className="hidden md:inline-block md:align-middle md:h-screen"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                            enterTo="opacity-100 translate-y-0 md:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 md:scale-100"
                            leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
                        >
                            <div className="flex text-base text-left transform transition w-full md:inline-block md:max-w-2xl md:px-7 md:my-8 md:align-middle lg:max-w-2xl">
                                <div className="md:w-full md:h-24" />
                                <div className="w-full relative bg-white px-4 pt-14 pb-8 overflow-hidden shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8 rounded-2xl">
                                    <button
                                        type="button"
                                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8"
                                        onClick={() => {
                                            setIsQuickViewOpen(false);
                                            redirectModal && Router.push("/");
                                        }}
                                    >
                                        <span className="sr-only">Close</span>
                                        <XIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        />
                                    </button>

                                    {/* content */}
                                    <div className="min-h-full flex items-center justify-center py-5 px-4 md:mx-16 sm:px-6 lg:px-8">
                                        <div className="max-w-md w-full space-y-8 ">
                                            <div>
                                                <h2 className="mt-1 text-center text-2xl font-medium text-[#001a4e]">
                                                    Meus dados
                                                </h2>
                                            </div>
                                            <div className="rounded-md -space-y-px">
                                                <div className="mb-3">
                                                    <h6>Nome</h6>
                                                    <span>{user?.name}</span>
                                                </div>
                                                <div className="mb-3">
                                                    <h6>E-mail</h6>
                                                    <span>{user?.email}</span>
                                                </div>
                                                <div className="mb-3">
                                                    <h6>Plano</h6>
                                                    <span>{
                                                        user?.plan
                                                            ? `${user.plan.plan.name} (${user.plan.plan_type === 'yearly' ? 'Anual' : 'Mensal'})`
                                                            : 'Nenhum'
                                                    }</span>
                                                    <Link href="/#plans">
                                                        <a className="float-right" onClick={() => setIsQuickViewOpen(false)}>
                                                            {user?.plan ? 'Mudar plano' : 'Assinar um plano'}
                                                        </a>
                                                    </Link>
                                                </div>
                                            </div>
                                            {user?.plan && <small>
                                                Para efetuar o cancelamento do plano, entre em contato{' '}
                                                <Link href="/#contact">
                                                    <a onClick={() => setIsQuickViewOpen(false)}>
                                                        conosco.
                                                    </a>
                                                </Link>
                                            </small>}
                                        </div>
                                    </div>
                                    {/* content end */}
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    );
};
