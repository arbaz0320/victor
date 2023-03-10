import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import Router from "next/router";
import { Fragment, useEffect, useState } from "react";
import api from "../../commons/api";

type MyContractsProps = {
  isQuickViewOpen: boolean;
  setIsQuickViewOpen: (state: boolean) => void;
  redirectModal?: boolean;
};

export const MyContractsModal = ({
  isQuickViewOpen,
  setIsQuickViewOpen,
  redirectModal,
}: MyContractsProps) => {
  const [contracts, setContracts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isQuickViewOpen) {
      api
        .get(`/contract-generated`)
        .then((response) => response.data)
        .then((data) => {
          setContracts(data.data);
        });
    }
  }, [isQuickViewOpen]);

  const downloadPdf = (id: number, name: string) => {
    setIsLoading(true);
    api
      .get(`contract-generated/to-pdf/${id}`, {
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", name);
        document.body.appendChild(link);
        link.click();
      })
      .finally(() => setIsLoading(false));
  };

  const downloadWord = (id: number, name: string) => {
    setIsLoading(true);
    api
      .get(`contract-generated/to-word/${id}`, {
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", name);
        document.body.appendChild(link);
        link.click();
      })
      .finally(() => setIsLoading(false));
  };

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
                <div className=" md:w-full md:h-24" />
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
                    <XIcon className="h-5 w-5" aria-hidden="true" />
                  </button>

                  {/* content */}
                  <div className="min-h-full flex items-center justify-center">
                    <div className="w-full space-y-8">
                      <div>
                        <h2 className="mt-1 text-center text-2xl font-medium text-[#001a4e]">
                          Meus contratos
                        </h2>
                      </div>
                      <div className="rounded-md -space-y-px">
                        <table className="border-collapse w-full">
                          <thead className="text-xs text-white uppercase">
                            <tr>
                              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden md:table-cell">
                                Contrato
                              </th>
                              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden md:table-cell">
                                Status
                              </th>
                              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden md:table-cell">
                                Data
                              </th>
                              <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden md:table-cell">
                                Download
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {contracts.map((contract: any, idx: number) => {
                              const contractName =
                                contract.order.description.replace(
                                  "Compra do contrato: ",
                                  ""
                                );
                              const contractStatus =
                                contract.order.status === "approved"
                                  ? "Aprovado"
                                  : contract.order.status === "in_process"
                                  ? "Em análise"
                                  : "Reprovado";
                              return (
                                <tr
                                  className="bg-white md:hover:bg-gray-100 flex md:table-row flex-row md:flex-row flex-wrap md:flex-no-wrap mb-4 md:mb-0"
                                  key={idx}
                                >
                                  <td className="w-full md:w-auto py-4 px-3 text-gray-800 text-center border border-b block md:table-cell relative md:static">
                                    <span className="md:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                                      Contrato
                                    </span>
                                    {contractName}
                                  </td>
                                  <td className="w-full md:w-auto py-4 px-3 text-gray-800 text-center border border-b block md:table-cell relative md:static">
                                    <span className="md:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                                      Status
                                    </span>
                                    {contractStatus}
                                  </td>
                                  <td className="w-full md:w-auto p-3 text-gray-800 text-center border border-b block md:table-cell relative md:static">
                                    <span className="md:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                                      Data
                                    </span>
                                    {format(
                                      new Date(contract.created_at),
                                      "P",
                                      { locale: ptBR }
                                    )}
                                  </td>
                                  <td className="w-full md:w-auto p-3 text-gray-800 text-center border border-b block md:table-cell relative md:static">
                                    <span className="md:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                                      Download
                                    </span>
                                    <div className="inline-flex">
                                      <button
                                        type="button"
                                        className="py-2 px-2 text-sm font-medium rounded-l text-white bg-[#001a4e] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-[#001a4e]"
                                        disabled={
                                          isLoading ||
                                          contract.order.status !== "approved"
                                        }
                                        onClick={() =>
                                          downloadPdf(
                                            contract.id,
                                            `${contractName}.pdf`
                                          )
                                        }
                                      >
                                        {isLoading && (
                                          <svg
                                            role="status"
                                            className="inline w-5 h-5 text-white animate-spin"
                                            viewBox="0 0 100 101"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                              fill="#E5E7EB"
                                            />
                                            <path
                                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                              fill="currentColor"
                                            />
                                          </svg>
                                        )}
                                        {!isLoading && "PDF"}
                                      </button>
                                      <button
                                        type="button"
                                        className="py-2 px-2 text-sm font-medium rounded-r text-white bg-[#001a4e] hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-[#001a4e]"
                                        disabled={
                                          isLoading ||
                                          contract.order.status !== "approved"
                                        }
                                        onClick={() =>
                                          downloadWord(
                                            contract.id,
                                            `${contractName}.doc`
                                          )
                                        }
                                      >
                                        {isLoading && (
                                          <svg
                                            role="status"
                                            className="inline w-5 h-5 text-white animate-spin"
                                            viewBox="0 0 100 101"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                              fill="#E5E7EB"
                                            />
                                            <path
                                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                              fill="currentColor"
                                            />
                                          </svg>
                                        )}
                                        {!isLoading && "Word"}
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
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
