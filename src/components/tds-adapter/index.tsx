import React, { useEffect, useState } from 'react';
import { Button as FallbackButton } from '@/components/ui/button';
import { Input as FallbackInput } from '@/components/ui/input';
import { Dialog as FallbackDialog, DialogContent as FallbackDialogContent, DialogTrigger as FallbackDialogTrigger } from '@/components/ui/dialog';
import { Toaster as FallbackToaster } from '@/components/ui/toaster';
import { TooltipProvider as FallbackTooltipProvider } from '@/components/ui/tooltip';

function useTdsModule() {
	const [mod, setMod] = useState<unknown>(null);
	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const name = '@toss/tds-mobile';
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore dynamic import
				const m = await import(name).catch(() => null);
				if (mounted && m) setMod(m as unknown);
			} catch (e) {
				// ignore
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);
	return mod;
}

// Allow `any` for the thin adapter props spread — intentionally forwarded to runtime component
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Button(props: any) {
	const tds = useTdsModule();
	const Comp = tds?.Button ?? FallbackButton;
	return <Comp {...props} />;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Input(props: any) {
	const tds = useTdsModule();
	const Comp = tds?.Input ?? FallbackInput;
	return <Comp {...props} />;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Dialog(props: any) {
	const tds = useTdsModule();
	const Comp = tds?.Dialog ?? FallbackDialog;
	return <Comp {...props} />;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DialogContent(props: any) {
	const tds = useTdsModule();
	const Comp = tds?.DialogContent ?? FallbackDialogContent;
	return <Comp {...props} />;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DialogTrigger(props: any) {
	const tds = useTdsModule();
	const Comp = tds?.DialogTrigger ?? FallbackDialogTrigger;
	return <Comp {...props} />;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Toaster(props: any) {
	const tds = useTdsModule();
	const Comp = tds?.Toaster ?? FallbackToaster;
	return <Comp {...props} />;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TooltipProvider({ children, ...rest }: any) {
	const tds = useTdsModule();
	const Provider = tds?.TooltipProvider ?? FallbackTooltipProvider;
	return <Provider {...rest}>{children}</Provider>;
}

// Usage: import { Button } from '@/components/tds-adapter';
// This adapter lazy-loads `@toss/tds-mobile` when available, otherwise
// it falls back to the shadcn-ui primitives under `@/components/ui`.
