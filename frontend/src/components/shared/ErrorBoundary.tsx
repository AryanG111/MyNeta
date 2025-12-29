import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    private handleReload = () => {
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 p-4 text-center">
                    <h1 className="text-4xl font-bold text-slate-800 mb-2">Oops!</h1>
                    <h2 className="text-xl font-semibold text-slate-600 mb-4">Something went wrong</h2>
                    <p className="text-slate-500 max-w-md mb-8">
                        {this.state.error?.message || "An unexpected error occurred. Please try again."}
                    </p>
                    <div className="flex gap-4">
                        <Button onClick={this.handleReload}>
                            Reload Page
                        </Button>
                        <Button variant="outline" onClick={() => window.location.href = '/'}>
                            Go Home
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
