import { VerificationCodeRepository } from "../domain/Verification";

interface Verification {
    code: string;
    expires: number;
}

export class StaticVerificationRepository
    implements VerificationCodeRepository
{
    private _internal: { [email: string]: Verification } = {};

    RegisterVerification(email: string, code: string): Promise<boolean> {
        if (this._internal[email] !== undefined) {
            return Promise.resolve(false);
        } else {
            this._internal[email] = {
                code: code,
                expires: Date.now() + 15 * 60 * 1000,
            };
            return Promise.resolve(true);
        }
    }
    DeleteVerification(email: string): Promise<boolean> {
        if (this._internal[email] !== undefined) {
            delete this._internal[email];
            return Promise.resolve(true);
        } else {
            return Promise.resolve(false);
        }
    }
    ValidateVerification(email: string, code: string): Promise<boolean> {
        if (this._internal[email] !== undefined) {
            let v: Verification = this._internal[email];
            if (v.code === code && Date.now() < v.expires) {
                return Promise.resolve(true);
            }
        }
        return Promise.resolve(false);
    }
}
