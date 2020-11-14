import { OAuth2Client } from 'google-auth-library';

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
    public async verify(token: string) {
        try {
            const ticket = await this._client.verifyIdToken({
                idToken: token,
                audience: this._clientId,  // Specify the CLIENT_ID of the app that accesses the backend
                // Or, if multiple clients access the backend:
                //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
            });

            const payload = ticket.getPayload();

            const userid = payload['sub'];
            // If request specified a G Suite domain:
            // const domain = payload['hd'];
        } catch (error) {
            throw error;
        }
    }
}

export default new GoogleAuthHelper(process.env.GOOGLE_CLIENT_ID)