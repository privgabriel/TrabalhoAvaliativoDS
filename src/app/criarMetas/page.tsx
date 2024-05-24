"use client";

import { ref, onValue, push } from "firebase/database";
import {auth, db} from "@/services/firebase/firebaseConfiguration";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import {onAuthStateChanged} from "firebase/auth";

interface IMetas {
    [key: string]: {
        id_usuario: string;
        tipo: string;
        data_conclusao: string;
        data_inicio: string;
        descricao: string;
        status: string;
        titulo: string;
    };
}

export default function Home() {
    const { userAuth } = useAuthContext();
    const [authUser, setAuthUser] = useState(null);
    const [newMetas, setNewMetas] = useState({
        id_usuario: "",
        titulo: "",
        tipo: "",
        data_conclusao: "",
        data_inicio: "",
        descricao: "",
        status: "",
    });
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("Usuário logado: ", user.uid);
                setAuthUser(user);
                setNewMetas((prevMetas) => ({
                    ...prevMetas,
                    id_usuario: user.uid,
                }));
            } else {
                console.log("Usuário deslogado");
                setAuthUser(null);
                router.push("/login");
            }
        });

        // Clean up the subscription on unmount
        return () => unsubscribe();
    }, [auth]);

    const addNewMetas = () => {
        if (!newMetas.id_usuario) {
            console.error('User ID is undefined');
            return;
        }

        push(ref(db, "/metas"), newMetas)
            .then(() => {
                setNewMetas({
                    id_usuario: authUser?.uid || "",
                    titulo: "",
                    tipo: "",
                    data_conclusao: "",
                    data_inicio: "",
                    descricao: "",
                    status: "",
                });
                router.push("/");
            })
            .catch((error) => {
                console.error('Error adding new meta:', error);
            });
    };

    return (
        <div className="min-h-screen bg-gray-800 py-6 flex flex-col justify-center sm:py-12">
            <div className="max-w-md mx-auto">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        addNewMetas();
                    }}
                >
                    <div className="mb-4">
                        <h2 className="text-center text-3xl mb-8 font-extrabold text-white">
                            Cadastrar Nova Meta!
                        </h2>
                        <label
                            className="block text-gray-300 text-sm font-bold mb-2"
                            htmlFor="tipo"
                        >
                            Tipo:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="tipo"
                            type="text"
                            placeholder="Tipo"
                            value={newMetas.tipo}
                            onChange={(e) =>
                                setNewMetas({ ...newMetas, tipo: e.target.value })
                            }
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-300 text-sm font-bold mb-2"
                            htmlFor="titulo"
                        >
                            Título:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="titulo"
                            type="text"
                            placeholder="Título"
                            value={newMetas.titulo}
                            onChange={(e) =>
                                setNewMetas({ ...newMetas, titulo: e.target.value })
                            }
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-300 text-sm font-bold mb-2"
                            htmlFor="data_inicio"
                        >
                            Data de Início:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="data_inicio"
                            type="text"
                            placeholder="Data de Início"
                            value={newMetas.data_inicio}
                            onChange={(e) =>
                                setNewMetas({ ...newMetas, data_inicio: e.target.value })
                            }
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-300 text-sm font-bold mb-2"
                            htmlFor="data_conclusao"
                        >
                            Data Conclusão:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="data_conclusao"
                            type="text"
                            placeholder="Data Conclusão"
                            value={newMetas.data_conclusao}
                            onChange={(e) =>
                                setNewMetas({ ...newMetas, data_conclusao: e.target.value })
                            }
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-300 text-sm font-bold mb-2"
                            htmlFor="descricao"
                        >
                            Descrição:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="descricao"
                            type="text"
                            placeholder="Descrição"
                            value={newMetas.descricao}
                            onChange={(e) =>
                                setNewMetas({ ...newMetas, descricao: e.target.value })
                            }
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-300 text-sm font-bold mb-2"
                            htmlFor="status"
                        >
                            Status:
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="status"
                            type="text"
                            placeholder="Status"
                            value={newMetas.status}
                            onChange={(e) =>
                                setNewMetas({ ...newMetas, status: e.target.value })
                            }
                        />
                    </div>
                    <div className="flex items-center justify-center">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Adicionar Meta
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
