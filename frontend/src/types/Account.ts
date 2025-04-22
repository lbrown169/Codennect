export type ProviderName = 'github' | 'discord'

export type Account = {
    [provider in ProviderName]: AccountDetails
}

type AccountDetails = {
    name: string
    id: string
}
