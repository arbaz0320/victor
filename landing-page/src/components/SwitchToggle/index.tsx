import { useState } from "react";
import { Switch } from "@headlessui/react";

type SwitchToggleProps = {
    planType: boolean;
    setPlanType: (state: boolean) => void;
};

export default function SwitchToggle({
    planType,
    setPlanType,
}: SwitchToggleProps) {
    // const [enabled, setEnabled] = useState(false);

    return (
        <div className="py-16">
            <Switch
                checked={planType}
                onChange={setPlanType}
                className={`${planType ? "bg-primary" : "bg-secondary"}
          relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
                <span className="sr-only">Use setting</span>
                <span
                    aria-hidden="true"
                    className={`${planType ? "translate-x-9" : "translate-x-0"}
            pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                />
            </Switch>
        </div>
    );
}
