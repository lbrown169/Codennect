export class IncorrectCredentials extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'IncorrectCredentials'
    }
}

export class VerificationRequired extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'VerificationRequired'
    }
}
