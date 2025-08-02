import { useEffect, useState } from "react";

import { Navigation } from "../../components/navigation";
import { ToastContainer, toast } from "react-toastify";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Separator } from "../../components/ui/separator"
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label"

import { editUser } from "../../services/userService";

import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Camera } from "lucide-react"

export const Perfil = () => {
    const [isEditing, setIsEditing] = useState(false)
    const user = JSON.parse(localStorage.getItem("User"));
    const [profileData, setProfileData] = useState(user);
    console.log(user);

    const [editData, setEditData] = useState({ ...profileData })
    const [errors, setErrors] = useState({
        nombre: '',
        descripcion: ''
    });

    const handleEdit = () => {
        setIsEditing(true)
        setEditData({ ...profileData })
    }

    const handleSave = () => {
        setProfileData({ ...editData })
        handleSubmit({...editData})
        setIsEditing(false)
    }

    const handleCancel = () => {
        setEditData({ ...profileData })
        setIsEditing(false)
    }

    const handleInputChange = (field, value) => {
        setEditData((prev) => ({
        ...prev,
        [field]: value,
        }))
    }

    const getInitials = () => {
        return `${profileData.nombre.charAt(0)}${profileData.apellido_paterno.charAt(0)}`
    }

    const validateFields = (usuario) => {
        let tempErrors = {
            nombre: '',
            descripcion: ''
        };

        if (!usuario.nombre.trim()) {
            tempErrors.nombre = "El nombre es requerido";
        } else if (!usuario.apellido_paterno.trim()) {
            tempErrors.nombre = "El apellido paterno es requerido";
        } else if (!usuario.apellido_materno.trim()) {
            tempErrors.nombre = "El apellido materno es requerido";
        } else if (!usuario.correo.trim()) {
            tempErrors.nombre = "El correo es requerido";
        } else if (telefono.length > 10 || telefono == null){
            tempErrors.nombre = "El número de teléfono es inválido";
        }

        setErrors(tempErrors)

        return Object.values(tempErrors).every(error => error === '');
    }

    const handleSubmit = async (usuario) => {
        if(validateFields(usuario)) {
            try {
                if (isEditing) {
                    const response = await editUser(usuario);
                    console.log(response);
                    console.log("Usuario actualizado")
                }
            } catch (error) {
                console.error('Error al enviar: ', error);
                toast.error('Error en el servidor');
            }
        } else {
            console.log('Formulario inválido');
            toast.error("Los datos ingresados no son válidos");
        }
    }

    console.log(editData)

    return (
        <div className="min-h-screen bg-gray-50">
        <ToastContainer />
        <Navigation />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
                <p className="text-gray-600 mt-2">Gestiona tu información personal</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Card>
                    <CardHeader className="text-center">
                        <div className="relative mx-auto">
                            <Avatar className="w-24 h-24 mx-auto">
                                <AvatarImage src="/placeholder.svg" alt="Profile" />
                                <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">{getInitials()}</AvatarFallback>
                            </Avatar>
                            <Button
                                size="sm"
                                variant="outline"
                                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-transparent"
                            >
                                <Camera className="w-4 h-4" />
                            </Button>
                        </div>
                        <CardTitle className="mt-4">
                            {profileData.nombre} {profileData.apellido_paterno} {profileData.apellido_materno}
                        </CardTitle>
                        <CardDescription>{profileData.correo}</CardDescription>
                    </CardHeader>
                    </Card>
                </div>

            <div className="lg:col-span-2">
                <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Información Personal</CardTitle>
                            <CardDescription>Actualiza tu información personal y datos de contacto</CardDescription>
                        </div>
                        {!isEditing ? (
                            <Button onClick={handleEdit} variant="outline">
                            <Edit2 className="w-4 h-4 mr-2" />
                            Editar
                            </Button>
                        ) : (
                            <div className="flex space-x-2">
                            <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600">
                                <Save className="w-4 h-4 mr-2" />
                                Guardar
                            </Button>
                            <Button onClick={handleCancel} variant="outline">
                                <X className="w-4 h-4 mr-2" />
                                Cancelar
                            </Button>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                            <User className="w-5 h-5 mr-2" />
                            Datos Personales
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                            <Label htmlFor="nombre">Nombre</Label>
                            {isEditing ? (
                                <Input
                                id="nombre"
                                value={editData.nombre}
                                onChange={(e) => handleInputChange("nombre", e.target.value)}
                                className="mt-1"
                                />
                            ) : (
                                <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded-md">{profileData.nombre}</p>
                            )}
                            </div>
                            <div>
                            <Label htmlFor="apellido_paterno">Apellido Paterno</Label>
                            {isEditing ? (
                                <Input
                                id="apellido_paterno"
                                value={editData.apellido_paterno}
                                onChange={(e) => handleInputChange("apellido_paterno", e.target.value)}
                                className="mt-1"
                                />
                            ) : (
                                <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded-md">{profileData.apellido_paterno}</p>
                            )}
                            </div>
                            <div className="md:col-span-2">
                            <Label htmlFor="apellido_materno">Apellido Materno</Label>
                            {isEditing ? (
                                <Input
                                id="apellido_materno"
                                value={editData.apellido_materno}
                                onChange={(e) => handleInputChange("apellido_materno", e.target.value)}
                                className="mt-1"
                                />
                            ) : (
                                <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded-md">{profileData.apellido_materno}</p>
                            )}
                            </div>
                        </div>
                    </div>

                    <Separator />
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                            <Mail className="w-5 h-5 mr-2" />
                            Información de Contacto
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                            <Label htmlFor="email">Correo Electrónico</Label>
                            {isEditing ? (
                                <Input
                                id="email"
                                type="email"
                                value={editData.correo}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                className="mt-1"
                                />
                            ) : (
                                <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded-md">{profileData.correo}</p>
                            )}
                            </div>
                            <div>
                            <Label htmlFor="email">Teléfono</Label>
                            {isEditing ? (
                                <Input
                                id="telefono"
                                type="telefono"
                                value={editData.telefono}
                                onChange={(e) => handleInputChange("telefono", e.target.value)}
                                className="mt-1"
                                />
                            ) : (
                                <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded-md">{profileData.telefono}</p>
                            )}
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                            <Calendar className="w-5 h-5 mr-2" />
                            Información de Cuenta
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                            <Label>Estado de la Cuenta</Label>
                            {(user.estatus) ? (
                                <p className="mt-1 text-sm text-green-600 bg-green-50 p-2 rounded-md font-medium">Activa</p>
                            ) : (
                                <p className="mt-1 text-sm text-red-600 bg-red-50 p-2 rounded-md font-medium">Inactivo</p>
                            )}
                            </div>
                        </div>
                    </div>
                </CardContent>
                </Card>
            </div>
            </div>
        </div>
        </div>
    )
}