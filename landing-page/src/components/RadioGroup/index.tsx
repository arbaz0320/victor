const notificationMethods = [
    { id: "email", title: "E-mail" },
    { id: "sms", title: "Ligação telefonica" },
];

type RadioProps = {
    actualSelected: string;
    setActualSelected: Function;
}

export default function RadioGroup({actualSelected, setActualSelected}: RadioProps) {
    return (
        <div>
            <label className="text-base font-medium text-gray-900">
                Resposta
            </label>
            <p className="text-sm leading-5 text-gray-500">
                Como deseja receber sua resposta?
            </p>
            <fieldset className="mt-4">
                <legend className="sr-only">Notification method</legend>
                <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                    {notificationMethods.map((notificationMethod) => (
                        <div
                            key={notificationMethod.id}
                            className="flex items-center"
                        >
                            <input
                                id={notificationMethod.id}
                                name="notification-method"
                                type="radio"
                                onClick={() => setActualSelected(notificationMethod.id)}
                                defaultChecked={
                                    notificationMethod.id === actualSelected
                                }
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                            />
                            <label
                                htmlFor={notificationMethod.id}
                                className="ml-3 block text-sm font-medium text-gray-700"
                            >
                                {notificationMethod.title}
                            </label>
                        </div>
                    ))}
                </div>
            </fieldset>
        </div>
    );
}
