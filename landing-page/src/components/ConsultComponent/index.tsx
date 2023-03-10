import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ServiceProps } from "../../types/Service";
import QuestionWrite from "../QuestionWrite";

type ServicesListProps = {
  list: ServiceProps[];
  selected?: number;
  widget?: boolean;
};

export default function ConsultComponent({
  list,
  selected = 0,
  widget = false,
}: ServicesListProps) {
  const [comunicationMethod, setComunicationMethod] = useState("email");
  const { user } = useContext(AuthContext);

  return (
    <div className="container">
      <h3
        className={`font-weight-medium text-dark text-center${
          widget ? " text-xl mt-10" : ""
        }`}
      >
        Envie sua consulta para nossos advogados
      </h3>
      <h5 className="text-dark mb-3 text-center" hidden={widget}>
        Faça sua consulta abaixo e receba uma resposta de nossos advogados em
        até 48hrs
      </h5>
      <div className="flex mt-5 flex-wrap gap-2 sm:justify-between justify-center">
        <div className="1/2 mx-auto">
          <QuestionWrite
            user={user}
            comunicationMethod={comunicationMethod}
            services={list}
            selected={selected}
          />
        </div>
      </div>
    </div>
  );
}
