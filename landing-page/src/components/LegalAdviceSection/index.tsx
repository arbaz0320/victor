import { useMemo } from "react";

import { BsFillPersonCheckFill as BusinessManIcon } from "react-icons/bs";
import { ImCogs as ComplianceIcon } from "react-icons/im";
import {
  RiMoneyDollarCircleFill as MoneyIcon,
  RiRocket2Fill as RocketIcon,
} from "react-icons/ri";

import { LegalAdviceInfo } from "../../types/LegalAdviceInfo";

type LegalAdviceProps = {
  info: LegalAdviceInfo[];
};

export function LegalAdviceSection({ info }: LegalAdviceProps) {
  const displayInfo = useMemo(() => {
    let result = ["", "", ""];

    if (info.length > 0) {
      info.sort((prev, next) => prev.order - next.order);
      result = [...info.map((data) => data.description)];
    }

    return result;
  }, [info]);

  return (
    <div className="flex flex-col items-center mx-24 mt-4 container">
      <div className="w-full h-fit bg-slate-300">
        <h3 className="text-dark text-2xl pt-2 text-center">
          Por que receber <strong>aconselhamento jurídico</strong> online?
        </h3>
      </div>

      <div className="flex flex-col items-baseline md:flex-row mt-4">
        <div className="flex flex-col items-center justify-center md:w-1/3 w-full">
          <ComplianceIcon className="text-[#001a4e] mb-3" size={50} />
          <h5 className="text-secondary">Descomplicado</h5>
          <p className="px-3 text-center text-black">{displayInfo[0]}</p>
        </div>

        <div className="flex flex-col items-center justify-center md:w-1/3 w-full">
          <BusinessManIcon className="text-[#001a4e] mb-3 " size={50} />
          <h5 className="text-secondary">Confiável</h5>
          <p className="px-3 text-center text-black">{displayInfo[1]}</p>
        </div>

        <div className="flex flex-col items-center justify-center md:w-1/3 w-full">
          <RocketIcon className="text-[#001a4e] mb-3" size={50} />
          <h5 className="text-secondary">Rápido</h5>
          <p className="px-3 text-center text-black">{displayInfo[2]}</p>
        </div>

        <div className="flex flex-col items-center justify-center md:w-1/3 w-full">
          <MoneyIcon className="text-[#001a4e] mb-3" size={50} />
          <h5 className="text-secondary">Acessível</h5>
          <p className="px-3 text-center text-black">
            Nossa missão é que todos tenham seus direitos garantidos através de
            um advogado especializado.
          </p>
        </div>
      </div>
    </div>
  );
}
