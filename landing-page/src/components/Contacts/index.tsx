import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import api from "../../commons/api";
import { useCustomModal } from "../../hooks/useCustomModal";
import { AlertModal } from "../AlertModal";

type SectionProps = {
    section_title: string;
    section_text: string;
};

interface IFormInputs {
    name: string;
    email: string;
    subject: string;
    message: string;
}

const schema = yup.object().shape({
    name: yup.string().required("Nome obrigatório"),
    email: yup.string().required("E-mail obrigatório"),
    subject: yup.string().required("Assunto obrigatório"),
    message: yup.string().required("Mensagem obrigatório"),
});

export function Contact({ section_text, section_title }: SectionProps) {
    const modal = useCustomModal();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IFormInputs>({
        resolver: yupResolver(schema),
    });

    async function handleContact(data: IFormInputs) {
        api.post("public-routes/contact", data)
            .then(response => response?.data)
            .then(data => {
                modal.setCustomModal({
                    status: true,
                    icon: data.error ? "error" : "success",
                    title: data.error ? "Ops.. Tivemos um problema" : "Tudo certo!",
                    text: data.message
                })
            })
            .catch(error => {
                console.log(error);
            });
    }

    return (
        <section className="contactus" id="contact">
            <div className="container">
                <div className="row mb-5 pb-5">
                    <div
                        className="col-sm-5"
                        data-aos="fade-up"
                        data-aos-offset="-500"
                    >
                        <img
                            src="/images/contact.jpg"
                            alt="contact"
                            className="img-fluid rounded-2xl"
                        />
                    </div>
                    <div
                        className="col-sm-7"
                        data-aos="fade-up"
                        data-aos-offset="-500"
                    >
                        <h3 className="font-weight-medium text-dark mt-5 mt-lg-0">
                            {section_title && section_title}
                        </h3>

                        <h5 className="text-dark mb-5">
                            {section_text && section_text}
                        </h5>

                            <form
                                className="mt-8 space-y-6"
                                action="#"
                                method="POST"
                                onSubmit={handleSubmit(
                                    handleContact
                                )}
                            >
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <input
                                            {...register("name")}
                                            type="text"
                                            className="form-control"
                                            placeholder="Nome*"
                                        />
                                        {errors.name && (
                                            <span className="text-red-600">
                                                {errors.name.message}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <input
                                            {...register("email")}
                                            type="email"
                                            className="form-control"
                                            placeholder="E-mail*"
                                        />
                                        {errors.email && (
                                            <span className="text-red-600">
                                                {errors.email.message}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <select
                                            {...register("subject")}
                                            className="form-control"
                                            defaultValue={''}
                                        >
                                            <option
                                                value=""
                                                disabled
                                                className="py-5"
                                            >
                                                Selecione um assunto
                                            </option>
                                            <option value="Sugestões">
                                                Sugestões
                                            </option>
                                            <option value="Pagamento">
                                                Pagamento
                                            </option>
                                            <option value="Sobre meu Plano">
                                                Sobre meu Plano
                                            </option>
                                            <option value="Troca de Plano">
                                                Troca de Plano
                                            </option>
                                            <option value="Problemas técnicos">
                                                Problemas técnicos
                                            </option>
                                            <option value="Cobrança">
                                                Cobrança
                                            </option>
                                            <option value="Sobre minha Consulta">
                                                Sobre minha Consulta
                                            </option>
                                            <option value="Cancelamento">
                                                Cancelamento
                                            </option>
                                            <option value="Outros">
                                                Outros
                                            </option>
                                        </select>
                                        {errors.subject && (
                                            <span className="text-red-600">
                                                {errors.subject.message}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="col-sm-12">
                                    <div className="form-group h-28">
                                        <textarea
                                            {...register("message")}
                                            className="form-control"
                                            placeholder="Mensagem*"
                                        ></textarea>
                                        {errors.message && (
                                            <span className="text-red-600">
                                                {errors.message.message}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="col-sm-12">
                                    <button type="submit" className="btn btn-secondary">
                                        Enviar
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <AlertModal
                type={modal.customModal.icon}
                title={modal.customModal.title}
                description={modal.customModal.text}
                isOpen={modal.customModal.status}
                setIsOpen={modal.handleCustomModalClose}
            />
        </section>
    );
}
