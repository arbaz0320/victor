import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { PlanInfoProps } from "../../types/PlanInfo";
import SwitchToggle from "../SwitchToggle";

type SectionProps = {
    section_title: string;
    section_text: string;
    planInfo: PlanInfoProps[];
};

export function Plans({ section_text, section_title, planInfo }: SectionProps) {
    const router = useRouter();
    const [planType, setPlanType] = useState(false);
    const { user } = useContext(AuthContext);

    return (
        <section className="text-gray-600 body-font overflow-hidden" id="plans">
            <div className="container px-5 py-5 mx-auto">
                <div className="flex flex-col md:flex-row text-center w-full mb-5">
                    <div className="w-full md:w-4/6 ">
                        <h1 className="sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900">
                            {section_title && section_title}
                        </h1>
                        <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-gray-500">
                            {section_text && section_text}
                        </p>
                    </div>
                    <div className="w-full md:w-2/6 flex justify-center">
                        <div className="flex items-center gap-4">
                            <p
                                className={
                                    planType
                                        ? `text-gray-400`
                                        : `font-black text-[#001a4e]`
                                }
                            >
                                Mensal
                            </p>
                            <SwitchToggle
                                planType={planType}
                                setPlanType={setPlanType}
                            />
                            <p
                                className={
                                    planType
                                        ? `font-black text-[#001a4e]`
                                        : `text-gray-400`
                                }
                            >
                                Anual
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap -m-4 justify-center">
                    {planInfo &&
                        planInfo.map((item, idx) => (
                            <div
                                className="p-4 xl:w-1/3 md:w-1/2 w-full"
                                key={idx}
                                hidden={
                                    planType && user?.plan
                                        ? user.plan.price_year > item.price_year
                                        : false
                                }
                            >
                                <div
                                    className={`h-full p-6 rounded-lg border-2 flex flex-col relative overflow-hidden${
                                        item.recommended === 1
                                            ? " border-[#001a4e]"
                                            : ""
                                    }`}
                                >
                                    {item.recommended === 1 && (
                                        <span className="bg-[#001a4e] text-white px-3 py-1 tracking-widest text-xs absolute right-0 top-0 rounded-bl">
                                            Mais usado
                                        </span>
                                    )}
                                    <h2 className="text-sm tracking-widest title-font mb-1 font-medium text-center">
                                        {item.name}
                                    </h2>
                                    <h2 className="text-sm tracking-widest title-font font-medium">
                                        {planType ? "12x" : ""}
                                    </h2>
                                    <h1 className="text-5xl text-gray-900 leading-none border-gray-200">
                                        {(planType
                                            ? item.price_year / 12
                                            : item.price_month
                                        ).toLocaleString("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        })}
                                    </h1>
                                    <h2 className="text-sm tracking-widest title-font font-medium pb-4 mb-4 border-b text-right">
                                        mês
                                    </h2>
                                    <p className="flex items-center text-gray-600 mb-2 whitespace-pre-line">
                                        {item.description}
                                    </p>
                                    <span
                                        hidden={
                                            item.id !== user?.plan?.plan_id ||
                                            user?.plan?.plan_type !==
                                                (planType ? "yearly" : "month")
                                        }
                                        className="text-white bg-secondary border-0 py-2 px-4 w-full rounded text-center"
                                    >
                                        Atual
                                    </span>
                                    <span
                                        hidden={
                                            item.id === user?.plan?.plan_id &&
                                            user?.plan?.plan_type ===
                                                (planType ? "yearly" : "month")
                                        }
                                        className="flex items-center mt-auto text-white bg-[#001a4e] border-0 py-2 px-4 w-full hover:bg-secondary rounded cursor-pointer"
                                        onClick={() => {
                                            router.push(
                                                {
                                                    pathname: "/checkout",
                                                    query: {
                                                        plan: JSON.stringify({
                                                            plan: item,
                                                            type: planType,
                                                        }),
                                                    },
                                                },
                                                "/checkout"
                                            );
                                        }}
                                    >
                                        {user?.plan ? "Migrar" : "Assinar"}
                                        <svg
                                            fill="none"
                                            stroke="currentColor"
                                            className="w-4 h-4 ml-auto"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M5 12h14M12 5l7 7-7 7"></path>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </section>
    );
}
