"use client";
import * as React from "react";

export default function useForkRef<Instance>(...refs: Array<React.Ref<Instance> | undefined>): React.RefCallback<Instance> | null {
    /**
     * This will create a new function if the refs passed to this hook change and are all defined.
     * This means react will call the old forkRef with `null` and the new forkRef
     * with the ref. Cleanup naturally emerges from this behavior.
     */
    return React.useMemo(() => {
        if (refs.every((ref) => ref == null)) {
            return null;
        }

        return (instance) => {
            refs.forEach((ref) => {
                setRef(ref, instance);
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, refs);
}

function setRef<T>(ref: React.MutableRefObject<T | null> | ((instance: T | null) => void) | null | undefined, value: T | null): void {
    if (typeof ref === "function") {
        ref(value);
    } else if (ref) {
        ref.current = value;
    }
}
