// Mamma mia
/*
import { VerificationCodeRepository } from "../domain/Verification.js";

interface Verification {
    code: string;
    expires: number;
}

export class StaticVerificationRepository
    implements VerificationCodeRepository
{
    private _internal: { [email: string]: Verification } = {};

    async RegisterVerification(email: string, code: string): Promise<boolean> {
        if (this._internal[email] !== undefined) {
            return false;
        } else {
            this._internal[email] = {
                code: code,
                expires: Date.now() + 15 * 60 * 1000,
            };
            return true;
        }
    }
    async DeleteVerification(email: string): Promise<boolean> {
        if (this._internal[email] !== undefined) {
            delete this._internal[email];
            return true;
        } else {
            return false;
        }
    }
    async ValidateVerification(email: string, code: string): Promise<boolean> {
        if (this._internal[email] !== undefined) {
            let v: Verification = this._internal[email];
            if (v.code === code && Date.now() < v.expires) {
                return true;
            }
        }
        return false;
    }
}
*/
