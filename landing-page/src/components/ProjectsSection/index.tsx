import { useEffect, useState } from "react";
import { BsCalendarCheck } from "react-icons/bs";
import { FaFileContract } from "react-icons/fa";
import { RiAccountPinBoxLine, RiUserFollowLine } from "react-icons/ri";

type SectionProps = {
  section_title: string;
  section_text: string;
  counter_1: number;
  counter_2: number;
  counter_3: number;
  counter_4: number;
};

export function ProjectsSection({
  section_text,
  section_title,
  counter_1,
  counter_2,
  counter_3,
  counter_4,
}: SectionProps) {
  const [clientsCounter, setClientsCounter] = useState<number>(0);
  const [contractsCounter, setContractsCounter] = useState<number>(0);
  const [consultsCounter, setConsultsCounter] = useState<number>(0);
  const [yearsCounter, setYearsCounter] = useState<number>(0);

  function counterClients() {
    if (clientsCounter < counter_1) {
      setTimeout(() => setClientsCounter(clientsCounter + 1), 50);
    }
  }
  function counterContracts() {
    if (contractsCounter < counter_2) {
      setTimeout(() => setContractsCounter(contractsCounter + 1), 0.1);
    }
  }
  function counterConsults() {
    if (consultsCounter < counter_3) {
      setTimeout(() => setConsultsCounter(consultsCounter + 1), 1);
    }
  }
  function counterYears() {
    if (yearsCounter < counter_4) {
      setTimeout(() => setYearsCounter(yearsCounter + 1), 500);
    }
  }
  useEffect(() => {
    counterClients();
  }, [clientsCounter]);

  useEffect(() => {
    counterContracts();
  }, [contractsCounter]);

  useEffect(() => {
    counterConsults();
  }, [consultsCounter]);

  useEffect(() => {
    counterYears();
  }, [yearsCounter]);

  return (
    <section className="our-projects" id="projects">
      <div className="container">
        <div className="row mb-2">
          <div className="col-sm-12">
            <div className="mb-2">
              <h3 className="font-weight-medium text-dark text-center mb-4">
                {section_title && section_title}
              </h3>
            </div>
            <h5 className="text-dark text-justify">
              {section_text && section_text}
            </h5>
          </div>
        </div>
      </div>

      <div className="container sm:hidden mb-2 flex w-full justify-center items-center">
        <div className="flex justify-start flex-wrap flex-col  ">
          <div className="my-2">
            <div className="flex gap-2 items-center" data-aos="fade-down">
              <RiUserFollowLine size={47} className="text-[#001a4e]" />
              <div>
                <h4 className="font-weight-bold text-dark mb-0">
                  <span>{clientsCounter}</span>%
                </h4>
                <h5 className="text-secondary text-sm mb-0">
                  Clientes satisfeitos
                </h5>
              </div>
            </div>
          </div>
          <div className="my-2">
            <div className="flex gap-2 items-center" data-aos="fade-down">
              <FaFileContract size={47} className="text-[#001a4e]" />
              <div>
                <h4 className="font-weight-bold text-dark mb-0">
                  <span>{contractsCounter}</span>
                  {/* <span className="fpVal">0</span> */}
                </h4>
                <h5 className="text-secondary mb-0">Contratos criados</h5>
              </div>
            </div>
          </div>
          <div className="my-2">
            <div className="flex gap-2 items-centter" data-aos="fade-down">
              <RiAccountPinBoxLine size={47} className="text-[#001a4e]" />
              <div>
                <h4 className="font-weight-bold text-dark mb-0">
                  <span>{consultsCounter}</span>
                  {/* <span className="tMVal">0</span> */}
                </h4>
                <h5 className="text-secondary text-sm mb-0">
                  Consultas feitas
                </h5>
              </div>
            </div>
          </div>
          <div className="my-2">
            <div
              className="flex gap-2 pl-[3px] items-center"
              data-aos="fade-down"
            >
              <BsCalendarCheck size={40} className="text-[#001a4e]" />
              <div className="pl-[3px]">
                <h4 className="font-weight-bold text-dark mb-0">
                  <span>{yearsCounter}</span>
                  {/* <span className="bPVal">0</span> */}
                </h4>
                <h5 className="text-secondary text-sm mb-0">
                  Anos de experiência
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container hidden sm:block">
        <div className="row md:py-5 md:mt-5">
          <div className="col-sm-3">
            <div
              className="d-flex py-3 my-3 my-lg-0 justify-content-center"
              data-aos="fade-down"
            >
              <RiUserFollowLine size={47} className="mr-3 text-[#001a4e]" />
              <div>
                <h4 className="font-weight-bold text-dark mb-0">
                  <span>{clientsCounter}</span>%
                </h4>
                <h5 className="text-secondary mb-0">Clientes satisfeitos</h5>
              </div>
            </div>
          </div>
          <div className="col-sm-3">
            <div
              className="d-flex py-3 my-3 my-lg-0 justify-content-center"
              data-aos="fade-up"
            >
              <FaFileContract size={47} className="mr-3 text-[#001a4e]" />
              <div>
                <h4 className="font-weight-bold text-dark mb-0">
                  <span>{contractsCounter}</span>
                  {/* <span className="fpVal">0</span> */}
                </h4>
                <h5 className="text-secondary mb-0">Contratos criados</h5>
              </div>
            </div>
          </div>
          <div className="col-sm-3">
            <div
              className="d-flex py-3 my-3 my-lg-0 justify-content-center"
              data-aos="fade-down"
            >
              <RiAccountPinBoxLine size={50} className="mr-3 text-[#001a4e]" />
              <div>
                <h4 className="font-weight-bold text-dark mb-0">
                  <span>{consultsCounter}</span>
                  {/* <span className="tMVal">0</span> */}
                </h4>
                <h5 className="text-secondary mb-0">Consultas feitas</h5>
              </div>
            </div>
          </div>
          <div className="col-sm-3">
            <div
              className="d-flex py-3 my-3 my-lg-0 justify-content-center"
              data-aos="fade-up"
            >
              <BsCalendarCheck size={45} className="mr-3 text-[#001a4e]" />
              <div>
                <h4 className="font-weight-bold text-dark mb-0">
                  <span>{yearsCounter}</span>
                  {/* <span className="bPVal">0</span> */}
                </h4>
                <h5 className="text-secondary mb-0">Anos de experiência</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
