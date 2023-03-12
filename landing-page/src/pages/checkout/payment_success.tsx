import Link from "next/link";

export default function Success() {
  return (
    <div className="py-36 container">
      <div className="bg-white">
        <div className="max-w-2xl mx-auto pt-2 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8 text-center">
          <svg
            viewBox="0 0 24 24"
            className="text-green-600 w-16 h-16 mx-auto my-6"
          >
            <path
              fill="currentColor"
              d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
            ></path>
          </svg>
          <h2 className="mt-6 text-4xl py-2 text-gray-900">Muito obrigado!</h2>
          <h4 className="mt-6 text-2xl text-gray-800">
            Sua compra foi finalizada com sucesso!
          </h4>
          <p className="text-lg">
            Acesse a qualquer momento pelo seu perfil “Seus Contratos” e “Suas
            Consultas”.
          </p>
          <p className="text-lg">
            Iremos lhe manter informado por e-mail referente os próximos passos.
          </p>
          <p className="text-lg">Grande abraço, SC Advogados.</p>
          <div className="py-10 text-center">
            <Link href="/#">
              <a className="px-12 !no-underline text-white bg-[#001a4e] hover:bg-secondary py-3">
                VOLTAR
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
