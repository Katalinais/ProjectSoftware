"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FileText, Search, Download } from "lucide-react";

export default function ReportesPage() {
    const [tipoReporte, setTipoReporte] = useState("");
    const [periodo, setPeriodo] = useState("");
    const [busqueda, setBusqueda] = useState("");

    const handleGenerarReporte = (e) => {
        e.preventDefault();
        console.log("Generar reporte:", { tipoReporte, periodo });
        // Aquí iría la lógica para generar el reporte
    };

    const handleBuscarReporte = (e) => {
        e.preventDefault();
        console.log("Buscar reporte:", busqueda);
        // Aquí iría la lógica para buscar reportes anteriores
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8 text-black">
            <div className="mx-auto max-w-6xl space-y-8">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold text-foreground">Generación de Reportes</h1>
                </div>

                {/* Generar Reporte */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Download className="h-5 w-5" />
                            Generar reporte de procesos
                        </CardTitle>
                        <CardDescription>
                            Selecciona el tipo de reporte y el periodo para generar un informe detallado
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleGenerarReporte} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="tipo-reporte">Tipo de reporte</Label>
                                    <Select value={tipoReporte} onValueChange={setTipoReporte}>
                                        <SelectTrigger id="tipo-reporte">
                                            <SelectValue placeholder="Seleccionar tipo de reporte" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="por-estado">Procesos por estado</SelectItem>
                                            <SelectItem value="por-tipo">Procesos por tipo</SelectItem>
                                            <SelectItem value="por-juez">Actuaciones por juez</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="periodo">Periodo</Label>
                                    <Input
                                        id="periodo"
                                        type="month"
                                        value={periodo}
                                        onChange={(e) => setPeriodo(e.target.value)}
                                        className="placeholder-black text-black"
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full md:w-auto">
                                <Download className="mr-2 h-4 w-4" />
                                Generar Reporte
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Buscar Reporte */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5" />
                            Buscar reporte anterior
                        </CardTitle>
                        <CardDescription>
                            Ingresa el código o nombre del reporte que deseas consultar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleBuscarReporte} className="flex flex-col gap-4 md:flex-row">
                            <div className="flex-1">
                                <Input
                                    placeholder="Código o nombre del reporte"
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    className="placeholder-black text-black"
                                />
                            </div>
                            <Button type="submit" variant="secondary">
                                <Search className="mr-2 h-4 w-4" />
                                Buscar
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
