import Vue from 'vue';

export function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function isPromise(val: any): val is Promise<any> {
    return !!val && typeof val === 'object' && typeof val.then === 'function' && typeof val.catch === 'function';
}

export function SGuard(options?: {}) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const fn = <Function>descriptor.value;

        descriptor.value = async function(this: Vue, ...args: any[]) {
            const l = this.$loading.show({
            });
            let fnResult: any;
            try {
                fnResult = fn.apply(this, args);
                if (isPromise(fnResult)) {
                    console.log(fnResult);
                    fnResult = await fnResult;
                }
            }
            catch (err) {
                console.log('err', err);
            }
            l.hide();
            return fnResult;
        };
    };
}
