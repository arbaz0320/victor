import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import api from "../../commons/api";
import { AuthContext } from "../../context/AuthContext";
import { useCustomModal } from "../../hooks/useCustomModal";
import { ContractProps } from "../../types/Contract";
import { PlanInfoProps } from "../../types/PlanInfo";
import { ServiceProps } from "../../types/Service";
import { AlertModal } from "../AlertModal";
import { LoginModal } from "../LoginModal";
import Payment from "../Payment";
import CheckoutForm  from "../Stripe";
import { RegisterModal } from "../RegisterModal";

import {Elements} from '@stripe/react-stripe-js';
import {useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';

import {loadStripe} from '@stripe/stripe-js';
import axios from "axios";
import { useRouter } from "next/router";

const stripe = require('stripe')('sk_test_51MYEAQCu4V7WPejbz30pSgvjBTT0oNEZtOy2lJeKao8YychfZMj8w6OqsnbPPOG5aMJJ4Re7LMmAHB42FZ59vSiJ00pCoNivyb');
const stripePromise = loadStripe('pk_test_51MYEAQCu4V7WPejbow9KY84LBYhLjsJPtvmYAutumu4CMSyC2aQrjfOFPTXyzCIXvT5nGmKLbJAIAjlC8KUh5Zsk00lgnrFvjO');

const publishableKey = 'pk_test_51MYEAQCu4V7WPejbow9KY84LBYhLjsJPtvmYAutumu4CMSyC2aQrjfOFPTXyzCIXvT5nGmKLbJAIAjlC8KUh5Zsk00lgnrFvjO';


/*const stripe = require('stripe')('sk_test_51MFVTRCRdss4iR1Im3ew9nGnT8oy1paqUzHyLkPGvKqilPjzMWJmrdpxQNyZYwQks5ax5f0UJSay2FFufkVxchkp004XAuIOB5');
const stripePromise = loadStripe('pk_test_51MFVTRCRdss4iR1IAkMwNIWy7iVJH7sPWvxIsiaGPO67JkQcqiA4lB4oCpWXyfc5fxZ6gdY9XuFS1MEKx2Hqeqlq00afLCa9S4');

const publishableKey = 'pk_test_51MFVTRCRdss4iR1IAkMwNIWy7iVJH7sPWvxIsiaGPO67JkQcqiA4lB4oCpWXyfc5fxZ6gdY9XuFS1MEKx2Hqeqlq00afLCa9S4';*/

interface CheckoutFormProps {
  email: string;
  cupom: string;
}

type CheckoutProps = {
  plan?: {
    plan: PlanInfoProps;
    type: boolean;
  };
  consult?: {
    service: ServiceProps;
    question: string;
  };
  contract?: {
    contract: ContractProps;
    answers: any;
    blockAnswers: any;
    text: string;
    hasSign: boolean;
  };
};

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

const schema = yup.object().shape({
  email: yup
    .string()
    .required("Campo obrigatório")
    .email("Digite um e-mail válido"),

  cupom: yup.string(),
});

export default function Checkout({ plan, consult, contract }: CheckoutProps) {
  const modal = useCustomModal();

  const { user } = useContext(AuthContext);
  const [email, setEmail] = useState<string>("");
  const [cupom, setCupom] = useState<string>("");
  const [isReady, setIsReady] = useState<boolean>(false);
  const [hasUser, setHasUser] = useState<boolean | null>(null);
  const [brickController, setBrickController] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const title =
    plan?.plan.name || consult?.service.title || contract?.contract.title;
  const description =
    plan?.plan.description ||
    consult?.service.description ||
    contract?.contract.description;

  const planValue = plan?.type ? plan?.plan.price_year : plan?.plan.price_month;
  const consultValue = consult?.service.price;
  const contractValue = contract?.contract.price;
  const valueUnit =
    (planValue && plan?.type ? planValue / 12 : planValue) ||
    consultValue ||
    contractValue ||
    0;
  const subtotal = planValue || consultValue || contractValue || 0;

  const [discount, setDiscount] = useState<number>(0);
  const [planDiscount, setPlanDiscount] = useState<number>(0);
  const [total, setTotal] = useState<number>(subtotal);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormProps>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (user) {
      setValue("email", user.email);
      setEmail(user.email);
      setIsReady(true);
      if (user?.plan && !plan) {
        contract &&
          setPlanDiscount(
            subtotal * (user.plan.percentage_discount_contracts / 100)
          );
        consult &&
          setPlanDiscount(
            subtotal * (user.plan.percentage_discount_questions / 100)
          );
      }
    }
  }, [user, setValue]);

  useEffect(() => {
    user && setIsReady(false);

    const value = subtotal - discount - planDiscount;
    setTotal(value > 0 ? value : 0);
  }, [user, discount, planDiscount, subtotal]);

  useEffect(() => {
    user && setIsReady(true);
  }, [user, total]);

  const checkUser = async () => {
    if (!errors.email && email) {
      const response = await api.post("/auth/has-user", { email });
      if (response && response.data) {
        setHasUser(response.data.exists);
        loginOrRegister();
      }
    }
  };

  const loginOrRegister = async () => {
    modal.setCustomModal({
      status: true,
      icon: "success",
      title: "",
      text: "",
      data: { email },
    });
  };

  const checkCupom = async () => {
    if (!errors.cupom && cupom) {
      const response = await api.get(`/coupon/check/${cupom}`);
      if (response && response.data) {
        const data = response.data;
        modal.setCustomModal({
          status: true,
          icon: data.error ? "error" : "success",
          title: "Cupom de desconto",
          text: data.message,
        });
        if (data.error) {
          setDiscount(0);
        } else {
          const coupon = data.data;
          const value =
            coupon.discount_type === 1
              ? coupon.value
              : subtotal * (coupon.value / 100);
          setDiscount(value);
        }
      }
    }
  };

  const finishOrder = (cardFormData: any = {}) => {
    const showMessage = (data: any) => {
      modal.setCustomModal({
        status: true,
        icon: data.error ? "error" : "success",
        title: data.error ? "Ops.. Tivemos um problema" : "Tudo certo!",
        text: `${data.error ? "" : "Sua compra foi concluída!\n"}${
          data.message || ""
        }`,
        data: { email },
        confirmButton: data.error ? undefined : "Ok",
      });
    };

    let route = "/";
    if (plan !== undefined) {
      route = "/subscribe";
      cardFormData.plan_id = plan.plan.id;
      cardFormData.plan_type = plan.type ? "yearly" : "month";
    } else if (consult !== undefined) {
      route = "/buy";
      cardFormData.type = "question";
      cardFormData.right_area_id = consult.service.id;
    } else if (contract !== undefined) {
      route = "/buy";
      cardFormData.type = "contract";
      cardFormData.contract_id = contract.contract.id;
    }
    cardFormData.cupom = cupom;
    api
      .post(route, cardFormData)
      .then((response) => response.data)
      .then((data) => {
        if (typeof data.error === "boolean") {
          if (data.error) {
            showMessage(data);
            setIsLoading(false);
          } else {
            if (plan !== undefined) {
              window.dataLayer.push({
                event: "Plan_Purchase",
                value: total,
              });
              showMessage(data);
              setIsLoading(false);
            } else if (consult !== undefined) {
              api
                .post("/message", {
                  message: consult.question,
                  order_id: data.order.id,
                })
                .then((response) => response.data)
                .then((dt) => {
                  window.dataLayer.push({
                    event: "Consultation_Purchase",
                    value: total,
                  });
                  showMessage(dt);
                })
                .finally(() => setIsLoading(false));
            } else if (contract !== undefined) {
              api
                .post("/contract-generated", {
                  content: contract.text,
                  order_id: data.order.id,
                  answers: contract.answers,
                  blockAnswers: contract.blockAnswers,
                })
                .then((dt) => {
                  window.dataLayer.push({
                    event: "Contract_Purchase",
                    value: total,
                  });
                  localStorage.removeItem("answers");
                  localStorage.removeItem("blockAnswers");
                  localStorage.removeItem("contractVariables");
                  localStorage.removeItem("contractId");
                  if (contract.hasSign) {
                    api
                      .post(`/contract/signature/${data.order.id}`)
                      .then((response) => response.data)
                      .then((dt) => showMessage(dt))
                      .finally(() => setIsLoading(false));
                  } else {
                    showMessage(dt);
                    setIsLoading(false);
                  }
                });
            }
          }
        }
      })
      .catch((error) => console.log(error))
      .finally(() => setTimeout(() => setIsLoading(false), 5000));
  };

  const handlePayment = (data: CheckoutFormProps) => {
    if (total <= 0) {
      setIsLoading(true);
      finishOrder();
    } else if (brickController) {
      setIsLoading(true);
      brickController
        .getFormData()
        .then((cardFormData: any) => {
          finishOrder(cardFormData);
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  };


const [tokenData, setUserData] = useState();

const funC=async()=>{
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [{
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Plan 1',
              },
              unit_amount: total * 100,
            },
            quantity: 1,
          }],
          mode: 'payment',
          success_url: 'https://localhost:3000/success',
          cancel_url: 'https://localhost:3000/cancel',
        });

        return await stripe.paymentIntents.create({
            amount: total * 100,
            currency: 'usd',
            automatic_payment_methods: {enabled: true},
        });
    }

  useEffect(() => {
    funC().then(res=>{

            console.log(res);
            setUserData(res.client_secret);
        });
}, []);


