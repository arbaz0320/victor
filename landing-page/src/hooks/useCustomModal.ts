import { useState } from "react";
import { CustomModalType } from "../types/customModal";

export function useCustomModal() {
    const [customModal, setCustomModal] = useState<CustomModalType>({
        status: false,
        icon: "none",
        title: "",
        text: "",
    });

    const handleCustomModalClose = () => {
        setCustomModal({
            status: false,
            icon: "none",
            title: "",
            text: "",
        });
    };

    return {
        customModal,
        setCustomModal,
        handleCustomModalClose,
    };
}
