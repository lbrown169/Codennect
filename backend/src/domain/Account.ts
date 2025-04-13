import { ProviderName } from "src/integration/Provider.js";

export type Account = {
    [provider in ProviderName]: AccountDetails;
};

type AccountDetails = {
    name: string;
    id: string;
};
