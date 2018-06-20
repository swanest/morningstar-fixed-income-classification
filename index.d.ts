declare module 'morningstar-fixed-income-classification' {
    interface IEquityData {
        code: number;
        description?: string;
        name: string;
        primarySector?: number;
        sector?: number;
        superSector?: number;
        type: string;
    }

    export function above(code: string | number): IEquityData[];

    export function all(): {
        [code: string]: IEquityData;
    };

    export function below(code: string | number): IEquityData[];

    export function find(code: string | number): IEquityData;

    export function search(keyword?: string, type?: string): IEquityData[];
}
