import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Checkout from "../../components/Checkout";
import { ContractProps } from "../../types/Contract";
import { PlanInfoProps } from "../../types/PlanInfo";
import { ServiceProps } from "../../types/Service";

type PlanProps = {
    plan: PlanInfoProps,
    type: boolean
}
type ConsultProps = {
    service: ServiceProps,
    question: string
};
type ContractInfoProps = {
    contract: ContractProps,
    answers: any,
    blockAnswers: any,
    text: string,
    hasSign: boolean
};

export default function CheckoutPage() {
    const router = useRouter()
    const [plan, setPlan] = useState<PlanProps>();
    const [consult, setConsult] = useState<ConsultProps>();
    const [contract, setContract] = useState<ContractInfoProps>();

    useEffect(() => {
        const json = router.query.plan as string;
        json && setPlan(
            JSON.parse(json) || {}
        );
    }, [router.query.plan])

    useEffect(() => {
        const json = router.query.consult as string;
        json && setConsult(
            JSON.parse(router.query.consult as string) || {}
        );
    }, [router.query.consult])

    useEffect(() => {
        const json = router.query.contract as string;
        json && setContract(
            JSON.parse(router.query.contract as string) || {}
        );
    }, [router.query.contract])

    return (
        <Checkout plan={plan} consult={consult} contract={contract} />
    );
}
