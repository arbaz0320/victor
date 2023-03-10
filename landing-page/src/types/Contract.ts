type SignatoriesProps = {
  id: number;
  type: string;
  question: string;
  description: string;
  contract_id: number;
};

export type ContractProps = {
  id: number;
  title: string;
  text: string;
  description: string;
  type_id: number;
  price: number;
  block_or_fields: { [key: string]: any };
  type: {
    id: number;
    title: string;
  };
  presentation_path: string;
  signatories: SignatoriesProps[];
};
