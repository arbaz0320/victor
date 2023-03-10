import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { LockClosedIcon } from "@heroicons/react/solid";
import { yupResolver } from "@hookform/resolvers/yup";
import Router from "next/router";
import { Fragment, useContext, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { AuthContext } from "../../context/AuthContext";
import { useCustomModal } from "../../hooks/useCustomModal";
import { RegisterModal } from "../RegisterModal";

type LoginQuickViewProps = {
    isQuickViewOpen: boolean;
    setIsQuickViewOpen: (state: boolean) => void;
    redirectModal?: boolean;
    email?: string;
};
interface IFormInputs {
    email: string;
    password: string;
    origin: string;
}

const schemaSign = yup.object().shape({
    email: yup.string().required("E-mail obrigatório"),
    password: yup.string().required("Digite sua senha"),
});

const schemaRecover = yup.object().shape({
    email: yup.string().required("E-mail obrigatório"),
});

export const LoginModal = ({
    isQuickViewOpen,
    setIsQuickViewOpen,
    redirectModal,
    email,
}: LoginQuickViewProps) => {
    const modal = useCustomModal();
    const [isRecoverPassword, setIsRecoverPassword] = useState<boolean>(false);

    const {
        register: signRegister,
        handleSubmit: signHandleSubmit,
        formState: { errors: signErrors },
    } = useForm<IFormInputs>({
        resolver: yupResolver(schemaSign),
    });
    const {
        register: recoverRegister,
        handleSubmit: recoverHandleSubmit,
        reset: recoverReset,
        formState: { errors: recoverErrors },
    } = useForm<IFormInputs>({
        resolver: yupResolver(schemaRecover),
    });
    const { signIn, recoverPassword, isLoading } = useContext(AuthContext);
    const completeButtonRef = useRef(null);

    async function handleSignIn(data: IFormInputs) {
        await signIn(data);
        setIsQuickViewOpen(false);
    }
    
    async function recoverPasswd(data: IFormInputs) {
        if (isRecoverPassword) {
            await recoverPassword(data);
            setIsQuickViewOpen(false);
            setIsRecoverPassword(false);
            recoverReset();
        }
    }

    return (
        <>
            <Transition.Root show={isQuickViewOpen} as={Fragment}>
                <Dialog
                    initialFocus={completeButtonRef}
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
                                <div className=" md:w-full md:h-24" />
                                <div className="w-full relative flex items-center justify-center bg-white px-4 pt-14 pb-8 overflow-hidden shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8 rounded-2xl">
                                    <button
                                        type="button"
                                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8"
                                        onClick={() => {
                                            setIsQuickViewOpen(false);
                                            redirectModal && Router.push("/");
                                        }}
                                        ref={completeButtonRef}
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
                                                <h2 className="mt-1 text-center text-2xl font-medium text-[#001a4e]" hidden={isRecoverPassword}>
                                                    Já tem uma conta? Entre aqui
                                                </h2>
                                                <h2 className="mt-1 text-center text-2xl font-medium text-[#001a4e]" hidden={!isRecoverPassword}>
                                                    Perdeu acesso? Redefina a senha
                                                </h2>
                                            </div>
                                            <form
                                                className="mt-8 space-y-6"
                                                action="#"
                                                method="POST"
                                                onSubmit={isRecoverPassword ? recoverHandleSubmit(
                                                    recoverPasswd
                                                ) : signHandleSubmit(
                                                    handleSignIn
                                                )}
                                            >
                                                <input
                                                    type="hidden"
                                                    name="remember"
                                                    defaultValue="true"
                                                />
                                                <div className="rounded-md -space-y-px">
                                                    <div>
                                                        <label
                                                            htmlFor="email"
                                                            className="sr-only"
                                                        >
                                                            CPF
                                                        </label>
                                                        <input
                                                            {...(isRecoverPassword ? recoverRegister("email") : signRegister("email"))}
                                                            id="email"
                                                            name="email"
                                                            type="email"
                                                            autoComplete="email"
                                                            required
                                                            className="appearance-none rounded relative block w-full h-14 px-3 py-2 border border-gray-300 bg-gray-100 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                                            placeholder="E-mail"
                                                            defaultValue={email ? email : ''}
                                                        />
                                                    </div>
                                                    {signErrors.email && (
                                                        <span className="text-red-600">
                                                            {signErrors.email.message}
                                                        </span>
                                                    )}
                                                    {recoverErrors.email && (
                                                        <span className="text-red-600">
                                                            {recoverErrors.email.message}
                                                        </span>
                                                    )}

                                                    <div hidden={isRecoverPassword}>
                                                        <label
                                                            htmlFor="password"
                                                            className="sr-only"
                                                        >
                                                            Password
                                                        </label>
                                                        <input
                                                            {...signRegister("password")}
                                                            id="password"
                                                            name="password"
                                                            type="password"
                                                            autoComplete="current-password"
                                                            required={!isRecoverPassword}
                                                            className="appearance-none rounded my-5 relative block w-full h-14 px-3 py-2 border border-gray-300 bg-gray-100 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                                            placeholder="Senha"
                                                        />
                                                    </div>
                                                    {signErrors.password && (
                                                        <span className="text-red-600">
                                                            {
                                                                signErrors.password
                                                                    .message
                                                            }
                                                        </span>
                                                    )}
                                                </div>

                                                <div>
                                                    <button
                                                        type="submit"
                                                        className="group relative w-full h-14 flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#001a4e] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-[#001a4e]"
                                                        disabled={isLoading}
                                                    >
                                                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                                            {isLoading && (
                                                                <svg role="status" className="inline w-5 h-5 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                                                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                                                                </svg>
                                                            )}
                                                            {!isLoading && (
                                                                <LockClosedIcon
                                                                    className="h-5 w-5 text-indigo-100 group-hover:text-indigo-400"
                                                                    aria-hidden="true"
                                                                />
                                                            )}
                                                        </span>
                                                        {isRecoverPassword ? 'RECUPERAR' : 'ENTRAR'}
                                                    </button>
                                                </div>
                                                <div>
                                                    <a
                                                        className="-m-2 p-2 block font-medium text-gray-900 text-center cursor-pointer"
                                                        onClick={() => setIsRecoverPassword(!isRecoverPassword)}
                                                    >
                                                        {isRecoverPassword ? 'Entrar' : 'Esqueci minha senha'}
                                                    </a>
                                                </div>
                                                <div className="flex justify-between">
                                                    <hr className="w-10/12 self-center" />
                                                    <p className=" font-semibold text-4xl mx-5 my-1">
                                                        ou
                                                    </p>
                                                    <hr className=" w-10/12 self-center" />
                                                </div>
                                                <div>
                                                    <a
                                                        onClick={() =>
                                                            modal.setCustomModal({
                                                                status: true,
                                                                icon: "success",
                                                                title: "",
                                                                text: "",
                                                            })
                                                        }
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setIsQuickViewOpen(
                                                                    false
                                                                );
                                                            }}
                                                            className="group relative w-full h-14 flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#5897b4] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                        >
                                                            QUERO ME CADASTRAR
                                                        </button>
                                                    </a>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    {/* content end */}
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            <RegisterModal
                isQuickViewOpen={modal.customModal.status}
                setIsQuickViewOpen={modal.handleCustomModalClose}
            />
        </>
    );
};
