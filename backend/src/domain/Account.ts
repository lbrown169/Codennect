import { ProviderName } from "../integration/Provider";

export type Account = {
    [provider in ProviderName]: AccountDetails;
};

type AccountDetails = {
    name: string;
    id: string;
};
