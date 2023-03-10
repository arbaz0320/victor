import Link from "next/link";

export function AboutUs() {
  return (
    <section className="our-process relative" id="about">
      <div className="container">
        <div
          className="absolute left-0 top-0 text-right h-[350px] w-full overflow-hidden"
          data-aos="fade-down"
          data-aos-easing="ease-out-cubic"
          data-aos-duration="2000"
        >
          <div className="bg-[#001a4e]">
            <img
              src="/images/idea.jpg"
              alt="idea"
              className="img-fluid mt-12 rounded-xl w-full md:-mt-32 opacity-40"
            />
          </div>
        </div>
        <div
          className="text-justify mt-[320px] sm:mt-[350px]"
          data-aos="fade-up"
        >
          <h3 className="text-[#001a4e] mb-3">
            Descomplicamos a vida de milhares de Brasileiros
          </h3>
          <h5 className="text-dark mb-3">
            Nossa plataforma oferece inúmeros serviços sobre diversos temas
            relacionados ao direito trabalhista, empresarial, da família,
            contratual, tributário, previdenciário, do consumidor e civil.
            Serviços que vão desde a elaboração de contratos redigidos por
            advogados especializados, fáceis de customizar, passando por
            consultas com respostas ágeis e objetivas, capazes de solucionar
            seus problemas com eficácia. Confira nossos{" "}
            <Link href="/#plans">
              <a>planos e serviços.</a>
            </Link>
          </h5>
          <hr />
          <h5 className="text-dark mb-3">
            Com mais de 20 anos exercendo a advocacia de forma tradicional,
            decidimos criar esta plataforma para revolucionar e democratizar o
            acesso a um advogado e permitir que todos tenham acesso a um serviço
            jurídico de qualidade, rápido e descomplicado.
          </h5>
          <h5 className="text-dark mb-4">
            As leis foram criadas para nos proteger e permitir o exercício dos
            nossos direitos como indivíduos, famílias ou empresários. No
            entanto, muitas pessoas deixam de buscar seus direitos devido à
            burocracia, custo e complexidade de nosso sistema legal.
          </h5>
          <h5 className="text-dark mb-3">
            A <span className="font-bold">SC Advogados</span>, inova o mercado
            de advocacia, possibilitando a consulta fácil a um advogado. Com o
            uso da inteligência artificial e o talento de nossos advogados,
            desenvolvemos esta plataforma que possibilita a você elaborar
            contratos personalizados em minutos e fazer consultas através de um
            computador ou dispositivo móvel, de qualquer lugar do mundo, obtendo
            serviços jurídicos mais acessíveis e descomplicados para solução dos
            mais variados problemas.
          </h5>
          <h5 className="text-dark mb-3">
            Nossa plataforma online oferece serviços flexíveis para inúmeras
            necessidades, desde o atendimento de uma única consulta, até o
            serviço por assinatura para aqueles que necessitam de atendimentos
            periódicos de serviços jurídicos, sendo a primeira do gênero no
            país.
          </h5>
          <h5 className="text-dark mb-3 font-bold">
            Nossa missão é garantir seus direitos!
            <br />
            <br />
            SC Advogados.
          </h5>
        </div>
      </div>
    </section>
  );
}
