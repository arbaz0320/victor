import { ContractProps } from "../../types/Contract";
import { PlanInfoProps } from "../../types/PlanInfo";
import { ServiceProps } from "../../types/Service";
import CheckoutForm from "../CheckoutForm";

type CheckoutProps = {
    plan?: {
        plan: PlanInfoProps,
        type: boolean
    };
    consult?: {
        service: ServiceProps,
        question: string
    }
    contract?: {
        contract: ContractProps,
        answers: any,
        blockAnswers: any,
        text: string,
        hasSign: boolean
    }
};

export default function Checkout({
    plan,
    consult,
    contract,
}: CheckoutProps) {
    if (!plan && !consult && !contract) {
        return (
            <div className="py-36 container">
                <h5 className="text-center mt-10">Selecione um contrato, plano ou realize uma consulta!</h5>
            </div>
        )
    }

    return (
        <div className="py-36 container">
            <CheckoutForm plan={plan} consult={consult} contract={contract} />
        </div>
    );
}
