import * as Crypto from 'crypto';
import { PRIVATE_KEY, PUBLIC_KEY } from '../../private/token';

class AuthToken {

    private readonly _ISS: string = 'Loftapartment';
    private readonly _SUB: string = 'RichRich';
    private readonly _AUD: string = 'RichRich';

    /**
     * 
     * @param data 
     */
    public encodePayload<T>(data: T): string {
        try {
            const nowMs = Date.now();
            let payload = {
                ...data,
                iss: this._ISS,
                sub: this._SUB,
                aud: this._AUD,
                exp: nowMs + parseInt(process.env.AUTH_TOKEN_EXPIRED_SEC) * 1000,
                iat: nowMs
            };

            // let encodeMsg: Buffer = Crypto.publicEncrypt(PUBLIC_KEY, Buffer.from(JSON.stringify(payload)));
            let encodeMsg: Buffer = Crypto.privateEncrypt(PRIVATE_KEY, Buffer.from(JSON.stringify(payload)));
            let signature = Crypto.sign('sha256', encodeMsg, PRIVATE_KEY);

            return `${encodeMsg.toString('base64')}.${signature.toString('base64')}`;
        } catch (error) {
            throw error;
        }
    }

    /**
     * 
     * @param data 
     */
    public decodePayload<T>(data: string): T & AuthToken.IExtendPayload {
        try {
            let datas: string[] = data.split('.');
            if (datas.length !== 2) {
                throw 'token format invalid';
            }

            let buffer: Buffer = Buffer.from(datas[0], 'base64');
            let signature: Buffer = Buffer.from(datas[1], 'base64');
            let isValid: boolean = Crypto.verify('sha256', buffer, PUBLIC_KEY, signature);
            if (!isValid) {
                throw 'token format invalid';
            }

            let decodeMsg = Crypto.publicDecrypt(PUBLIC_KEY, buffer);

            return JSON.parse(Buffer.from(decodeMsg).toString());
        } catch (error) {
            throw error;
        }
    }
}

namespace AuthToken {
    export interface IExtendPayload {
        iss: string;
        sub: string;
        aud: string;
        exp: number;
        iat: number;
    }
}

export const AuthTokenHelper = new AuthToken();