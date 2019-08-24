/* tslint:disable */
declare module 'java.io' {
    export function addObject(classname: any, convertor: any): any;
    function constants(): any;
    export function normalize(obj: boolean|string|number, type?: 'string'|'boolean'|'int'|'short'|'long'|'char'|'byte'|'float'|'double'): JObject<any>
    export function normalize<T>(obj: T, type: 'string'|'boolean'|'int'|'short'|'long'|'char'|'byte'|'float'|'double'): JObject<T>

    export interface JClass {
        flags: number
        serialVersionUID: string
        fields: {classname?: string, name: string, type: string}[]
        name: string
        superClass: null // ?
    }


    export interface JObject<T> {
        $: object
        $class: JClass
        _$?: object
    }

    export interface NormalJObject<T> {
        $: { [P in keyof T]?: JObject<T[P]>; }
        $class: JClass
        _$?: object
    }

    class InputStream {
        constructor(buf: Buffer, withType: boolean);
        readObject(): any;
    }

    class OutputStream {
        constructor();
        writeObject(obj: object): Buffer;
    }

    export {
        InputStream as InputObjectStream,
        OutputStream as OutputObjectStream
    };
}
