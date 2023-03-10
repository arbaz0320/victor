import React, { createContext, ReactNode, useState } from "react";

type PropsFormContext = {
    name: string | undefined;
    setName: any;
    email: string | undefined;
    setEmail: any;
    password: string | undefined;
    setPassword: any;
    phone: string | undefined;
    setPhone: any;
    document: string | undefined;
    setDocument: any;
    birthday: string | undefined | Date;
    setBirthday: any;
    address: string | undefined;
    setAddress: any;
    number?: string | undefined;
    setNumber: any;
    complement?: string | undefined;
    setComplement: any;
    ibge?: string | undefined;
    setIbge?: any;
    cep?: string | undefined;
    setCep?: any;
    neighborhood: string | undefined;
    setNeighborhood: any;
    city: string | undefined;
    setCity: any;
    uf?: string | undefined;
    setUf?: any;
    terms: boolean;
    setTerms: any;
    confirmPassword: string | undefined;
    setConfirmPassword: any;
};

// valor default do contexto
const DEFAULT_VALUE = {
    name: undefined,
    setName: () => {},
    email: undefined,
    setEmail: () => {},
    document: undefined,
    setDocument: () => {},
    password: undefined,
    setPassword: () => {},
    phone: undefined,
    setPhone: () => {},
    birthday: undefined,
    setBirthday: () => {},
    confirmPassword: undefined,
    setConfirmPassword: () => {},
    city: undefined,
    setCity: () => {},
    address: undefined,
    setAddress: () => {},
    neighborhood: undefined,
    setNeighborhood: () => {},
    cep: undefined,
    setCep: () => {},
    ibge: undefined,
    setIbge: () => {},
    uf: undefined,
    setUf: () => {},
    terms: false,
    setTerms: () => {},
    number: undefined,
    setNumber: () => {},
    complement: undefined,
    setComplement: () => {},
};

const FormContext = createContext<PropsFormContext>(DEFAULT_VALUE);

const FormContextProvider: React.FC = ({ children }: any) => {
    const [name, setName] = useState(DEFAULT_VALUE.name);
    const [email, setEmail] = useState(DEFAULT_VALUE.email);
    const [document, setDocument] = useState(DEFAULT_VALUE.document);
    const [password, setPassword] = useState(DEFAULT_VALUE.password);
    const [phone, setPhone] = useState(DEFAULT_VALUE.phone);
    const [birthday, setBirthday] = useState(DEFAULT_VALUE.birthday);
    const [confirmPassword, setConfirmPassword] = useState(
        DEFAULT_VALUE.confirmPassword
    );
    const [address, setAddress] = useState(DEFAULT_VALUE.address);
    const [neighborhood, setNeighborhood] = useState(
        DEFAULT_VALUE.neighborhood
    );
    const [terms, setTerms] = useState(DEFAULT_VALUE.terms);

    const [city, setCity] = useState(DEFAULT_VALUE.city);
    const [ibge, setIbge] = useState(DEFAULT_VALUE.ibge);
    const [cep, setCep] = useState(DEFAULT_VALUE.cep);
    const [uf, setUf] = useState(DEFAULT_VALUE.uf);
    const [number, setNumber] = useState(DEFAULT_VALUE.number);
    const [complement, setComplement] = useState(DEFAULT_VALUE.complement);

    return (
        <FormContext.Provider
            value={{
                name,
                setName,
                email,
                setEmail,
                document,
                setDocument,
                password,
                setPassword,
                phone,
                setPhone,
                birthday,
                setBirthday,
                confirmPassword,
                setConfirmPassword,
                city,
                setCity,
                address,
                setAddress,
                neighborhood,
                setNeighborhood,
                terms,
                setTerms,
                cep,
                setCep,
                ibge,
                setIbge,
                uf,
                setUf,
                number,
                setNumber,
                complement,
                setComplement,
            }}
        >
            {children}
        </FormContext.Provider>
    );
};

export { FormContextProvider };
export default FormContext;