const options = {
    // passing the client secret obtained in step 3
    clientSecret: tokenData,
  };

 return (
    <div className="bg-gray-50">
      <div className="max-w-2xl mx-auto pt-2 pb-24 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Checkout</h2>

        {plan && user?.plan && (
          <div
            className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-4"
            role="alert"
          >
            <p className="font-bold">Atenção</p>
            <p>
              Ao realizar a troca do plano, você irá perder os benefícios do
              plano atual, passando a desfrutar do novo plano imediatamente!
            </p>
          </div>
        )}


          <div>
            <div className="pt-10">
              <h2 className="text-lg font-medium text-gray-900 font-bold">
                Favor realizar Login / Registro abaixo para realizar o pagamento
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    E-mail *
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      {...register("email")}
                      type="email"
                      name="email"
                      id="email"
                      className="block w-full border border-gray-300 rounded-bl-md rounded-tl-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#001a4e] focus:border-[#001a4e] sm:text-sm"
                      onKeyDown={(e) => e.key === "Enter" && checkUser()}
                      onChange={(e) => {
                        setIsReady(false);
                        setEmail(e.target.value);
                      }}
                    />
                    <button
                      className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded-br rounded-tr"
                      type="button"
                      onClick={(e) => checkUser()}
                      hidden={isReady}
                    >
                      Verificar
                    </button>
                  </div>
                  {errors.email && (
                    <span className="text-red-600">{errors.email.message}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="mt-10 border-t border-gray-200 pt-10">
              <h2 className="text-lg font-medium text-gray-900">Pagamento</h2>

               <div className="mt-6">

                <p
                  className="text-center"
                  hidden={isReady || !!user || hasUser !== null}
                >
                  Preencha o Email acima para prosseguir com o pagamento
                </p>
                <p className="text-center" hidden={!isReady || total > 0}>
                  Não há valor a ser cobrado, prossiga com a finalização!
                </p>
              </div>
              
              <div className="mt-6" hidden={!user && hasUser == null}>
                
                <p className="text-center" hidden={!isReady || total > 0}>
                  Não há valor a ser cobrado, prossiga com a finalização!
                </p>                 
                 

              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="mt-10 lg:mt-0">
            <h2 className="text-lg font-medium text-gray-900">Resumo</h2>

            <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <h3 className="sr-only">Enviar</h3>
              <ul role="list" className="divide-y divide-gray-200">
                <li className="flex py-6 px-4 sm:px-6">
                  <div className="ml-6 flex-1 flex flex-col">
                    <div className="flex">
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm">
                          <span className="font-medium text-gray-700 hover:text-gray-800">
                            {title}
                          </span>
                        </h4>
                        <p className="mt-1 text-sm text-gray-500">
                          {description}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {plan?.type !== undefined &&
                            (plan.type ? "Plano Anual" : "Plano Mensal")}
                          {consult?.question !== undefined &&
                            `Pergunta: ${consult.question}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex-1 pt-2 flex items-end justify-between">
                      <span></span>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        <small>
                          {plan?.type !== undefined &&
                            (plan.type ? "12x " : "")}
                        </small>
                        {valueUnit.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
              <dl className="border-t border-gray-200 py-6 px-4 space-y-6 sm:px-6">
                <div className="flex items-center justify-between">
                  <dt className="text-sm">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {subtotal.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm mr-1">Cupom</dt>
                  <dd className="text-sm font-medium text-gray-900 flex items-center">
                    <input
                      {...register("cupom")}
                      type="text"
                      name="cupom"
                      id="cupom"
                      className="block w-full border border-gray-300 rounded-bl-md rounded-tl-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#001a4e] focus:border-[#001a4e] sm:text-sm"
                      onKeyDown={(e) => e.key === "Enter" && checkCupom()}
                      disabled={!isReady}
                      onChange={(e) => {
                        setCupom(e.target.value);
                      }}
                    />
                    <button
                      className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 text-sm border-4 text-white py-1 px-2 rounded-br rounded-tr disabled:opacity-75 disabled:hover:bg-teal-500"
                      type="button"
                      onClick={(e) => checkCupom()}
                      disabled={!isReady}
                    >
                      Verificar
                    </button>
                  </dd>
                  {errors.cupom && (
                    <span className="text-red-600">{errors.cupom.message}</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm">Desconto</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {discount.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </dd>
                </div>
                <div
                  className="flex items-center justify-between"
                  hidden={!user?.plan || !!plan}
                >
                  <dt className="text-sm">Desconto (Plano)</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {planDiscount.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                  <dt className="text-base font-medium">Total</dt>
                  <dd className="text-base font-medium text-gray-900">
                    {total.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </dd>
                </div>
              </dl>

              <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                <button
                  type="submit"
                  className="w-full bg-[#001a4e] border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 disabled:opacity-75 disabled:hover:bg-[#001a4e] relative"
                  form="form-checkout"
                  disabled={!isReady || isLoading}
                >
                  {isLoading && (
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <svg
                        role="status"
                        className="inline w-5 h-5 text-white animate-spin"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="#E5E7EB"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                  )}
                  Finalizar compra
                </button>
              </div>
            </div>
          </div>


          {isReady && total > 0 && (
                  <Payment
                    email={email}
                    total={total}
                    installment={
                      (plan?.type !== undefined && (plan.type ? 12 : 1)) || 1
                    }
                    setController={(controller: any) =>
                      setBrickController(controller)
                    }
                    onError={() => setIsLoading(false)}
                  />
                )}
          {/*stripe button*/}
                 {isReady && tokenData && total > 0 &&  (
                  <Elements stripe={stripePromise} options={options} >
                    <CheckoutForm />
                  </Elements>
                )}


                 {/*stripe button*/}
      </div>
      {!isReady &&
        hasUser !== null &&
        (hasUser === true ? (
          <LoginModal
            isQuickViewOpen={modal.customModal.status}
            setIsQuickViewOpen={modal.handleCustomModalClose}
            email={modal.customModal?.data?.email}
          />
        ) : (
          <RegisterModal
            isQuickViewOpen={modal.customModal.status}
            setIsQuickViewOpen={modal.handleCustomModalClose}
            email={modal.customModal?.data?.email}
          />
        ))}
      {isReady && (
        <AlertModal
          type={modal.customModal.icon}
          title={modal.customModal.title}
          description={modal.customModal.text}
          isOpen={modal.customModal.status}
          setIsOpen={modal.handleCustomModalClose}
          confirmButton={modal.customModal.confirmButton}
          path="/checkout/success"
        />
      )}
    </div>
  );
}
