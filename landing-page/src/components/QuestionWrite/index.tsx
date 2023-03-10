import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { ServiceProps } from "../../types/Service";

type QuestionWriteProps = {
  user: any;
  comunicationMethod: string;
  services: ServiceProps[];
  selected?: number;
};
interface QuestionProps {
  subject: number;
  comment: string;
}

const schema = yup.object().shape({
  subject: yup.number().required("Campo obrigatório"),

  comment: yup
    .string()
    .required("Campo obrigatório")
    .min(5, "Digite no mínimo 5 caracteres.")
    .max(600, "Digite no máximo 600 caracteres."),
});

export default function QuestionWrite({
  user,
  services,
  selected = 0,
}: QuestionWriteProps) {
  const [questionSent, setQuestionSent] = useState<boolean>(false);
  const [commentCount, setCommentCount] = useState<number>(0);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<QuestionProps>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    selected && setValue("subject", selected);
  }, [selected, setValue]);

  const getService = (subject: number) => {
    let ret: ServiceProps | null = null;
    services.every((service) => {
      if (service.id === subject) {
        ret = service;
        return false;
      }
      return true;
    });
    return ret;
  };

  // ! envia o formulario de pergunta
  async function sendQuestion(data: QuestionProps) {
    try {
      router.push(
        {
          pathname: "/checkout",
          query: {
            consult: JSON.stringify({
              service: getService(data.subject),
              question: data.comment,
            }),
          },
        },
        "/checkout"
      );
    } catch (e) {
      console.log(e);
      alert("Falha de conexão");
    }
  }

  return (
    <>
      {questionSent ? (
        <form className="flex w-full space-x-3">
          <div className="w-full max-w-2xl px-5 py-10 m-auto mt-10 bg-white rounded-lg shadow dark:bg-gray-800">
            <div className="mb-6 text-3xl font-semibold text-center text-[#001a4e]">
              Consulta
            </div>
            <div className="w-full max-w-xl m-auto">
              <p className="text-3xl text-center">
                Consulta enviada com sucesso!
              </p>
              <p className="mt-5 mb-4 text-center">
                Logo entraremos em contato com a resposta!
              </p>
              <button
                type="submit"
                onClick={() => setQuestionSent(false)}
                className="py-2 px-4  bg-[#001a4e] hover:bg-secondary focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
              >
                Nova Consulta
              </button>
            </div>
          </div>
        </form>
      ) : (
        <form
          action="#"
          id="questionForm"
          onSubmit={handleSubmit(sendQuestion)}
          className="flex w-full space-x-3"
        >
          <div className="w-full max-w-2xl px-5 py-10 m-auto mt-10 bg-white rounded-lg shadow dark:bg-gray-800">
            <div className="w-full">
              <div className="form-group">
                <select
                  {...register("subject")}
                  className="form-control"
                  defaultValue={""}
                >
                  <option value="" disabled className="py-5">
                    Selecione um assunto
                  </option>
                  {services &&
                    services.map((item, index) => (
                      <option value={item.id} className="py-5" key={index}>
                        {item.title}
                      </option>
                    ))}
                </select>
                {errors.subject && (
                  <span className="text-red-600">{errors.subject.message}</span>
                )}
              </div>
            </div>
            <div className="mb-6 text-3xl font-semibold text-center text-[#001a4e]">
              Consulta
            </div>
            <div className="grid max-w-xl grid-cols-2 gap-4 m-auto">
              <div className="col-span-2">
                <small className="float-right mb-1">
                  {commentCount}/600 caracteres
                </small>
                <label className="text-gray-700 w-full" htmlFor="name">
                  <textarea
                    {...register("comment")}
                    className="flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#001a4e] focus:border-transparent"
                    id="comment"
                    placeholder="Faça sua consulta aqui"
                    name="comment"
                    rows={5}
                    cols={40}
                    onChange={(e) => setCommentCount(e.target.value.length)}
                  ></textarea>
                  {errors.comment && (
                    <span className="text-red-600">
                      {errors.comment.message}
                    </span>
                  )}
                </label>
              </div>
              <div className="col-span-2 text-right">
                <button
                  type="submit"
                  className="py-2 px-4  bg-[#001a4e] hover:bg-secondary focus:ring-[#001a4e] focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
                  form="questionForm"
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
}
