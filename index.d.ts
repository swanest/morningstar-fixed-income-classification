declare module 'morningstar-fixed-income-classification' {
    export interface IFixedData {
        code: number;
        description?: string;
        name: string;
        primarySector?: number;
        sector?: number;
        superSector?: number;
        type: string;
    }

    export function above(code: string | number): IFixedData[];

    export function all(): {
        [code: string]: IFixedData;
    };

    export function below(code: string | number): IFixedData[];

    export function find(code: string | number): IFixedData;

    export function search(keyword?: string, type?: string): IFixedData[];
}
