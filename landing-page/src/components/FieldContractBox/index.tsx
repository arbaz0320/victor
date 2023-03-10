import PrimaryButton from "../Buttons/PrimaryButton";
import CheckboxField from "./_checkbox";
import DateField from "./_date";
import NumberField from "./_number";
import RadioField from "./_radio";
import SelectField from "./_select";
import TextField from "./_text";

type ContractBoxProps = {
    field: any;
    hasBack: boolean;
    changeField: (
        id: number,
        slug: string,
        newValue: string | string[]
    ) => void;
    stepBack: () => void;
    nextStep: () => void;
    value: string;
};

export default function FieldContractBox({
    field,
    hasBack,
    changeField,
    stepBack,
    nextStep,
    value,
}: ContractBoxProps) {
    const checkEmail = () => {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
    };

    const checkValue = () => {
        return value && (field.type === "email" ? checkEmail() : true);
    };

    const TypedField: { [key: string]: any } = {
        text: TextField,
        email: TextField,
        number: NumberField,
        select: SelectField,
        radio: RadioField,
        checkbox: CheckboxField,
        date: DateField,
    };

    if (!field) {
        return <></>;
    }

    return (
        <>
            <div className="bg-white w-full shadow px-4 pb-5 sm:rounded-lg p-6">
                <div className="md:grid  md:gap-4">
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">
                            {field.question}
                            <span className="text-red-500">
                                {field.required ? " *" : ""}
                            </span>
                        </h3>
                        <p className="mt-3 text text-gray-500">
                            {field.description}
                        </p>
                    </div>
                    <div className="md:mt-0 md:col-span-2">
                        <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-6">
                                {TypedField[field.type]({
                                    field,
                                    changeField,
                                    value,
                                })}
                            </div>
                        </div>
                        <div className="mt-10 flex gap-4 justify-between">
                            {hasBack && (
                                <PrimaryButton
                                    title="Voltar"
                                    onClick={() => stepBack()}
                                />
                            )}
                            <PrimaryButton
                                title="Próximo"
                                onClick={() =>
                                    field.required
                                        ? checkValue() && nextStep()
                                        : nextStep()
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
