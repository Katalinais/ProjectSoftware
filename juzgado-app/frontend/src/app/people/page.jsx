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
import { UserPlus, Search, Users } from "lucide-react";

export default function PersonasPage() {
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        tipoDocumento: "",
        numeroDocumento: "",
    });

    const [searchQuery, setSearchQuery] = useState("");

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Registrando persona:", formData);
        // Aquí iría la lógica de registro (enviar al backend)
    };

    const handleSearch = () => {
        console.log("Buscando documento:", searchQuery);
        // Aquí iría la lógica de búsqueda (consulta al backend)
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8 text-black">
            <div className="mx-auto max-w-6xl space-y-8">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-3">
                        <Users className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Gestión de Personas</h1>
                        <p className="text-gray-600">Administra el registro de personas del sistema</p>
                    </div>
                </div>

                {/* Registration Form */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5 text-primary" />
                            <CardTitle>Registrar Nueva Persona</CardTitle>
                        </div>
                        <CardDescription>
                            Complete el formulario para registrar una nueva persona en el sistema
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="nombre">Nombre</Label>
                                    <Input
                                        id="nombre"
                                        placeholder="Ingrese el nombre"
                                        value={formData.nombre}
                                        onChange={(e) => handleInputChange("nombre", e.target.value)}
                                        className="placeholder-black text-black"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="apellido">Apellido</Label>
                                    <Input
                                        id="apellido"
                                        placeholder="Ingrese el apellido"
                                        value={formData.apellido}
                                        onChange={(e) => handleInputChange("apellido", e.target.value)}
                                        className="placeholder-black text-black"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tipoDocumento">Tipo de Documento</Label>
                                    <Select
                                        value={formData.tipoDocumento}
                                        onValueChange={(value) => handleInputChange("tipoDocumento", value)}
                                    >
                                        <SelectTrigger id="tipoDocumento">
                                            <SelectValue placeholder="Seleccione un tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                                            <SelectItem value="TI">Tarjeta de Identidad</SelectItem>
                                            <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                                            <SelectItem value="PA">Pasaporte</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="numeroDocumento">Número de Documento</Label>
                                    <Input
                                        id="numeroDocumento"
                                        placeholder="Ingrese el número de documento"
                                        value={formData.numeroDocumento}
                                        onChange={(e) => handleInputChange("numeroDocumento", e.target.value)}
                                        className="placeholder-black text-black"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button type="submit" className="gap-2">
                                    <UserPlus className="h-4 w-4" />
                                    Registrar Persona
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
                            <CardTitle>Buscar Persona</CardTitle>
                        </div>
                        <CardDescription>
                            Busque una persona registrada por su número de documento
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="search">Número de Documento</Label>
                                <Input
                                    id="search"
                                    placeholder="Ingrese el número de documento"
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
