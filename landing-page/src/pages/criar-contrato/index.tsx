import { useEffect, useState } from "react";
import api from "../../commons/api";

import Link from "next/link";
import { ContractProps } from "../../types/Contract";

type ContractTypesProps = {
    [key: number]: string;
};

export default function CreateContract() {
    const [contractList, setContractLIst] = useState<ContractProps[]>();
    const [contractTypes, setContractTypes] = useState<ContractTypesProps>({});
    const [search, setSearch] = useState<string>();

    useEffect(() => {
        const getContractTypes = (): ContractTypesProps => {
            const types: ContractTypesProps = {};
            contractList?.forEach(contract => {
                !types[contract.type_id] && (types[contract.type.id] = contract.type.title);
            })
            return types;
        };

        setContractTypes(
            getContractTypes()
        )
    }, [contractList]);

    useEffect(() => {
        async function getContract() {
            try {
                const { data } = await api.get("public-routes/contract");
                setContractLIst(data.data);
            } catch {
                console.log("deu ruim");
            }
        }

        getContract();
    }, []);

    return (
        <div className="py-36 container">
            <div className="md:mt-10 relative">
                <h2 className="text-left text-2xl font-extrabold text-gray-900">
                    Contratos
                </h2>
                <div className="form-group w-72 md:absolute top-0 right-0">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar contratos..."
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {Object.keys(contractTypes).map((key, idx) => (
                <div key={idx}>
                    <h2>{contractTypes[parseInt(key)]}</h2>
                    <ul
                        role="list"
                        className="divide-y divide-gray-200 flex flex-col gap-y-3 mb-9"
                    >
                        {contractList
                            ?.filter(
                                item => item.type_id === parseInt(key)
                                && (
                                    !search
                                    || item.title.search(new RegExp(search, "i")) !== -1
                                    || item.description.search(new RegExp(search, "i")) !== -1
                                )
                            ).map(item => (
                            <Link href={`/criar-contrato/${item.id}`} key={item.id}>
                                <a>
                                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                                        <div className="px-4 py-3 sm:px-6">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                {item.title}
                                            </h3>
                                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                                {item.description}
                                            </p>
                                            <p className="text-lg leading-6 font-medium text-gray-900 text-right">
                                                {item.price.toLocaleString('pt-BR', {
                                                    style: "currency",
                                                    currency: "BRL",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </a>
                            </Link>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}
