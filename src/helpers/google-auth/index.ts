import { LoginTicket, OAuth2Client } from 'google-auth-library';

export class GoogleAuthHelper {
    /**
     * 
     */
    private _client: OAuth2Client = undefined;

    private _clientId: string = '';

    constructor(clientId: string) {
        this._clientId = clientId;

        this._client = new OAuth2Client(clientId);
    }

    /**
     * 
     * @param token 
     */
    public async verify(token: string): Promise<LoginTicket> {
        try {
            const ticket: LoginTicket = await this._client.verifyIdToken({
                idToken: token,
                audience: this._clientId,  // Specify the CLIENT_ID of the app that accesses the backend
            });

            return ticket;
        } catch (error) {
            throw error;
        }
    }
}

export default new GoogleAuthHelper(process.env.GOOGLE_CLIENT_ID)