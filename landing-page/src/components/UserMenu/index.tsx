import { Menu, Transition } from "@headlessui/react";
import {
    ChevronDownIcon
} from "@heroicons/react/outline";
import { Fragment, useContext } from "react";

import { AuthContext } from "../../context/AuthContext";

function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
}

type UserMenuProps = {
    profileModal: any
    contractsModal: any
    questionsModal: any
};

export default function UserMenu({
    profileModal,
    contractsModal,
    questionsModal,
}: UserMenuProps) {
    const { user, logOut } = useContext(AuthContext);

    const userNavigation = [
        {
            name: "Seu Perfil",
            action: () => {
                profileModal.setCustomModal({
                    status: true,
                    icon: "success",
                    title: "",
                    text: "",
                })
            },
        },
        {
            name: "Seus Contratos",
            action: () => {
                contractsModal.setCustomModal({
                    status: true,
                    icon: "success",
                    title: "",
                    text: "",
                })
            },
        },
        {
            name: "Suas Consultas",
            action: () => {
                questionsModal.setCustomModal({
                    status: true,
                    icon: "success",
                    title: "",
                    text: "",
                })
            },
        },
        {
            name: "Sair",
            action: () => {
                logOut();
            },
        },
    ];

    const headerName = user?.name.split(" ", 2);

    return (
        <div className="flex-1 justify-between flex">
            <div className="flex-1 md:flex hidden"></div>
            <div className="flex items-center w-full">
                {/* Profile dropdown */}
                <Menu as="div" className="ml-3 relative w-full">
                    <div>
                        <Menu.Button className="w-full bg-transparent text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <span className="sr-only">Open user menu</span>
                            <div className="flex items-center justify-center gap-3 px-2">
                                <div className="h-8 text-white flex items-center font-medium">
                                    {headerName && headerName[0]}
                                </div>
                                <ChevronDownIcon className="h-4 w-4" />
                            </div>
                        </Menu.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {userNavigation.map((item) => (
                                <Menu.Item key={item.name}>
                                    {({ active }) => (
                                        <span
                                            className={classNames(
                                                active ? "bg-gray-100" : "",
                                                "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                                            )}
                                            onClick={item?.action}
                                        >
                                            {item.name}
                                        </span>
                                    )}
                                </Menu.Item>
                            ))}
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </div>
    );
}
