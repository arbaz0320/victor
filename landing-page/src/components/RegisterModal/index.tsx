import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { LockClosedIcon } from "@heroicons/react/solid";
import { yupResolver } from "@hookform/resolvers/yup";
import Router from "next/router";
import { Fragment, useContext, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import api from "../../commons/api";
import { AlertModal } from "../../components/AlertModal";
import { AuthContext } from "../../context/AuthContext";
import { useCustomModal } from "../../hooks/useCustomModal";

type RegisterQuickViewProps = {
    isQuickViewOpen: boolean;
    setIsQuickViewOpen: (state: boolean) => void;
    redirectModal?: boolean;
    email?: string;
};
interface RegistrationProps {
    name: string;
    email: string;
    password: string;
    phone: string;
    confirmPassword: string;
    user_terms: boolean;
}

const schema = yup.object().shape({
    name: yup.string().required("Campo obrigatório"),

    email: yup
        .string()
        .required("Campo obrigatório")
        .email("Digite um e-mail válido"),
    user_terms: yup
        .boolean()
        .required("Concorde com os termos")
        .oneOf([true], "Concorde com os termos"),
    password: yup
        .string()
        .required("Senha obrigatória")
        .min(6, "Mínimo 6 digitos"),
    confirmPassword: yup
        .string()
        .required("Confirme a senha")
        .oneOf([yup.ref("password"), null], "As senhas precisam ser iguais"),
});

export const RegisterModal = ({
    isQuickViewOpen,
    setIsQuickViewOpen,
    redirectModal,
    email,
}: RegisterQuickViewProps) => {
    const modal = useCustomModal();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { signIn } = useContext(AuthContext);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegistrationProps>({
        resolver: yupResolver(schema),
    });
    const completeButtonRef = useRef(null);

    async function handleRegister(data: RegistrationProps) {
        setIsLoading(true);
        const dados = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: data.password,
        };
        console.log(data);
        try {
            await api.post("public-routes/user", dados);
            modal.setCustomModal({
                status: true,
                icon: "success",
                title: "Cadastro realizado com sucesso!",
                text: "Agora você já pode acessar a sua conta!",
            });
            setTimeout(() => {
                //modal.handleCustomModalClose();
                //setIsQuickViewOpen(false);
                //signIn({ email: data.email, password: data.password, origin: 'web' });
            }, 1000);
        } catch (e) {
            modal.setCustomModal({
                status: true,
                icon: "error",
                title: "Não foi possivel realizar o cadastro",
                text: "Usuário já está cadastrado na base de dados",
            });
        }
        setIsLoading(false);
    }

    return (
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
                                <div className="min-h-full w-full py-5 px-4 sm:px-6 lg:px-8">
                                    <div className="w-full space-y-8">
                                        <div>
                                            <h2 className="mt-1 text-center text-2xl font-medium text-[#001a4e]">
                                                Cadastro de usuário
                                            </h2>
                                        </div>
                                        <form
                                            className="mt-8 space-y-6"
                                            action="#"
                                            method="POST"
                                            id="registerForm"
                                            onSubmit={handleSubmit(handleRegister)}
                                        >
                                            <div className="grid grid-cols-6 gap-6">
                                                <div className="col-span-6 sm:col-span-3">
                                                    <label
                                                        htmlFor="name"
                                                        className="block text-sm font-medium text-gray-700"
                                                    >
                                                        Nome
                                                    </label>
                                                    <input
                                                        {...register("name")}
                                                        type="text"
                                                        name="name"
                                                        id="name"
                                                        autoComplete="given-name"
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                                    />
                                                    {errors.name && (
                                                        <span className="text-red-600">
                                                            {errors.name.message}
                                                        </span>
                                                    )}
                                                </div>

                                                 <div className="col-span-6 sm:col-span-3">
                                                    <label
                                                        htmlFor="phone"
                                                        className="block text-sm font-medium text-gray-700"
                                                    >
                                                        Telefone
                                                    </label>
                                                    <input
                                                        {...register("phone")}
                                                        type="text"
                                                        name="phone"
                                                        id="phone"
                                                        autoComplete="given-phone"
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                                    />
                                                    {errors.phone && (
                                                        <span className="text-red-600">
                                                            {errors.phone.message}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="col-span-6 sm:col-span-3">
                                                    <label
                                                        htmlFor="email"
                                                        className="block text-sm font-medium text-gray-700"
                                                    >
                                                        E-mail
                                                    </label>
                                                    <input
                                                        {...register("email")}
                                                        type="email"
                                                        name="email"
                                                        id="email"
                                                        autoComplete="given-email"
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                                        defaultValue={email ? email : ''}
                                                    />
                                                    {errors.email && (
                                                        <span className="text-red-600">
                                                            {errors.email.message}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="col-span-6 sm:col-span-3">
                                                    <label
                                                        htmlFor="password"
                                                        className="block text-sm font-medium text-gray-700"
                                                    >
                                                        Senha
                                                    </label>
                                                    <input
                                                        {...register("password")}
                                                        type="password"
                                                        name="password"
                                                        id="password"
                                                        autoComplete="given-password"
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                                    />
                                                    {errors.password && (
                                                        <span className="text-red-600">
                                                            {errors.password.message}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="col-span-6 sm:col-span-3">
                                                    <label
                                                        htmlFor="confirmPassword"
                                                        className="block text-sm font-medium text-gray-700"
                                                    >
                                                        Confirme sua senha
                                                    </label>
                                                    <input
                                                        {...register("confirmPassword")}
                                                        type="password"
                                                        name="confirmPassword"
                                                        id="confirmPassword"
                                                        autoComplete="given-confirmPassword"
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                                    />
                                                    {errors.confirmPassword && (
                                                        <span className="text-red-600">
                                                            {errors.confirmPassword.message}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="col-span-6 sm:col-span-6">
                                                    <label
                                                        htmlFor="user_terms"
                                                        className="block text-sm font-medium text-gray-700"
                                                    >
                                                        Termo de Aceite
                                                    </label>
                                                    <div className="relative flex items-center h-10">
                                                        <div className="flex items-center h-5">
                                                            <input
                                                                {...register("user_terms")}
                                                                id="user_terms"
                                                                aria-describedby="user_terms"
                                                                name="user_terms"
                                                                type="checkbox"
                                                                className="focus:ring-mainDarkRed h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                                            />
                                                        </div>
                                                        <div className="ml-2 text-sm flex items-center mt-2">
                                                            <label className="text-gray-700" htmlFor="user_terms">
                                                                Concorda com <a href="/terms" target="_blank">termos de uso</a>
                                                            </label>
                                                        </div>
                                                    </div>
                                                    {errors.user_terms && (
                                                        <span className="text-red-600">
                                                            {errors.user_terms.message}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <button
                                                    type="submit"
                                                    className="group relative w-full h-14 flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#001a4e] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-[#001a4e]"
                                                    disabled={isLoading}
                                                    form="registerForm"
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
                                                    Cadastrar
                                                </button>
                                            </div>
                                        </form>
                                        <AlertModal
                                            type={modal.customModal.icon}
                                            title={modal.customModal.title}
                                            description={modal.customModal.text}
                                            isOpen={modal.customModal.status}
                                            setIsOpen={modal.handleCustomModalClose}
                                            confirmButton={modal.customModal.confirmButton}
                                        />
                                    </div>
                                </div>
                                {/* content end */}
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
};
