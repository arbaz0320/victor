export type CustomModalType = {
    status: boolean;
    icon: "success" | "alert" | "error" | "none";
    title: string;
    text: string;
    link?: string;
    confirm?: number;
    cancel?: string;
    reload?: string;
    confirmButton?: string;
    data?: any;
};
