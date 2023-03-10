import { AxiosError, AxiosResponse } from "axios";
import { default as router } from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { createContext, useEffect, useState } from "react";
import api from "../commons/api";
import { AlertModal } from "../components/AlertModal";
import { useCustomModal } from "../hooks/useCustomModal";

type User = {
  id: number;
  email: string;
  name: string;
  plan?: {
    plan_id: number | null;
    price_month: number;
    price_year: number;
    plan_type: string;
    percentage_discount_questions: number;
    percentage_discount_contracts: number;
    plan: {
      name: string;
      description: string;
      percentage_discount_questions: number;
      percentage_discount_contracts: number;
    };
  };
};

type SignInData = {
  email: string;
  password: string;
  origin: string;
};

type RecoverData = {
  email: string;
};

type AuthContextProps = {
  isAuthenticated: boolean;
  user: User | null;
  signIn: (data: SignInData) => Promise<void>;
  logOut: () => void;
  recoverPassword: (data: RecoverData) => Promise<void>;
  isLoading: boolean;
};

export const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isAuthenticated = !!user;
  const modal = useCustomModal();

  async function getAuthenticated() {
    const { "nextauth.token": token } = parseCookies();
    if (token) {
      try {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const responseMe = await api.get("auth/me");
        setUser(responseMe.data);
      } catch (error) {
        logOut();
        router.push("/");
      }
    }
  }

  useEffect(() => {
    function setInterceptor() {
      api.interceptors.response.use(
        (res: AxiosResponse) => res,
        (err: AxiosError | any) => {
          if (err.response?.status === 403) {
            logOut();
            router.push("/");
          }
          return Promise.reject(err);
        }
      );
    }
    setInterceptor();
    getAuthenticated();
  }, []);

  async function signIn({ email, password, origin }: SignInData) {
    setIsLoading(true);
    api
      .post("auth", {
        email: email,
        password: password,
        origin: "web",
      })
      .then((response) => response?.data)
      .then((data) => {
        if (data) {
          const token = data.access_token;
          setCookie(undefined, "nextauth.token", token, {
            maxAge: data.expires_in || 60 * 60 * 2,
            path: "/",
          });
          getAuthenticated();
        }
      })
      .catch((error) => {
        if (error.response) {
          modal.setCustomModal({
            status: true,
            icon: "error",
            title: "Falha ao acessar!",
            text: error.response.data.message, //modal erro login
          });
          setIsLoading(false);
        }
      });
  }

  function logOut() {
    destroyCookie({}, "nextauth.token", { path: "/" });

    localStorage.removeItem("SC@terms");

    setUser(null);
    window.location.reload();
  }

  async function recoverPassword({ email }: RecoverData) {
    setIsLoading(true);
    api
      .post("public-routes/reset-password", {
        email: email,
        origin: "web",
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        modal.setCustomModal({
          status: true,
          icon: "success",
          title: "Solicitação Enviada!",
          text: "Se o e-mail existir, você deverá receber as instruções para o novo acesso no seu e-mail.",
        });
        setIsLoading(false);
      });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        signIn,
        logOut,
        recoverPassword,
        isLoading,
      }}
    >
      {children}
      <AlertModal
        type={modal.customModal.icon}
        title={modal.customModal.title}
        description={modal.customModal.text}
        isOpen={modal.customModal.status}
        setIsOpen={modal.handleCustomModalClose}
        confirmButton={modal.customModal.confirmButton}
        path="/"
      />
    </AuthContext.Provider>
  );
}
