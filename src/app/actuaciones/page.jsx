"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Search, Plus, Scale } from "lucide-react";

export default function ActuacionesPage() {
    const [formData, setFormData] = useState({
        numeroProceso: "",
        fechaActuacion: "",
        tipoActuacion: "",
        descripcion: "",
    });

    const [searchQuery, setSearchQuery] = useState("");

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Registrando actuación:", formData);
        // Aquí iría la lógica de registro (enviar al backend)
    };

    const handleSearch = () => {
        console.log("Buscando proceso:", searchQuery);
        // Aquí iría la lógica de búsqueda
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8 text-black">
            <div className="mx-auto max-w-6xl space-y-8">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-3">
                        <Scale className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Registro de Actuaciones</h1>
                        <p className="text-gray-600">
                            Gestiona las actuaciones procesales del sistema
                        </p>
                    </div>
                </div>

                {/* Add Actuación Form */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Plus className="h-5 w-5 text-primary" />
                            <CardTitle>Agregar Actuación</CardTitle>
                        </div>
                        <CardDescription>
                            Complete el formulario para registrar una nueva actuación procesal
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
                                        onChange={(e) =>
                                            handleInputChange("numeroProceso", e.target.value)
                                        }
                                        className="placeholder-black text-black"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fechaActuacion">Fecha de Actuación</Label>
                                    <Input
                                        id="fechaActuacion"
                                        type="date"
                                        value={formData.fechaActuacion}
                                        onChange={(e) =>
                                            handleInputChange("fechaActuacion", e.target.value)
                                        }
                                        className="text-black"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="tipoActuacion">Tipo de Actuación</Label>
                                    <Input
                                        id="tipoActuacion"
                                        placeholder="Ej: notificación, audiencia, sentencia..."
                                        value={formData.tipoActuacion}
                                        onChange={(e) =>
                                            handleInputChange("tipoActuacion", e.target.value)
                                        }
                                        className="placeholder-black text-black"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="descripcion">Descripción de la Actuación</Label>
                                    <Textarea
                                        id="descripcion"
                                        placeholder="Describa los detalles de la actuación"
                                        value={formData.descripcion}
                                        onChange={(e) =>
                                            handleInputChange("descripcion", e.target.value)
                                        }
                                        rows={4}
                                        className="placeholder-black text-black"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" className="gap-2">
                                    <FileText className="h-4 w-4" />
                                    Guardar Actuación
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
                            <CardTitle>Consultar Actuaciones por Proceso</CardTitle>
                        </div>
                        <CardDescription>
                            Busque todas las actuaciones asociadas a un número de proceso
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="searchProceso">Número de Proceso</Label>
                                <Input
                                    id="searchProceso"
                                    placeholder="Ingrese el número de proceso"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="placeholder-black text-black"
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
