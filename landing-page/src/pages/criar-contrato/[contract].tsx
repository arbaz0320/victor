import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import ReactHtmlParser from "react-html-parser";
import { MdChevronLeft } from "react-icons/md";
import api from "../../commons/api";
import BlockContractBox from "../../components/BlockContractBox";
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import ConsultComponent from "../../components/ConsultComponent";
import FieldContractBox from "../../components/FieldContractBox";
import { ContractProps } from "../../types/Contract";
import { ServiceProps } from "../../types/Service";

type CreateContractProps = {
  servicesInfo: ServiceProps[];
  contractInfo: ContractProps;
};

type GeneralProps = {
  [key: string]: string;
};

export default function CreateContract({
  servicesInfo,
  contractInfo,
}: CreateContractProps) {
  const [contract, setContract] = useState<ContractProps>();
  const [step, setStep] = useState<number>(0);
  const [contractVariables, setContractVariables] = useState<GeneralProps>({});
  const [answers, setAnswers] = useState<GeneralProps>({});
  const [blockAnswers, setBlockAnswers] = useState<{
    [key: string]: GeneralProps;
  }>({});
  const [blocks, setBlocks] = useState<any[]>([]);
  const [text, setText] = useState<string>("");
  const [hasSign, setHasSign] = useState<boolean | null>(null);
  const router = useRouter();

  const generateText = useCallback(
    (useUnderscore: boolean = true) => {
      let output = contract?.text || "";
      Object.keys(contractVariables).map((variable: string) => {
        if (contractVariables[variable] !== undefined) {
          output = output.replaceAll(
            `{{$${variable}}}`,
            contractVariables[variable] || ""
          );
        }
      });
      return prepareText(output, useUnderscore);
    },
    [contract, contractVariables]
  );

  // ? puxando modelo de contrato do backend
  useEffect(() => {
    if (contractInfo) {
      setStep(0);
      const contractId = `${contractInfo.id}`;
      if (contractId !== localStorage.getItem("contractId")) {
        localStorage.removeItem("answers");
        localStorage.removeItem("blockAnswers");
        localStorage.removeItem("contractVariables");
        localStorage.setItem("contractId", contractId);
      }
      setContract(contractInfo);
    }
  }, [contractInfo]);

  useEffect(() => {
    if (contract) {
      const savedAnswers = JSON.parse(localStorage.getItem("answers") || "{}");
      const savedBlockAnswers = JSON.parse(
        localStorage.getItem("blockAnswers") || "{}"
      );
      const savedContractVariables = JSON.parse(
        localStorage.getItem("contractVariables") || "{}"
      );

      setAnswers(savedAnswers);
      setBlockAnswers(savedBlockAnswers);
      setContractVariables(savedContractVariables);

      const output = [];
      for (const x in contract.block_or_fields) {
        output.push(contract.block_or_fields[x]);
      }
      if (!contract?.signatories || !contract.signatories.length) {
        setHasSign(false);
      }
      setBlocks(output);
    }
  }, [contract]);

  useEffect(() => {
    if (Object.keys(answers).length || Object.keys(blockAnswers).length) {
      localStorage.setItem("answers", JSON.stringify(answers));
      localStorage.setItem("blockAnswers", JSON.stringify(blockAnswers));
      localStorage.setItem(
        "contractVariables",
        JSON.stringify(contractVariables)
      );
    }
  }, [answers, blockAnswers, contractVariables]);

  useEffect(() => {
    setText(generateText());
  }, [generateText]);

  // ? atualiza o bloco com as variáveis preenchidas
  const updateBlock = useCallback((slug: string, newText: string) => {
    setContractVariables((state) => ({ ...state, [slug]: newText }));
  }, []);

  // ? atualiza o field com as variáveis preenchidas e salva as respostas para envio
  const updateAnswers = useCallback(
    (
      id: number,
      slug: string,
      newValue: string | string[],
      conditionalId: number = 0
    ) => {
      const answer = typeof newValue === "object" ? newValue[0] : newValue;
      const variable = typeof newValue === "object" ? newValue[1] : newValue;
      if (blocks[step].type === "block") {
        setBlockAnswers((state) => ({
          ...state,
          [conditionalId]: { ...state[conditionalId], [id]: answer },
        }));
      } else {
        setContractVariables((state) => ({
          ...state,
          [slug]: blocks[step].hide_answer ? "" : variable,
        }));
      }
      setAnswers((state) => {
        blocks.map((blockOrField) => {
          if (blockOrField.field_id === id) {
            delete state[blockOrField.id];
          }
        });
        return { ...state, [id]: answer };
      });
    },
    [blocks, step]
  );

  const checkCondition = (blockOrField: any) => {
    let ret = true;
    if (
      blockOrField.condition_type &&
      blockOrField.field_id &&
      blockOrField.field_value
    ) {
      if (
        (["true", "false"].includes(blockOrField.field_value) &&
          checkEmptyOrFilled(
            blockOrField.field_value === "true",
            answers[blockOrField.field_id]
          )) ||
        answers[blockOrField.field_id] == blockOrField.field_value
      ) {
        ret = blockOrField.condition_type === 1;
      } else {
        ret = blockOrField.condition_type === 2;
      }
    }
    return ret;
  };

  const nextStep = () => {
    let stepNext = 1;
    while (
      blocks[step + stepNext] &&
      !checkCondition(blocks[step + stepNext])
    ) {
      const slug = blocks[step + stepNext].slug;
      setContractVariables((state) => ({
        ...state,
        [slug]: null,
      }));
      stepNext++;
    }
    setStep(step + stepNext);
  };

  const backStep = () => {
    if (
      hasSign !== null &&
      contract?.signatories &&
      contract.signatories.length > 0
    ) {
      setHasSign(null);
    } else {
      let backStep = 1;
      while (
        blocks[step - backStep] &&
        (!checkCondition(blocks[step - backStep]) ||
          (blocks[step - backStep].type === "block" &&
            blocks[step - backStep].conditionals.length === 1 &&
            !Object.keys(
              blocks[step - backStep].conditionals[0].fields_in_conditional
            ).length))
      ) {
        backStep++;
      }
      setStep(step - backStep);
    }
  };

  // ! envia o contrato para o backend
  async function sendContract() {
    try {
      router.push(
        {
          pathname: "/checkout",
          query: {
            contract: JSON.stringify({
              contract,
              answers,
              blockAnswers,
              text: generateText(false),
              hasSign,
            }),
          },
        },
        "/checkout"
      );
    } catch (e: any) {
      console.log("erro->", e.message);
      alert("falha de conexão");
    }
  }

  return (
    <div className="py-36 container">
      <div className="mt-2 px-3 flex w-full items-center justify-between">
        <div className="w-24">
          <PrimaryButton onClick={useCallback(() => router.back(), [router])}>
            <MdChevronLeft size={25} />
          </PrimaryButton>
        </div>
        <h2 className="md:my-5 text-sm sm:text-base md:text-2xl font-extrabold text-gray-900 text-center">
          Preencha para criar seu contrato
        </h2>
        <div className="w-24"></div>
      </div>

      <div className="grid grid-cols-12 md:gap-10 container">
        <div className="col-span-12 lg:col-span-5 ">
          <div className="">
            {
              // * fields das variaveis do contrato
              blocks.length > 0 && step < blocks.length && (
                <div>
                  {blocks[step].type === "block" ? (
                    <BlockContractBox
                      block={blocks[step]}
                      step={step}
                      changeBlock={updateBlock}
                      changeField={updateAnswers}
                      stepBack={() => backStep()}
                      nextStep={() => nextStep()}
                      answers={blockAnswers}
                    />
                  ) : (
                    <FieldContractBox
                      field={blocks[step]}
                      hasBack={step > 0}
                      changeField={updateAnswers}
                      stepBack={() => backStep()}
                      nextStep={() => nextStep()}
                      value={answers[blocks[step].id]}
                    />
                  )}
                </div>
              )
            }
            {
              // * quando o contrato está finalizado
              step === blocks.length && hasSign !== null && (
                <div className="bg-white w-full shadow px-4 py-4 sm:rounded-lg p-6">
                  <h2 className=" text-center text-2xl mb-32 font-extrabold text-gray-900 ">
                    Contrato preenchido!
                  </h2>
                  <div className="mt-16 flex gap-4 justify-between">
                    <PrimaryButton title="Voltar" onClick={backStep} />
                    <PrimaryButton
                      title="Finalizar Contrato"
                      onClick={sendContract}
                    />
                  </div>
                </div>
              )
            }
            {
              // * quando o contrato está finalizado
              step === blocks.length && hasSign === null && (
                <div className="bg-white w-full shadow px-4 py-4 sm:rounded-lg sm:p-6 relative">
                  <h2 className=" text-center text-2xl mb-16 mt-8 font-extrabold text-gray-900">
                    Deseja realizar a assinatura digital deste contrato?
                  </h2>
                  <div className="mt-8 flex gap-4 justify-between">
                    <div className="absolute top-3 right-3">
                      <PrimaryButton title="Voltar" onClick={backStep} />
                    </div>
                    <button
                      className="w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-800"
                      onClick={() => setHasSign(false)}
                    >
                      Não
                    </button>
                    <button
                      className="w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-800"
                      onClick={() => setHasSign(true)}
                    >
                      Sim
                    </button>
                  </div>
                </div>
              )
            }
            <ConsultComponent list={servicesInfo} widget={true} />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-7 mt-8 w-full relative ">
          <div className="absolute w-full h-full bg-transparent"></div>
          <div className="bg-white rounded-lg shadow-xl p-4">
            <h1 className="mb-5 text-center text-2xl font-extrabold text-gray-900">
              {contract && contract.title}
            </h1>
            <div
              className="unselectable contract-render"
              onCopy={(e) => e.preventDefault()}
              onCut={(e) => e.preventDefault()}
            >
              {contract && ReactHtmlParser(text)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  // serviços
  const servicesReponse = await api.get(`public-routes/right-area?other=1`);
  const servicesInfo = await servicesReponse.data.data;

  // contract
  const contractId = query.contract;
  let contractInfo = null;
  if (contractId) {
    const contractReponse = await api.get(
      `public-routes/contract/${contractId}`
    );
    contractInfo = await contractReponse.data.data;

    if (
      contractInfo &&
      contractInfo.presentation_path &&
      query.show === undefined
    ) {
      return {
        redirect: {
          destination: contractInfo.presentation_path,
          permanent: false,
        },
      };
    }
  }

  return {
    props: {
      servicesInfo,
      contractInfo,
    },
  };
};

const checkEmptyOrFilled = (filled: boolean, value: string = "") => {
  return filled ? value !== "" : value === "";
};

const applyIndex = (contract: string) => {
  const output: string[] = [];
  const indexes = contract.split("{{$index_}}");
  indexes.forEach((index, idx) => {
    const subIndexes = index.split("{{$subindex_}}");
    const subOutput = subIndexes.map((subIndex, subIdx) => {
      if (subIdx < subIndexes.length - 1) {
        subIndex += `${idx}.${subIdx + 1}`;
      }
      return subIndex;
    });

    index = subOutput.join("");
    if (idx < indexes.length - 1) {
      index += idx + 1;
    }
    output.push(index);
  });
  return output.join("");
};

const prepareText = (text: string, useUnderscore: boolean = true) => {
  return applyIndex(text).replaceAll(
    /{{\$(.*?)}}/g,
    useUnderscore ? "__________" : ""
  );
};
