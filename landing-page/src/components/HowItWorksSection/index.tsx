import { useMemo } from "react";
import {
  AiFillQuestionCircle as QuestionIcon,
  AiOutlineCheckCircle,
  AiOutlineCloudDownload,
  AiOutlineEdit,
  AiOutlineFileText,
} from "react-icons/ai";
import {
  BsCheckCircleFill as CheckIcon,
  BsFillPersonCheckFill as BusinessManIcon,
} from "react-icons/bs";

import { HowItWorksInfo } from "../../types/HowItWorksInfo";

type HowItWorksProps = {
  info: HowItWorksInfo[];
};

export function HowItWorksSection({ info }: HowItWorksProps) {
  const displayInfo = useMemo(() => {
    let result = ["", "", ""];

    if (info.length > 0) {
      info.sort((prev, next) => prev.order - next.order);
      result = [...info.map((data) => data.description)];
    }

    return result;
  }, [info]);

  return (
    <section>
      <div className="flex flex-col items-center mx-24 container">
        <div className="w-full h-fit bg-slate-300">
          <h3 className="text-dark text-2xl font-bold pt-2 text-center">
            Contratos seguros e personalizados
          </h3>
        </div>
        <div>
          <h5 className="text-dark text-justify mt-2">
            Faça contratos para centenas de propósitos, basta responder nossas
            perguntas para elaborar um documento personalizado que se adapte às
            suas necessidades
          </h5>
        </div>

        <div className="flex flex-col items-baseline align-items-stretch md:flex-row mt-4">
          <div className="flex flex-col items-center justify-center md:w-1/3 w-full">
            <div className="flex flex-col items-center justify-center">
              <AiOutlineFileText className="text-[#001a4e] mb-3" size={50} />
              <p className="px-10 text-center text-black">{displayInfo[0]}</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <AiOutlineCheckCircle className="text-[#001a4e] mb-3" size={50} />
              <p className="px-10 text-center text-black">{displayInfo[2]}</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center h-auto md:w-1/3">
            <img
              className="w-auto hidden sm:block"
              src="/images/documents-icon.png"
              alt="logo Sc Advogados"
            />
          </div>

          <div className="flex flex-col items-center justify-center md:w-1/3 w-full">
            <div className="flex flex-col items-center justify-center">
              <AiOutlineEdit className="text-[#001a4e] mb-3" size={50} />
              <p className="px-10 text-center text-black">{displayInfo[1]}</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <AiOutlineCloudDownload
                className="text-[#001a4e] mb-3"
                size={50}
              />
              <p className="px-10 text-center text-black">{displayInfo[3]}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center mx-24 container">
        <div className="flex justify-center items-end w-full h-fit bg-slate-300 ">
          <h3 className="text-dark text-2xl font-bold pt-2">Como funciona</h3>
        </div>

        <div className="flex flex-col items-baseline md:flex-row mt-4">
          <div className="flex flex-col items-center justify-center md:w-1/3 w-full">
            <QuestionIcon className="text-[#001a4e] mb-3" size={50} />
            <p className="px-10 text-center text-black">{displayInfo[4]}</p>
          </div>

          <div className="flex flex-col items-center justify-center md:w-1/3 w-full">
            <BusinessManIcon className="text-[#001a4e] mb-3" size={50} />
            <p className="px-10 text-center text-black">{displayInfo[5]}</p>
          </div>

          <div className="flex flex-col items-center justify-center md:w-1/3 w-full">
            <CheckIcon className="text-[#001a4e] mb-3" size={50} />
            <p className="px-10 text-center text-black">{displayInfo[6]}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
