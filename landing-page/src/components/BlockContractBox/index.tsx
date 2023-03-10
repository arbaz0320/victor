import { useEffect, useMemo, useState } from "react";
import PrimaryButton from "../Buttons/PrimaryButton";
import FieldContractBox from "../FieldContractBox";
import { generateVariable as genVarCheckbox } from "../FieldContractBox/_checkbox";
import { generateVariable as genVarRadio } from "../FieldContractBox/_radio";
import { generateVariable as genVarSelect } from "../FieldContractBox/_select";
import { generateVariable as genVarText } from "../FieldContractBox/_text";

const generateVariable: { [key: string]: any } = {
    checkbox: genVarCheckbox,
    radio: genVarRadio,
    select: genVarSelect,
    text: genVarText,
};

type ContractBoxProps = {
    block: any;
    step: number;
    changeField: (
        id: number,
        slug: string,
        newValue: string | string[],
        conditionalId?: number
    ) => void;
    changeBlock: (slug: string, newText: string) => void;
    stepBack: () => void;
    nextStep: () => void;
    answers: any;
};

export default function BlockContractBox({
    block,
    step,
    changeField,
    changeBlock,
    stepBack,
    nextStep,
    answers,
}: ContractBoxProps) {
    const [blockStep, setBlockStep] = useState<number>(0);
    const [showConditionalFields, setShowConditionalFields] =
        useState<boolean>(false);
    const [conditional, setConditional] = useState<any>();
    const [blockVariables, setBlockVariables] = useState<{
        [key: string]: string;
    }>({});

    const blockKeys: any[] = useMemo(
        () =>
            conditional !== undefined
                ? Object.keys(conditional.fields_in_conditional)
                : [],
        [conditional]
    );
    const blockKey: string = blockKeys.length ? blockKeys[blockStep] : "";

    useEffect(() => {
        if (block) {
            setBlockStep(0);
            if (Object.keys(block.conditionals).length === 1) {
                setConditional(block.conditionals[0]);
            }
        }

        return () => {
            setShowConditionalFields(false);
            setConditional(undefined);
            setBlockVariables({});
        };
    }, [block]);

    useEffect(() => {
        if (conditional && answers[conditional.id]) {
            const getAnswer = (key: string): string => {
                const field: any = conditional.fields_in_conditional[key];
                if (field.hide_answer) {
                    return "";
                }
                const answer =
                    answers[conditional.id] &&
                    answers[conditional.id][
                        conditional.fields_in_conditional[key]?.id
                    ];
                const options: any[] =
                    conditional.fields_in_conditional[key]?.options;
                return answer !== undefined && generateVariable[field.type]
                    ? options.length > 0
                        ? generateVariable[field.type](answer, options)
                        : field.mask && field.mask === "money"
                        ? generateVariable[field.type](answer)
                        : answer
                    : answer;
            };
            const prepareVariables = (text: string) => {
                const target: { [key: string]: string } = {};
                const matches = Array.from(text.matchAll(/{{\$(.*?)}}/g))
                    .map((match) => match[1])
                    .filter((match) => match.slice(-1) !== "_");
                matches.forEach((key) => (target[key] = getAnswer(key)));
                return target;
            };

            if (conditional?.text) {
                setBlockVariables(prepareVariables(conditional.text));
            }
        }
    }, [answers, conditional]);

    useEffect(() => {
        if (conditional) {
            let output = conditional.text;
            if (output) {
                Object.keys(blockVariables).map((variable: string) => {
                    if (blockVariables[variable]) {
                        output = output.replaceAll(
                            `{{$${variable}}}`,
                            blockVariables[variable]
                        );
                    }
                });
            }
            changeBlock(block.slug, output);
        }
    }, [block, blockVariables, changeBlock, conditional]);

    const goToNextStep = () => {
        setShowConditionalFields(false);
        setConditional(undefined);
        nextStep();
    };

    const nextBlockStep = () => {
        let nStep = 1;
        while (
            !conditional.fields_in_conditional[blockKeys[blockStep + nStep]]
        ) {
            if (blockStep + nStep >= blockKeys.length) {
                goToNextStep();
                break;
            }
            nStep++;
        }
        if (blockStep + nStep < blockKeys.length) {
            setBlockStep(blockStep + nStep);
        }
    };

    const checkCondition = (field: any, onlyCheck: boolean = false) => {
        let ret = true;
        if (
            answers[conditional.id] &&
            field.condition_type &&
            field.field_id &&
            field.field_value
        ) {
            if (
                (["true", "false"].includes(field.field_value) &&
                    checkEmptyOrFilled(
                        field.field_value === "true",
                        answers[conditional.id][field.field_id]
                    )) ||
                answers[conditional.id][field.field_id] == field.field_value
            ) {
                ret = field.condition_type === 1;
            } else {
                ret = field.condition_type === 2;
            }
        }
        if (!onlyCheck && !ret) {
            nextBlockStep();
        }
        return ret;
    };

    const backBlockStep = () => {
        let backStep = 1;
        while (
            blockStep - backStep >= 0 &&
            !checkCondition(
                conditional.fields_in_conditional[
                    blockKeys[blockStep - backStep]
                ],
                true
            )
        ) {
            backStep++;
        }

        if (blockStep - backStep >= 0) {
            setBlockStep(blockStep - backStep);
        } else if (showConditionalFields && block.conditionals.length > 1) {
            setConditional(undefined);
            setShowConditionalFields(false);
        } else {
            setBlockVariables({});
            changeBlock(block.slug, "");
            setConditional(undefined);
            stepBack();
        }
    };

    // ? atualiza o texto com as variáveis preenchidas
    const updateText = (
        id: number,
        slug: string,
        newValue: string | string[]
    ) => {
        changeField(id, slug, newValue, conditional.id);
        if (!conditional.fields_in_conditional[blockKey].hide_answer) {
            setBlockVariables((state) => ({
                ...state,
                [slug]: typeof newValue === "object" ? newValue[1] : newValue,
            }));
        }
    };

    if (!block) {
        return <></>;
    }

    if (conditional && !blockKeys.length) {
        setTimeout(goToNextStep, 10);
    }

    return (
        <div className="bg-white w-full shadow-inner px-4 pb-5 sm:rounded-lg p-6">
            <div className="relative md:grid  md:gap-6">
                <div className="md:col-span-1">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 flex">
                        <span>{block.title}</span>
                        <span className="min-w-[85px]">&nbsp;</span>
                    </h3>
                    {!showConditionalFields &&
                        block.conditionals.length > 1 && (
                            <>
                                <p className="mt-1 text text-gray-500">
                                    {block.question}
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                    {block.description}
                                </p>
                            </>
                        )}
                </div>
                <div className="md:mt-0 md:col-span-2">
                    {block.conditionals.length === 1 &&
                        conditional &&
                        conditional.fields_in_conditional[blockKey] &&
                        checkCondition(
                            conditional.fields_in_conditional[blockKey]
                        ) && (
                            <FieldContractBox
                                field={
                                    conditional.fields_in_conditional[blockKey]
                                }
                                hasBack={step > 0 || blockStep > 0}
                                changeField={(...props) => updateText(...props)}
                                stepBack={() => backBlockStep()}
                                nextStep={() => nextBlockStep()}
                                value={
                                    answers[conditional.id] &&
                                    answers[conditional.id][
                                        conditional.fields_in_conditional[
                                            blockKey
                                        ].id
                                    ]
                                }
                            />
                        )}
                    {block.conditionals.length > 1 && (
                        <div className="flex gap-4 justify-center flex-wrap">
                            {!showConditionalFields && (
                                <div className="absolute -top-1 -right-1">
                                    {step > 0 && (
                                        <PrimaryButton
                                            title="Voltar"
                                            onClick={() => {
                                                setBlockVariables({});
                                                changeBlock(block.slug, "");
                                                stepBack();
                                            }}
                                        />
                                    )}
                                </div>
                            )}
                            {!showConditionalFields &&
                                block.conditionals.map(
                                    (conditional: any, idx: number) => (
                                        <PrimaryButton
                                            key={idx}
                                            title={conditional.label}
                                            style={{ width: "auto" }}
                                            onClick={() => {
                                                const cond =
                                                    block.conditionals[idx];
                                                const keys = Object.keys(
                                                    cond.fields_in_conditional
                                                );
                                                setConditional(cond);
                                                if (keys.length > 0) {
                                                    setShowConditionalFields(
                                                        true
                                                    );
                                                }
                                            }}
                                        />
                                    )
                                )}
                            {showConditionalFields &&
                                conditional &&
                                conditional.fields_in_conditional[blockKey] &&
                                checkCondition(
                                    conditional.fields_in_conditional[blockKey]
                                ) && (
                                    <FieldContractBox
                                        field={
                                            conditional.fields_in_conditional[
                                                blockKey
                                            ]
                                        }
                                        hasBack={true}
                                        changeField={(...props) =>
                                            updateText(...props)
                                        }
                                        stepBack={() => backBlockStep()}
                                        nextStep={() => nextBlockStep()}
                                        value={
                                            answers[conditional.id] &&
                                            answers[conditional.id][
                                                conditional
                                                    .fields_in_conditional[
                                                    blockKey
                                                ].id
                                            ]
                                        }
                                    />
                                )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const checkEmptyOrFilled = (filled: boolean, value: string = "") => {
    return filled ? value !== "" : value === "";
};
