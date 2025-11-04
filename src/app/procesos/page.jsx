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
import { Scale, Search, FileText } from "lucide-react";

export default function ProcesosPage() {
    const [formData, setFormData] = useState({
        numeroProceso: "",
        tipoProceso: "",
        fechaInicio: "",
        estado: "",
    });

    const [searchQuery, setSearchQuery] = useState("");

    const handleInputChange = (field, value) => {

        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {

        e.preventDefault();
        console.log("Registrando proceso:", formData);
        // Aquí iría la lógica de registro
    };

    const handleSearch = () => {
        console.log("Buscando proceso:", searchQuery);
        // Aquí iría la lógica de búsqueda
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="mx-auto max-w-6xl space-y-8">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-3">
                        <Scale className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Gestión de Procesos Judiciales</h1>
                        <p className="text-muted-foreground">Administra los procesos judiciales del sistema</p>
                    </div>
                </div>

                {/* Registration Form */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            <CardTitle>Registrar Nuevo Proceso</CardTitle>
                        </div>
                        <CardDescription>
                            Complete el formulario para registrar un nuevo proceso judicial
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="numeroProceso">Número de Proceso</Label>
                                    <Input
                                        id="numeroProceso"
                                        placeholder="Ingrese el número de proceso"
                                        value={formData.numeroProceso}
                                        onChange={(e) => handleInputChange("numeroProceso", e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tipoProceso">Tipo de Proceso</Label>
                                    <Input
                                        id="tipoProceso"
                                        placeholder="Civil, penal, laboral, etc."
                                        value={formData.tipoProceso}
                                        onChange={(e) => handleInputChange("tipoProceso", e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
                                    <Input
                                        id="fechaInicio"
                                        type="date"
                                        value={formData.fechaInicio}
                                        onChange={(e) => handleInputChange("fechaInicio", e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="estado">Estado del Proceso</Label>
                                    <Select
                                        value={formData.estado}
                                        onValueChange={(value) => handleInputChange("estado", value)}
                                    >
                                        <SelectTrigger id="estado">
                                            <SelectValue placeholder="Seleccione un estado" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en_tramite">En trámite</SelectItem>
                                            <SelectItem value="finalizado">Finalizado</SelectItem>
                                            <SelectItem value="archivado">Archivado</SelectItem>
                                            <SelectItem value="suspension">En suspensión</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" className="gap-2">
                                    <FileText className="h-4 w-4" />
                                    Registrar Proceso
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Search Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Search className="h-5 w-5 text-accent" />
                            <CardTitle>Buscar Proceso</CardTitle>
                        </div>
                        <CardDescription>
                            Busque un proceso judicial por su número
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="search">Número de Proceso</Label>
                                <Input
                                    id="search"
                                    placeholder="Ingrese el número de proceso"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex items-end">
                                <Button
                                    onClick={handleSearch}
                                    variant="default"
                                    className="gap-2 bg-accent hover:bg-accent/90"
                                >
                                    <Search className="h-4 w-4" />
                                    Buscar
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
