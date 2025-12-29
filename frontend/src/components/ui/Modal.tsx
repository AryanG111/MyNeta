import * as React from "react"
import { X } from "lucide-react"
import { Button } from "./Button"
import { Card, CardContent, CardHeader, CardTitle } from "./Card"

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    description?: string;
}

export function Modal({ isOpen, onClose, title, description, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg animate-in zoom-in-95 duration-200">
                <Card className="border-none shadow-xl max-h-[90vh] flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                        <div className="space-y-1">
                            <CardTitle>{title}</CardTitle>
                            {description && <p className="text-sm text-slate-500">{description}</p>}
                        </div>
                        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="overflow-y-auto py-4">
                        {children}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
