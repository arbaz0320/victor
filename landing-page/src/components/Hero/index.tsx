import Link from "next/link";

type HeroProps = {
  banner_title: string;
  banner_text: string;
};

export default function Hero({ banner_title, banner_text }: HeroProps) {
  return (
    <section id="home" className="home">
      <div className="bg-[#001a4e] bg-opacity-70">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className="main-banner">
                <div className="d-sm-flex justify-content-between">
                  <div className="animate-fade-in-down">
                    <div className="p-3 mt-10">
                      <div className="banner-title">
                        <h3 className="font-weight-medium">
                          {banner_text && banner_text}
                        </h3>
                      </div>
                      <h6 className="font-normal mt-3 md:w-[35rem]">
                        {banner_title && banner_title}
                      </h6>
                    </div>
                    <div className="flex gap-x-4">
                      <Link href="/criar-contrato">
                        <a className="btn btn-secondary mt-3 font-medium">
                          Crie seu contrato em{" "}
                          <span className="font-bold">minutos</span>
                        </a>
                      </Link>

                      <Link href="/consulta/0">
                        <a className="bg-[#001a4e] mt-3 rounded-full hover:bg-[#6c7293] hover:no-underline px-[30px] py-[11px] font-medium text-white text-center">
                          Faça sua consulta{" "}
                          <span className="font-bold">online</span>
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
