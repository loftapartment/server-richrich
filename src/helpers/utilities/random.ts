import * as Crypto from 'crypto';

class RandomClass {
    /**
     * assets
     */
    private _numbers: string[] = [];
    private _alphabetUppers: string[] = [];
    private _alphabetLowers: string[] = [];
    private _specialCharacters: string[] = [];

    constructor() {
        this.initNumbers();
        this.initAlphabetUppers();
        this.initAlphabetLowers();
        this.initSpecialCharacters();
    }

    /**
     * 
     */
    public getToken(): string {
        try {
            let now: string = Date.now().toString();
            return Crypto.createHash('sha256')
                .update(now, 'utf8')
                .digest('base64').slice(0, 12);
        } catch (error) {
            throw error;
        }
    }

    /**
     * get random text
     * @description if all options are false, will return ''
     */
    public getRandomTxt(): string
    public getRandomTxt(options: Random.IRandomOption): string
    public getRandomTxt(options?: Random.IRandomOption): string {
        let text: string = '';
        let resources: string[] = [];

        if (!!options) {
            options.isNumber = options.isNumber === false ? false : true;
            options.isAlphabetUpper = options.isAlphabetUpper === false ? false : true;
            options.isAlphabetLower = options.isAlphabetLower === false ? false : true;
            options.isSpecialCharacter = options.isSpecialCharacter === false ? false : true;
            options.length = options.length || 8;
        } else {
            options = {
                isNumber: true,
                isAlphabetUpper: true,
                isAlphabetLower: true,
                isSpecialCharacter: true,
                length: 8
            }
        }

        if (options.isNumber) {
            resources = resources.concat(this._numbers);
        }
        if (options.isAlphabetUpper) {
            resources = resources.concat(this._alphabetUppers);
        }
        if (options.isAlphabetLower) {
            resources = resources.concat(this._alphabetLowers);
        }
        if (options.isSpecialCharacter) {
            resources = resources.concat(this._specialCharacters);
        }

        for (let i = 0; i < options.length; i++) {
            let randomIndex: number = this.getRandomInteger(resources.length);
            text += resources[randomIndex];
        }

        return text;
    }

    /**
     * 
     * @param max 
     */
    public getRandomInteger(max: number): number {
        let random = Math.floor(Math.random() * max);
        return random;
    }

    /**
     * 
     */
    private initNumbers(): void {
        for (let i = 0; i < 10; i++) {
            this._numbers.push(i.toString());
        }
    }

    /**
     * 
     */
    private initAlphabetUppers(): void {
        for (let i = 65; i < 91; i++) {
            this._alphabetUppers.push(String.fromCharCode(i));
        }
    }

    /**
     * 
     */
    private initAlphabetLowers(): void {
        for (let i = 97; i < 123; i++) {
            this._alphabetLowers.push(String.fromCharCode(i));
        }
    }

    /**
     * 
     */
    private initSpecialCharacters(): void {
        this._specialCharacters = ['~', '!', '@', '#', '$', '%', '^', '&', '*'];
    }
}

export const Random = new RandomClass();

export namespace Random {
    export interface IRandomOption {
        /**
         * @default true
         */
        isNumber?: boolean;

        /**
         * @default true
         */
        isAlphabetUpper?: boolean;

        /**
         * @default true
         */
        isAlphabetLower?: boolean;

        /**
         * @default true
         */
        isSpecialCharacter?: boolean;

        /**
         * @default 8
         */
        length?: number;
    }
}